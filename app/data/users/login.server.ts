import { User } from "@prisma/client";
import prisma from "../utils/prisma.server";
import { verifyPassword } from "./passwordUtils.server";
import { DataResult } from "../utils/types";
import z from "zod/v4";
import { zfd } from "zod-form-data";
import { formatZodErrors } from "../utils/formatZodErrors.server";

export const loginSchema = zfd.formData({
  email: zfd.text(z.email()),
  password: zfd.text(),
  redirectTo: zfd.text(z.string().optional()),
  rememberMe: zfd.checkbox().optional(),
});

export type LoginParams = z.infer<typeof loginSchema> | FormData;

export async function login(
  params: LoginParams,
): Promise<DataResult<User & { rememberMe?: boolean; redirectTo?: string }>> {
  const parsedSchema = loginSchema.safeParse(params);

  if (!parsedSchema.success)
    return { data: null, errors: formatZodErrors(parsedSchema.error) };

  const { email, password, rememberMe, redirectTo } = parsedSchema.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return { data: null, errors: { email: "Email/Password combo not found" } };

  if (await verifyPassword(user.password, password)) {
    user.password = "";

    return { data: { ...user, rememberMe, redirectTo }, errors: null };
  }

  return { data: null, errors: { email: "Email/Password combo not found" } };
}
