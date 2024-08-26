"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DEFAULT_AVATAR_URL } from "@/constants";
import { getRequest, postRequest } from "@/service/data";
import Image from "next/image";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jlptLevels } from "@/modules/reading/const";
import useSWRImmutable from "swr/immutable";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type TUserForm = {
  name: string;
  jlptLevel: TJlptLevel;
};

export function Profile() {
  const supabase = createClient();

  const {
    register,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TUserForm>({ mode: "all" });
  const jlptLevel = watch("jlptLevel");

  const { data: email } = useSWRImmutable("get-email", async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.user.email;
  });
  const {
    data: user,
    mutate,
    isLoading,
  } = useSWR<TUser>("v1/users/profile", getRequest, {
    onSuccess: (data) => {
      reset({
        name: data.name,
        jlptLevel: data.jlptLevel,
      });
    },
  });
  const { trigger: updateUser, isMutating } = useSWRMutation(
    "/v1/users",
    postRequest
  );

  async function submitForm(data: TUserForm) {
    await updateUser(data);
    if (user) mutate({ ...user, ...data });
  }

  return (
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

        <form className="space-y-3" onSubmit={handleSubmit(submitForm)}>
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
              value={jlptLevel}
              disabled={isLoading}
              onValueChange={(value) =>
                setValue("jlptLevel", value as TJlptLevel)
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

          <div className="block mx-auto w-fit mt-10 mb-0 pb-0  space-x-4">
            <Button type="submit" disabled={isMutating}>
              Lưu
            </Button>
            <Link href="/">
              <Button variant={"secondary"} type="button">
                Huỷ
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}