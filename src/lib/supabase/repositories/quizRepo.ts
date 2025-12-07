import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import { TQuizForm } from "@/modules/quizzes/schema";

type SupabaseClientType = SupabaseClient<Database>;

export const createQuizRepository = (client: SupabaseClientType) => ({
  async checkExamLimit(userId: string) {
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
        .from("exams")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      client
        .from("exam_learners")
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
  },

  async startLearning(quizId: number, userId: string): Promise<void> {
    await this.checkExamLimit(userId);

    const { error } = await client.from("exam_learners").upsert({
      exam_id: quizId,
      user_id: userId,
      is_learning: true,
    });

    if (error) throw error;
  },

  async stopLearning(quizId: number, userId: string): Promise<void> {
    const { error } = await client
      .from("exam_learners")
      .update({ is_learning: false })
      .eq("exam_id", quizId)
      .eq("user_id", userId);

    if (error) throw error;
  },

  async deleteQuiz(quizId: number): Promise<void> {
    // 1. Get tags associated with this quiz
    const { data: quizTags } = await client
      .from("exam_tags")
      .select("tag_id")
      .eq("exam_id", quizId);

    // 2. Delete the quiz
    const { error } = await client.from("exams").delete().eq("id", quizId);

    if (error) throw error;

    // 3. Decrement tag counts
    if (quizTags && quizTags.length > 0) {
      const tagIds = quizTags.map((t) => t.tag_id);
      const { data: tagsToDec } = await client
        .from("tags")
        .select("id, count")
        .in("id", tagIds);

      if (tagsToDec) {
        await Promise.all(
          tagsToDec.map((tag) =>
            client
              .from("tags")
              .update({ count: Math.max(0, (tag.count || 0) - 1) })
              .eq("id", tag.id)
          )
        );
      }
    }
  },

  async getTags(options?: {
    search?: string;
    excludeEmpty?: boolean;
  }): Promise<TQuizTag[]> {
    let query = client
      .from("tags")
      .select("id, name, count, exam_tags!inner(exam_id)")
      .order("count", { ascending: false });

    if (options?.search) {
      query = query.ilike("name", `%${options.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map((tag) => ({
      id: tag.id,
      name: tag.name,
      count: tag.count,
    })) as TQuizTag[];
  },

  async getDiscoverQuizzes(): Promise<{ data: TQuiz[]; total: number }> {
    const { data, error, count } = (await client
      .from("exams")
      .select(
        `
        id, title, description, updated_at, popular, is_public, user_id, jlpt_level,
        users:users!exams_user_id_fkey (id, name, avatar, role, jlptlevel),
        exam_tags (
          tags (name)
        ),
        exam_questions (id),
        active_learners:exam_learners(count),
        all_learners:exam_learners(count)
      `,
        { count: "exact" }
      )
      .eq("is_public", true)
      .eq("active_learners.is_learning", true)
      .order("popular", { ascending: false })
      .limit(9)) as any;

    if (error) throw error;

    const formattedData =
      data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        updatedAt: item.updated_at,
        learnedNumber: item.all_learners?.[0]?.count || 0,
        learningNumber: item.active_learners?.[0]?.count || 0,
        owner: item.users as TUser,
        tags:
          item.exam_tags?.map((t: any) => t.tags?.name || "").filter(Boolean) ||
          [],
        questionNumber: item.exam_questions?.length || 0,
        isLearning: false,
        jlptLevel: item.jlpt_level,
        questions: [],
        readings: [],
      })) || [];

    return { data: formattedData, total: count || 0 };
  },

  async searchQuizzes({
    search,
    tagName,
    jlptLevel,
    sort = "popular",
    limit = 20,
    offset = 0,
  }: {
    search?: string;
    tagName?: string;
    jlptLevel?: string;
    sort?: "popular" | "updated_at" | "latest";
    limit?: number;
    offset?: number;
  }): Promise<{ data: TQuiz[]; total: number }> {
    let query = client
      .from("exams")
      .select(
        `
        id, title, description, updated_at, popular, is_public, user_id, jlpt_level,
        users:users!exams_user_id_fkey (id, name, avatar, role, jlptlevel),
        exam_tags!inner (
          tags!inner (name)
        ),
        exam_questions (id),
        active_learners:exam_learners(count),
        all_learners:exam_learners(count)
      `,
        { count: "exact" }
      )
      .eq("is_public", true)
      .eq("active_learners.is_learning", true);

    if (search) {
      if (search.startsWith("#")) {
        const tagSearch = search.slice(1);
        query = query.eq("exam_tags.tags.name", tagSearch);
      } else {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`
        );
      }
    }

    if (tagName) {
      query = query.eq("exam_tags.tags.name", tagName);
    }

    if (jlptLevel && jlptLevel !== "all") {
      query = query.eq("users.jlptlevel", jlptLevel);
    }

    query = query.order(sort, { ascending: false });

    const { data, error, count } = (await query.range(
      offset,
      offset + limit - 1
    )) as any;

    if (error) throw error;

    const formattedData =
      data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        updatedAt: item.updated_at,
        learnedNumber: item.all_learners?.[0]?.count || 0,
        learningNumber: item.active_learners?.[0]?.count || 0,
        owner: item.users as TUser,
        tags:
          item.exam_tags?.map((t: any) => t.tags?.name || "").filter(Boolean) ||
          [],
        questionNumber: item.exam_questions?.length || 0,
        isLearning: false,
        jlptLevel: item.jlpt_level,
        questions: [],
        readings: [],
      })) || [];

    return { data: formattedData, total: count || 0 };
  },

  async getTopCreators(): Promise<TQuizCreator[]> {
    const { data, error } = await client
      .from("users")
      .select(
        `
        id, name, avatar, role, jlptlevel, exampopular,
        exams:exams!exams_user_id_fkey (id)
      `
      )
      .order("exampopular", { ascending: false })
      .limit(5);

    if (error) throw error;

    return (
      data?.map((user) => ({
        id: user.id,
        authId: user.id,
        name: user.name,
        avatar: user.avatar || "",
        role: user.role,
        jlptlevel: user.jlptlevel,
        examNumber: user.exams?.length || 0,
        totalLearnedNumber: 0,
        totalLearningNumber: 0,
        exams: [],
      })) || []
    );
  },

  async getMyQuizzes(userId: string): Promise<TMyQuiz> {
    const fetchMyExams = async () => {
      const { data, error: myExamsError } = await client
        .from("exams")
        .select(
          `
        id, title, description, updated_at, popular, is_public, user_id, jlpt_level,
        users:users!exams_user_id_fkey (id, name, avatar, role, jlptlevel),
        exam_tags (
          tags (name)
        ),
        exam_questions (id),
        active_learners:exam_learners(count),
        all_learners:exam_learners(count)
      `
        )
        .eq("user_id", userId)
        .eq("active_learners.is_learning", true)
        .order("updated_at", { ascending: false });

      if (myExamsError) throw myExamsError;
      return data;
    };

    const fetchLearningExams = async () => {
      const { data, error: learningExamsError } = await client
        .from("exam_learners")
        .select(
          `
        exams (
          id, title, description, updated_at, popular, is_public, user_id, jlpt_level,
          users:users!exams_user_id_fkey (id, name, avatar, role, jlptlevel),
          exam_tags (
            tags (name)
          ),
          exam_questions (id),
          active_learners:exam_learners(count),
          all_learners:exam_learners(count)
        )
      `
        )
        .eq("user_id", userId)
        .eq("is_learning", true)
        .eq("exams.active_learners.is_learning", true)
        .order("updated_at", { ascending: false });

      if (learningExamsError) throw learningExamsError;
      return data;
    };

    const [myExamsData, learningExamsData] = await Promise.all([
      fetchMyExams(),
      fetchLearningExams(),
    ]);

    const formatQuiz = (item: any): TQuiz => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      updatedAt: item.updated_at,
      learnedNumber: item.all_learners?.[0]?.count || 0,
      learningNumber: item.active_learners?.[0]?.count || 0,
      owner: item.users as TUser,
      tags:
        item.exam_tags?.map((t: any) => t.tags?.name || "").filter(Boolean) ||
        [],
      questionNumber: item.exam_questions?.length || 0,
      isLearning: false,
      jlptLevel: item.jlpt_level,
      questions: [],
      readings: [],
    });

    const myExams = myExamsData?.map(formatQuiz) || [];
    const learningExams =
      learningExamsData?.map((item) => formatQuiz(item.exams)) || [];

    const totalLearnedNumber = myExams.reduce(
      (acc, curr) => acc + curr.learnedNumber,
      0
    );
    const totalLearningNumber = myExams.reduce(
      (acc, curr) => acc + curr.learningNumber,
      0
    );

    return {
      myExams,
      learningExams,
      totalLearnedNumber,
      totalLearningNumber,
    };
  },

  async getQuizById(id: string): Promise<TQuiz> {
    let query = client
      .from("exams")
      .select(
        `
        id, title, description, updated_at, popular, user_id, jlpt_level,
        users:users!exams_user_id_fkey (id, name, avatar, role, jlptlevel),
        exam_tags (
          tags (name)
        ),
        exam_questions (id, question, answers, correct_answer, explanation),
        exam_readings (
          readings (
            reading_questions (*),
            japanese
          )
        ),
        active_learners:exam_learners(count),
        all_learners:exam_learners(count),
        exam_learners (user_id, is_learning)
      `
      )
      .eq("id", id)
      .eq("active_learners.is_learning", true);

    const { data, error } = (await query.single()) as any;
    if (error) throw error;

    const isLearning =
      data.exam_learners && data.exam_learners.length > 0
        ? data.exam_learners[0].is_learning
        : false;

    return {
      id: data.id,
      title: data.title,
      description: data.description || "",
      updatedAt: data.updated_at,
      learnedNumber: data.all_learners?.[0]?.count || 0,
      learningNumber: data.active_learners?.[0]?.count || 0,
      owner: data.users as TUser,
      tags:
        data.exam_tags?.map((t: any) => t.tags?.name || "").filter(Boolean) ||
        [],
      questionNumber: data.exam_questions?.length || 0,
      isLearning: isLearning,
      jlptLevel: data.jlpt_level,
      questions:
        data.exam_questions?.map((q: any) => ({
          id: q.id,
          question: q.question,
          answers: q.answers,
          correctAnswer: q.correct_answer,
          explanation: q.explanation || "",
        })) || [],
      readings: data.exam_readings.map((r: any) => ({
        questions: (r.readings?.reading_questions || []).map((q: any) => ({
          question: q.question,
          answers: q.answers,
          correctAnswer: q.correct_answer,
        })),
        japanese: r.readings?.japanese || "",
      })),
    };
  },

  async getRandomJlptQuiz(jlptLevel: string): Promise<TQuiz> {
    // Fetch random questions from question_masters table based on JLPT level
    const { data: questions, error } = await client
      .from("question_masters")
      .select("id, question, answers, correct_answer, explanation, type")
      .eq("jlpt_level", jlptLevel as any)
      .limit(50);

    if (error) throw error;

    // Shuffle and return questions
    const shuffledQuestions = questions?.sort(() => Math.random() - 0.5) || [];

    return {
      id: 0,
      title: "Đề trộn",
      description: `Đề thi JLPT ${jlptLevel} ngẫu nhiên`,
      updatedAt: new Date().toISOString(),
      learnedNumber: 0,
      learningNumber: 0,
      owner: {} as TUser,
      tags: [],
      questionNumber: shuffledQuestions.length,
      isLearning: false,
      jlptLevel: jlptLevel,
      questions: shuffledQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        answers: q.answers,
        correctAnswer: q.correct_answer,
        explanation: q.explanation || "",
      })),
      readings: [],
    };
  },

  async createQuiz(data: TQuizForm, userId: string): Promise<{ id: number }> {
    // 1. Create Exam
    const { data: exam, error: examError } = await client
      .from("exams")
      .insert({
        title: data.title,
        description: data.description,
        jlpt_level: data.jlptLevel as any,
        user_id: userId,
        is_public: true,
        source: "User",
      })
      .select("id")
      .single();

    if (examError) throw examError;
    if (!exam) throw new Error("Failed to create exam");

    const examId = exam.id;

    // 2. Handle Tags
    if (data.tags && data.tags.length > 0) {
      const tagNames = data.tags.map((t) => t.label);

      const { data: existingTags } = await client
        .from("tags")
        .select("id, name, count")
        .in("name", tagNames);

      const existingTagMap = new Map(existingTags?.map((t) => [t.name, t.id]));
      const tagsToInsert = tagNames.filter((name) => !existingTagMap.has(name));

      if (tagsToInsert.length > 0) {
        const { data: newTags } = await client
          .from("tags")
          .insert(tagsToInsert.map((name) => ({ name })))
          .select("id, name");

        newTags?.forEach((t) => existingTagMap.set(t.name, t.id));
      }

      const examTags = data.tags
        .map((t) => existingTagMap.get(t.label))
        .filter((id) => id !== undefined)
        .map((tagId) => ({
          exam_id: examId,
          tag_id: tagId!,
        }));

      if (examTags.length > 0) {
        await client.from("exam_tags").insert(examTags);

        const tagIdsToIncrement = examTags.map((t) => t.tag_id);
        await Promise.all(
          tagIdsToIncrement.map(async (tagId) => {
            const tag = existingTags?.find((t) => t.id === tagId);
            const currentCount = tag?.count || 0;
            await client
              .from("tags")
              .update({ count: currentCount + 1 })
              .eq("id", tagId);
          })
        );
      }
    }

    // 3. Handle Questions
    if (data.questions && data.questions.length > 0) {
      const questions = data.questions.map((q) => ({
        exam_id: examId,
        question: q.question,
        answers: q.answers,
        correct_answer: q.correctAnswer,
        explanation: q.explanation,
      }));

      const { error: questionsError } = await client
        .from("exam_questions")
        .insert(questions);

      if (questionsError) throw questionsError;
    }

    return { id: examId };
  },

  async updateQuiz(id: number, data: TQuizForm): Promise<{ id: number }> {
    // 1. Update Exam Details
    const { error: examError } = await client
      .from("exams")
      .update({
        title: data.title,
        description: data.description,
        jlpt_level: data.jlptLevel as any,
      })
      .eq("id", id);

    if (examError) throw examError;

    // 2. Handle Tags
    // Get current tags
    const { data: currentExamTags } = await client
      .from("exam_tags")
      .select("tag_id")
      .eq("exam_id", id);

    const currentTagIds = currentExamTags?.map((t) => t.tag_id) || [];

    // Delete all existing exam_tags links
    await client.from("exam_tags").delete().eq("exam_id", id);

    if (data.tags && data.tags.length > 0) {
      const tagNames = data.tags.map((t) => t.label);

      const { data: existingTags } = await client
        .from("tags")
        .select("id, name, count")
        .in("name", tagNames);

      const existingTagMap = new Map(existingTags?.map((t) => [t.name, t.id]));
      const tagsToInsert = tagNames.filter((name) => !existingTagMap.has(name));

      if (tagsToInsert.length > 0) {
        const { data: newTags } = await client
          .from("tags")
          .insert(tagsToInsert.map((name) => ({ name })))
          .select("id, name");

        newTags?.forEach((t) => existingTagMap.set(t.name, t.id));
      }

      const examTags = data.tags
        .map((t) => existingTagMap.get(t.label))
        .filter((id) => id !== undefined)
        .map((tagId) => ({
          exam_id: id,
          tag_id: tagId!,
        }));

      if (examTags.length > 0) {
        await client.from("exam_tags").insert(examTags);
      }

      const newTagIds = examTags.map((t) => t.tag_id);

      // Calculate diff for counts
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
          await Promise.all(
            tagsToIncData.map((tag) =>
              client
                .from("tags")
                .update({ count: (tag.count || 0) + 1 })
                .eq("id", tag.id)
            )
          );
        }
      }

      // Decrement
      if (tagsToDecrement.length > 0) {
        const { data: tagsToDecData } = await client
          .from("tags")
          .select("id, count")
          .in("id", tagsToDecrement);

        if (tagsToDecData) {
          await Promise.all(
            tagsToDecData.map((tag) =>
              client
                .from("tags")
                .update({ count: Math.max(0, (tag.count || 0) - 1) })
                .eq("id", tag.id)
            )
          );
        }
      }
    } else {
      // If no new tags, decrement all old tags
      if (currentTagIds.length > 0) {
        const { data: tagsToDecData } = await client
          .from("tags")
          .select("id, count")
          .in("id", currentTagIds);
        if (tagsToDecData) {
          await Promise.all(
            tagsToDecData.map((tag) =>
              client
                .from("tags")
                .update({ count: Math.max(0, (tag.count || 0) - 1) })
                .eq("id", tag.id)
            )
          );
        }
      }
    }

    // 3. Handle Questions
    const { data: currentQuestions } = await client
      .from("exam_questions")
      .select("id")
      .eq("exam_id", id);

    const currentQuestionIds = new Set(currentQuestions?.map((q) => q.id));
    const newQuestionIds = new Set(
      data.questions.map((q) => q.id).filter((id) => id)
    );

    // Delete removed questions
    const idsToDelete = Array.from(currentQuestionIds).filter(
      (x) => !newQuestionIds.has(x)
    );
    if (idsToDelete.length > 0) {
      await client.from("exam_questions").delete().in("id", idsToDelete);
    }

    // Upsert questions
    const questionsToUpsert = data.questions.map((q) => ({
      id: q.id ? Number(q.id) : undefined,
      exam_id: id,
      question: q.question,
      answers: q.answers,
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
    }));

    if (questionsToUpsert.length > 0) {
      const { error: upsertError } = await client
        .from("exam_questions")
        .upsert(questionsToUpsert);

      if (upsertError) throw upsertError;
    }

    return { id };
  },

  async getUserQuizzes(userId: string): Promise<TQuizCreator> {
    const { data: user, error: userError } = await client
      .from("users")
      .select("id, name, avatar, role, jlptlevel")
      .eq("id", userId)
      .single();

    if (userError) throw userError;
    if (!user) throw new Error("User not found");

    const { data: exams, error: examsError } = (await client
      .from("exams")
      .select(
        `
        id, title, description, updated_at, popular, is_public, user_id, jlpt_level
        users:users!exams_user_id_fkey (id, name, avatar, role, jlptlevel),
        exam_tags (
          tags (name)
        ),
        exam_questions (id),
        active_learners:exam_learners(count),
        all_learners:exam_learners(count)
      `
      )
      .eq("user_id", userId)
      .eq("is_public", true)
      .eq("active_learners.is_learning", true)
      .order("updated_at", { ascending: false })) as any;

    if (examsError) throw examsError;

    const formattedExams: TQuiz[] =
      exams?.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        updatedAt: item.updated_at,
        learnedNumber: item.all_learners?.[0]?.count || 0,
        learningNumber: item.active_learners?.[0]?.count || 0,
        owner: item.users as TUser,
        tags:
          item.exam_tags?.map((t: any) => t.tags?.name || "").filter(Boolean) ||
          [],
        questionNumber: item.exam_questions?.length || 0,
        isLearning: false,
        jlptLevel: item.jlpt_level,
        questions: [],
        readings: [],
      })) || [];

    const totalLearnedNumber = formattedExams.reduce(
      (acc, curr) => acc + curr.learnedNumber,
      0
    );
    const totalLearningNumber = formattedExams.reduce(
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
      examNumber: formattedExams.length,
      totalLearnedNumber,
      totalLearningNumber,
      exams: formattedExams,
    };
  },

  async getJlptTests(jlptLevel: string): Promise<TTestPeriod[]> {
    const { data, error } = await client
      .from("exams")
      .select(
        `
        id, title, source, jlpt_level,
        active_learners:exam_learners(count),
        all_learners:exam_learners(count)
      `,
        { count: "exact" }
      )
      .eq("source", "JLPT")
      .eq("jlpt_level", jlptLevel)
      .eq("is_public", true);

    if (error) throw error;

    return (
      data?.map((item) => ({
        id: item.id,
        jlptLevel: item.jlpt_level as any,
        source: item.source,
        learnedNumber: item.all_learners?.[0]?.count || 0,
        learningNumber: item.active_learners?.[0]?.count || 0,
        title: item.title,
      })) || []
    );
  },
});
