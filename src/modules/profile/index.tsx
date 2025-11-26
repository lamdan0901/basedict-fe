"use client";

import { AdSense } from "@/components/Ad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_AVATAR_URL, jlptLevels } from "@/constants";

import { fetchUserProfile } from "@/service/user";
import { useAppStore } from "@/store/useAppStore";
import { createAuthRepository } from "@/lib/supabase/repositories/authRepo";
import { createClient } from "@/utils/supabase/client";
import { Check } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import useSWRImmutable from "swr/immutable";

type TUserForm = {
  name: string;
  jlptlevel: TJlptLevel;
};

export function Profile() {
  const supabase = createClient();
  const { toast } = useToast();
  const setProfile = useAppStore((state) => state.setProfile);

  const {
    register,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TUserForm>({ mode: "all" });
  const jlptlevel = watch("jlptlevel");

  const { data: email } = useSWRImmutable("get-email", async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.user.email;
  });

  const {
    data: user,
    mutate: mutateUser,
    isLoading,
  } = useSWR<TUser>("get-user-profile", fetchUserProfile);

  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        jlptlevel: user.jlptlevel,
      });
    }
  }, [user]);

  async function submitForm(data: TUserForm) {
    if (!user) return;
    try {
      setIsMutating(true);
      const authRepo = createAuthRepository(supabase);
      await authRepo.updateUserProfile(user.id, data);

      const newUserData = {
        ...user,
        ...data,
      };
      mutateUser(newUserData);
      mutate("get-user", newUserData);
      setProfile(newUserData);

      toast({
        title: "Cập nhật thông tin thành công",
        action: <Check className="h-5 w-5 text-green-500" />,
      });
    } catch {
      toast({
        title: "Không thể cập nhật thông tin",
        variant: "destructive",
      });
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <>
      <Card className="max-w-lg mx-auto w-full flex flex-col items-center gap-4 mt-2">
        <CardTitle className="pt-4">Thông tin cá nhân</CardTitle>
        <CardContent className="flex flex-col items-center gap-4 mt-2">
          <Image
            width={80}
            height={80}
            className="rounded-full"
            src={user?.avatar || DEFAULT_AVATAR_URL}
            alt="avatar"
          />
          <div className="text-center text-xl">{user?.name}</div>

          <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
            <div className="flex w-full max-w-md items-center gap-1.5">
              <Label className="w-[60px] shrink-0" htmlFor="email">
                Email
              </Label>
              <Input type="email" defaultValue={email} id="email" disabled />
            </div>

            <div className="flex w-full max-w-md items-center gap-1.5">
              <Label className="w-[60px] shrink-0" htmlFor="name">
                Họ tên
              </Label>
              <Input
                id="name"
                placeholder="Họ tên"
                disabled={isLoading}
                {...register("name", { required: "Vui lòng nhập họ tên" })}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}

            <div className="flex w-full max-w-md items-center gap-1.5">
              <Label className="w-[60px] shrink-0">Trình độ</Label>
              <Select
                value={jlptlevel}
                disabled={isLoading}
                onValueChange={(value) =>
                  setValue("jlptlevel", value as TJlptLevel)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  {jlptLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="block mx-auto w-fit pt-6 mb-0 pb-0  space-x-4">
              <Button type="submit" disabled={isMutating}>
                Lưu
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => window.history.back()}
                type="button"
              >
                Huỷ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AdSense slot="horizontal" />
    </>
  );
}
