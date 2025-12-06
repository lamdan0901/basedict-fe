import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import { TFlashCardSetForm } from "@/modules/flashcard/schema";
import { FLASHCARD_LIMIT } from "@/modules/flashcard/const";

type SupabaseClientType = SupabaseClient<Database>;

const checkFlashcardLimit = async (
  client: SupabaseClientType,
  userId: string
) => {
  const { data: user, error: userError } = await client
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (userError) throw userError;
  if (!user) throw new Error("User not found");

  if (user.role === "vipuser" || user.role === "admin") return;

  const [
    { count: createdCount, error: createdError },
    { count: learnedCount, error: learnedError },
  ] = await Promise.all([
    client
      .from("flash_card_sets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    client
      .from("flash_card_learners")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_learning", true),
  ]);

  if (createdError) throw createdError;
  if (learnedError) throw learnedError;

  const total = (createdCount || 0) + (learnedCount || 0);

  if (total >= 5) {
    throw "FORBIDDEN";
  }
};

export const createFlashcardRepository = (client: SupabaseClientType) => ({
  async getTags(options?: {
    search?: string;
    excludeEmpty?: boolean;
  }): Promise<TFlashcardTag[]> {
    let query = client
      .from("tags")
      .select("id, name, count")
      .order("count", { ascending: false });

    if (options?.search) {
      query = query.ilike("name", `%${options.search}%`);
    }

    if (options?.excludeEmpty) {
      query = query.gt("count", 0);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as TFlashcardTag[];
  },

  async getDiscoverSets(options?: {
    limit?: number;
  }): Promise<{ data: TFlashcardSet[]; total: number }> {
    const { data, error, count } = await client
      .from("flash_card_sets")
      .select(
        `
        id, title, description, updated_at, popular, is_public, user_id,
        users:users!flash_card_sets_user_id_fkey (id, name, avatar, role, jlptlevel),
        flash_card_set_tags (
          tags (name)
        ),
        flash_cards (id),
        active_learners:flash_card_learners(count),
        all_learners:flash_card_learners(count)
      `,
        { count: "exact" }
      )
      .eq("is_public", true)
      .eq("active_learners.is_learning", true)
      .order("popular", { ascending: false })
      .limit(options?.limit || 9);

    if (error) throw error;

    const formattedData =
      data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        updatedAt: item.updated_at,
        learnedNumber: item.all_learners?.[0]?.count || 0,
        learningNumber: item.active_learners?.[0]?.count || 0,
        owner: item.users
          ? {
              id: item.users.id,
              authId: item.users.id,
              name: item.users.name,
              avatar: item.users.avatar || "",
              role: item.users.role,
              jlptlevel: item.users.jlptlevel,
            }
          : undefined,
        tags:
          item.flash_card_set_tags
            ?.map((t: any) => t.tags?.name)
            .filter(Boolean) || [],
        flashCardNumber: item.flash_cards?.length || 0,
        isLearning: false,
      })) || [];

    return { data: formattedData, total: count || 0 };
  },

  async getTopCreators(): Promise<TFlashcardCreator[]> {
    const { data, error } = await client
      .from("users")
      .select(
        `
        id, name, avatar, role, jlptlevel, popular,
        flash_card_sets:flash_card_sets!flash_card_sets_user_id_fkey (id)
      `
      )
      .order("popular", { ascending: false })
      .limit(5);

    if (error) throw error;

    return (
      data?.map((user: any) => ({
        id: user.id,
        authId: user.id,
        name: user.name,
        avatar: user.avatar || "",
        role: user.role,
        jlptlevel: user.jlptlevel,
        flashCardSetNumber: user.flash_card_sets?.length || 0,
        totalLearnedNumber: user.popular || 0,
        totalLearningNumber: 0,
      })) || []
    );
  },

  async searchFlashcardSets({
    search,
    tagName,
    sort,
    limit = 20,
    offset = 0,
  }: {
    search?: string;
    tagName?: string;
    sort: "popular" | "updated_at";
    limit?: number;
    offset?: number;
  }): Promise<{ data: TFlashcardSet[]; total: number }> {
    let query = client
      .from("flash_card_sets")
      .select(
        `
        id, title, description, updated_at, popular, is_public, user_id,
        users:users!flash_card_sets_user_id_fkey (id, name, avatar, role, jlptlevel),
        flash_card_set_tags!inner (
          tags!inner (name)
        ),
        flash_cards (id),
        active_learners:flash_card_learners(count),
        all_learners:flash_card_learners(count)
      `,
        { count: "exact" }
      )
      .eq("is_public", true)
      .eq("active_learners.is_learning", true);

    if (search) {
      if (search.startsWith("#")) {
        const tagSearch = search.slice(1);
        query = query.eq("flash_card_set_tags.tags.name", tagSearch);
      } else {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`
        );
      }
    }

    if (tagName) {
      query = query.eq("flash_card_set_tags.tags.name", tagName);
    }

    query = query.order(sort, {
      ascending: false,
    });

    const { data, error, count } = await query.range(
      offset,
      offset + limit - 1
    );

    if (error) throw error;

    const formattedData =
      data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        updatedAt: item.updated_at,
        learnedNumber: item.all_learners?.[0]?.count || 0,
        learningNumber: item.active_learners?.[0]?.count || 0,
        owner: item.users
          ? {
              id: item.users.id,
              authId: item.users.id,
              name: item.users.name,
              avatar: item.users.avatar || "",
              role: item.users.role,
              jlptlevel: item.users.jlptlevel,
            }
          : undefined,
        tags:
          item.flash_card_set_tags
            ?.map((t: any) => t.tags?.name)
            .filter(Boolean) || [],
        flashCardNumber: item.flash_cards?.length || 0,
        isLearning: false,
      })) || [];

    return { data: formattedData, total: count || 0 };
  },

  async getFlashcardSetById(
    id: string,
    userId?: string
  ): Promise<TFlashcardSet> {
    let query = client
      .from("flash_card_sets")
      .select(
        `
        id, title, description, updated_at, popular, user_id,
        users:users!flash_card_sets_user_id_fkey (id, name, avatar, role, jlptlevel),
        flash_card_set_tags (
          tags (name)
        ),
        flash_cards (id, front_side, back_side, front_side_comment, back_side_comment),
        flash_card_learners (user_id, is_learning),
        active_learners:flash_card_learners(count),
        all_learners:flash_card_learners(count)
      `
      )
      .eq("id", id)
      .eq("active_learners.is_learning", true);

    if (userId) {
      query = query.eq("flash_card_learners.user_id", userId);
    }

    const { data, error } = (await query.single()) as any;

    if (error) throw error;

    const isLearning =
      data.flash_card_learners && data.flash_card_learners.length > 0
        ? data.flash_card_learners[0].is_learning
        : false;

    return {
      id: data.id,
      title: data.title,
      description: data.description || "",
      updatedAt: data.updated_at,
      learnedNumber: data.all_learners?.[0]?.count || 0,
      learningNumber: data.active_learners?.[0]?.count || 0,
      owner: data.users
        ? {
            id: data.users.id,
            authId: data.users.id,
            name: data.users.name,
            avatar: data.users.avatar || "",
            role: data.users.role,
            jlptlevel: data.users.jlptlevel,
          }
        : undefined,
      tags:
        data.flash_card_set_tags
          ?.map((t: any) => t.tags?.name)
          .filter(Boolean) || [],
      flashCards:
        data.flash_cards?.map((card: any) => ({
          id: card.id,
          frontSide: card.front_side,
          backSide: card.back_side,
          frontSideComment: card.front_side_comment || "",
          backSideComment: card.back_side_comment || "",
          uid: card.id.toString(), // Using ID as UID for existing cards
        })) || [],
      flashCardNumber: data.flash_cards?.length || 0,
      isLearning: isLearning,
    };
  },

  async startLearning(setId: number, userId: string): Promise<void> {
    await checkFlashcardLimit(client, userId);

    const { error } = await client.from("flash_card_learners").upsert({
      flash_card_set_id: setId,
      user_id: userId,
      is_learning: true,
    });

    if (error) throw error;
  },

  async stopLearning(setId: number, userId: string): Promise<void> {
    const { error } = await client
      .from("flash_card_learners")
      .update({ is_learning: false })
      .eq("flash_card_set_id", setId)
      .eq("user_id", userId);

    if (error) throw error;
  },

  async deleteFlashcardSet(setId: number): Promise<void> {
    // 1. Get tags associated with this set
    const { data: setTags } = await client
      .from("flash_card_set_tags")
      .select("tag_id")
      .eq("flash_card_set_id", setId);

    // 2. Delete the set
    const { error } = await client
      .from("flash_card_sets")
      .delete()
      .eq("id", setId);

    if (error) throw error;

    // 3. Decrement tag counts
    if (setTags && setTags.length > 0) {
      const tagIds = setTags.map((t) => t.tag_id);
      const { data: tagsToDec } = await client
        .from("tags")
        .select("id, count")
        .in("id", tagIds);

      if (tagsToDec) {
        for (const tag of tagsToDec) {
          await client
            .from("tags")
            .update({ count: Math.max(0, (tag.count || 0) - 1) })
            .eq("id", tag.id);
        }
      }
    }
  },

  async createFlashcardSet(
    data: TFlashCardSetForm,
    userId: string
  ): Promise<{ id: number }> {
    await checkFlashcardLimit(client, userId);

    const createFlashcardSet = async () => {
      const { data: set, error: setError } = await client
        .from("flash_card_sets")
        .insert({
          title: data.title,
          description: data.description,
          user_id: userId,
          is_public: true, // Default to public
        })
        .select("id")
        .single();

      if (setError) throw setError;
      if (!set) throw new Error("Failed to create flashcard set");

      return set.id;
    };

    const handleTags = async () => {
      if (data.tags && data.tags.length > 0) {
        const tagNames = data.tags.map((t) => t.label);

        const { data: existingTags } = await client
          .from("tags")
          .select("id, name, count")
          .in("name", tagNames);

        const existingTagMap = new Map(
          existingTags?.map((t) => [t.name, t.id])
        );
        const tagsToInsert = tagNames.filter(
          (name) => !existingTagMap.has(name)
        );

        // Insert new tags
        if (tagsToInsert.length > 0) {
          const { data: newTags } = await client
            .from("tags")
            .insert(tagsToInsert.map((name) => ({ name })))
            .select("id, name");

          newTags?.forEach((t) => existingTagMap.set(t.name, t.id));
        }

        const setTags = data.tags
          .map((t) => existingTagMap.get(t.label))
          .filter((id) => id !== undefined)
          .map((tagId) => ({
            flash_card_set_id: setId,
            tag_id: tagId!,
          }));

        if (setTags.length > 0) {
          await client.from("flash_card_set_tags").insert(setTags);

          const tagIdsToIncrement = setTags.map((t) => t.tag_id);

          for (const tagId of tagIdsToIncrement) {
            const tag = existingTags?.find((t) => t.id === tagId);
            if (tag) {
              await client
                .from("tags")
                .update({ count: (tag.count || 0) + 1 })
                .eq("id", tagId);
            }
          }
        }
      }
    };

    const createFlashcards = async () => {
      if (data.flashCards && data.flashCards.length > 0) {
        const cards = data.flashCards.map((card) => ({
          flash_card_set_id: setId,
          front_side: card.frontSide,
          back_side: card.backSide,
          front_side_comment: card.frontSideComment,
          back_side_comment: card.backSideComment,
        }));

        const { error: cardsError } = await client
          .from("flash_cards")
          .insert(cards);

        if (cardsError) throw cardsError;
      }
    };

    const setId = await createFlashcardSet();
    await Promise.all([handleTags(), createFlashcards()]);

    return { id: setId };
  },

  async updateFlashcardSet(
    id: number,
    data: TFlashCardSetForm
  ): Promise<{ id: number }> {
    const updateSetDetails = async () => {
      const { error: setError } = await client
        .from("flash_card_sets")
        .update({
          title: data.title,
          description: data.description,
        })
        .eq("id", id);

      if (setError) throw setError;
    };

    const updateTags = async () => {
      // First, get current tags to know what to decrement
      const { data: currentSetTags } = await client
        .from("flash_card_set_tags")
        .select("tag_id")
        .eq("flash_card_set_id", id);

      const currentTagIds = currentSetTags?.map((t) => t.tag_id) || [];

      await client
        .from("flash_card_set_tags")
        .delete()
        .eq("flash_card_set_id", id);

      if (data.tags && data.tags.length > 0) {
        const tagNames = data.tags.map((t) => t.label);

        const { data: existingTags } = await client
          .from("tags")
          .select("id, name")
          .in("name", tagNames);

        const existingTagMap = new Map(
          existingTags?.map((t) => [t.name, t.id])
        );
        const tagsToInsert = tagNames.filter(
          (name) => !existingTagMap.has(name)
        );

        if (tagsToInsert.length > 0) {
          const { data: newTags } = await client
            .from("tags")
            .insert(tagsToInsert.map((name) => ({ name })))
            .select("id, name");

          newTags?.forEach((t) => existingTagMap.set(t.name, t.id));
        }

        const setTags = data.tags
          .map((t) => existingTagMap.get(t.label))
          .filter((tagId) => tagId !== undefined)
          .map((tagId) => ({
            flash_card_set_id: id,
            tag_id: tagId!,
          }));

        if (setTags.length > 0) {
          await client.from("flash_card_set_tags").insert(setTags);
        }

        const newTagIds = setTags.map((t) => t.tag_id);

        // Calculate diff
        const tagsToIncrement = newTagIds.filter(
          (x) => !currentTagIds.includes(x)
        );
        const tagsToDecrement = currentTagIds.filter(
          (x) => !newTagIds.includes(x)
        );

        // Increment
        if (tagsToIncrement.length > 0) {
          const { data: tagsToIncData } = await client
            .from("tags")
            .select("id, count")
            .in("id", tagsToIncrement);
          if (tagsToIncData) {
            for (const tag of tagsToIncData) {
              await client
                .from("tags")
                .update({ count: (tag.count || 0) + 1 })
                .eq("id", tag.id);
            }
          }
        }

        // Decrement
        if (tagsToDecrement.length > 0) {
          const { data: tagsToDecData } = await client
            .from("tags")
            .select("id, count")
            .in("id", tagsToDecrement);
          if (tagsToDecData) {
            for (const tag of tagsToDecData) {
              await client
                .from("tags")
                .update({ count: Math.max(0, (tag.count || 0) - 1) })
                .eq("id", tag.id);
            }
          }
        }
      } else {
        // If no new tags, but we had old tags, we need to decrement all old tags
        if (currentTagIds.length > 0) {
          const { data: tagsToDecData } = await client
            .from("tags")
            .select("id, count")
            .in("id", currentTagIds);
          if (tagsToDecData) {
            for (const tag of tagsToDecData) {
              await client
                .from("tags")
                .update({ count: Math.max(0, (tag.count || 0) - 1) })
                .eq("id", tag.id);
            }
          }
        }
      }
    };

    const updateFlashcardSet = async () => {
      const { data: currentCards } = await client
        .from("flash_cards")
        .select("id")
        .eq("flash_card_set_id", id);

      const currentCardIds = new Set(currentCards?.map((c) => c.id));
      const newCardIds = new Set(
        data.flashCards.map((c) => c.id).filter((id) => id)
      );

      // Delete removed cards
      const idsToDelete = Array.from(currentCardIds).filter(
        (x) => !newCardIds.has(x)
      );
      if (idsToDelete.length > 0) {
        await client.from("flash_cards").delete().in("id", idsToDelete);
      }

      // Upsert cards (update existing, insert new)
      const newCards = data.flashCards.filter((c) => !c.id);
      const existingCards = data.flashCards.filter((c) => c.id);

      // 1. Insert new cards
      if (newCards.length > 0) {
        const cardsToInsert = newCards.map((card) => ({
          flash_card_set_id: id,
          front_side: card.frontSide,
          back_side: card.backSide,
          front_side_comment: card.frontSideComment,
          back_side_comment: card.backSideComment,
        }));

        const { error: insertError } = await client
          .from("flash_cards")
          .insert(cardsToInsert);

        if (insertError) throw insertError;
      }

      // 2. Update existing cards
      if (existingCards.length > 0) {
        const cardsToUpdate = existingCards.map((card) => ({
          id: Number(card.id),
          flash_card_set_id: id,
          front_side: card.frontSide,
          back_side: card.backSide,
          front_side_comment: card.frontSideComment,
          back_side_comment: card.backSideComment,
        }));

        const { error: updateError } = await client
          .from("flash_cards")
          .upsert(cardsToUpdate);

        if (updateError) throw updateError;
      }
    };

    await updateFlashcardSet();
    await Promise.all([updateSetDetails(), updateTags()]);

    return { id };
  },

  async getUserFlashcardSets(userId: string): Promise<TFlashcardSetOwner> {
    const [{ data: user, error: userError }, { data: sets, error: setsError }] =
      await Promise.all([
        client
          .from("users")
          .select("id, name, avatar, role, jlptlevel, popular")
          .eq("id", userId)
          .single(),
        client
          .from("flash_card_sets")
          .select(
            `
          id, title, description, updated_at, popular,
          flash_card_set_tags (
            tags (name)
          ),
          flash_cards (id),
          active_learners:flash_card_learners(count),
          all_learners:flash_card_learners(count)
        `
          )
          .eq("user_id", userId)
          .eq("is_public", true)
          .eq("active_learners.is_learning", true)
          .order("popular", { ascending: false }),
      ]);

    if (userError) throw userError;
    if (!user) throw new Error("User not found");
    if (setsError) throw setsError;

    const formattedSets: TFlashcardSet[] =
      sets?.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        updatedAt: item.updated_at,
        learnedNumber: item.all_learners?.[0]?.count || 0,
        learningNumber: item.active_learners?.[0]?.count || 0,
        tags:
          item.flash_card_set_tags
            ?.map((t: any) => t.tags?.name)
            .filter(Boolean) || [],
        flashCardNumber: item.flash_cards?.length || 0,
        isLearning: false,
      })) || [];

    const totalLearnedNumber = formattedSets.reduce(
      (acc, curr) => acc + curr.learnedNumber,
      0
    );
    const totalLearningNumber = formattedSets.reduce(
      (acc, curr) => acc + curr.learningNumber,
      0
    );

    return {
      id: user.id,
      authId: user.id,
      name: user.name,
      avatar: user.avatar || "",
      role: user.role,
      jlptlevel: user.jlptlevel,
      flashCardSets: formattedSets,
      totalLearnedNumber,
      totalLearningNumber,
    };
  },

  async getMyFlashcards(userId: string): Promise<TMyFlashcard> {
    const [
      { error: userError },
      { data: mySets, error: mySetsError },
      { data: learningSets, error: learningSetsError },
    ] = await Promise.all([
      client.from("users").select("popular").eq("id", userId).single(),
      client
        .from("flash_card_sets")
        .select(
          `
          id, title, description, updated_at, popular,
          flash_card_set_tags (
            tags (name)
          ),
          flash_cards (id),
          active_learners:flash_card_learners(count),
          all_learners:flash_card_learners(count)
        `
        )
        .eq("user_id", userId)
        .eq("active_learners.is_learning", true)
        .order("created_at", { ascending: false }),
      client
        .from("flash_card_learners")
        .select(
          `
          flash_card_sets (
            id, title, description, updated_at, popular, user_id,
            users:users!flash_card_sets_user_id_fkey (id, name, avatar, role, jlptlevel),
            flash_card_set_tags (
              tags (name)
            ),
            flash_cards (id),
            active_learners:flash_card_learners(count),
            all_learners:flash_card_learners(count)
          )
        `
        )
        .eq("user_id", userId)
        .eq("is_learning", true)
        .eq("flash_card_sets.active_learners.is_learning", true)
        .order("created_at", { ascending: false }),
    ]);

    if (userError) throw userError;
    if (mySetsError) throw mySetsError;
    if (learningSetsError) throw learningSetsError;

    const formattedMySets: TFlashcardSet[] =
      mySets?.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        updatedAt: item.updated_at,
        learnedNumber: item.all_learners?.[0]?.count || 0,
        learningNumber: item.active_learners?.[0]?.count || 0,
        tags:
          item.flash_card_set_tags
            ?.map((t: any) => t.tags?.name)
            .filter(Boolean) || [],
        flashCardNumber: item.flash_cards?.length || 0,
        isLearning: false,
      })) || [];

    const formattedLearningSets: TFlashcardSet[] =
      learningSets?.map((item: any) => {
        const set = item.flash_card_sets;
        return {
          id: set.id,
          title: set.title,
          description: set.description || "",
          updatedAt: set.updated_at,
          learnedNumber: set.all_learners?.[0]?.count || 0,
          learningNumber: set.active_learners?.[0]?.count || 0,
          owner: set.users
            ? {
                id: set.users.id,
                authId: set.users.id,
                name: set.users.name,
                avatar: set.users.avatar || "",
                role: set.users.role,
                jlptlevel: set.users.jlptlevel,
              }
            : undefined,
          tags:
            set.flash_card_set_tags
              ?.map((t: any) => t.tags?.name)
              .filter(Boolean) || [],
          flashCardNumber: set.flash_cards?.length || 0,
          isLearning: true,
        };
      }) || [];
    const totalLearnedNumber = formattedMySets.reduce(
      (acc, curr) => acc + curr.learnedNumber,
      0
    );
    const totalLearningNumber = formattedMySets.reduce(
      (acc, curr) => acc + curr.learningNumber,
      0
    );

    return {
      myFlashCards: formattedMySets,
      learningFlashCards: formattedLearningSets,
      totalLearnedNumber,
      totalLearningNumber,
    };
  },

  async addFlashcardToSet(
    setId: string,
    card: {
      frontSide: string;
      frontSideComment: string;
      backSide: string;
      backSideComment: string;
    }
  ): Promise<void> {
    const { count, error: countError } = await client
      .from("flash_cards")
      .select("*", { count: "exact", head: true })
      .eq("flash_card_set_id", setId);

    if (countError) throw countError;

    if (count !== null && count >= FLASHCARD_LIMIT) {
      throw "FORBIDDEN";
    }

    const { error } = await client.from("flash_cards").insert({
      flash_card_set_id: Number(setId),
      front_side: card.frontSide,
      back_side: card.backSide,
      front_side_comment: card.frontSideComment,
      back_side_comment: card.backSideComment,
    });

    if (error) throw error;
  },
});
