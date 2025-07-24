import { eq } from "drizzle-orm";
import db, { parseFeatureFlags } from "./utils/drizzle.server";
import { users, User } from "./schema";
import { verifyPassword } from "./passwords";
import { DataResult } from "./utils/types";
import z from "zod/v4";
import { zfd } from "zod-form-data";
import { formatZodErrors } from "./utils/formatZodErrors.server";

export const loginSchema = zfd.formData({
  email: zfd.text(z.email()),
  password: zfd.text(),
  redirectTo: zfd.text(z.string().optional()),
});

export type LoginParams = z.infer<typeof loginSchema> | FormData;

export async function login(
  params: LoginParams,
): Promise<DataResult<Omit<User, "password"> & { redirectTo?: string }>> {
  const parsedSchema = loginSchema.safeParse(params);

  if (!parsedSchema.success)
    return { data: null, errors: formatZodErrors(parsedSchema.error) };

  const { email, password, redirectTo } = parsedSchema.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user)
    return { data: null, errors: { email: "Email/Password combo not found" } };

  if (await verifyPassword(user.password, password)) {
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      featureFlags: parseFeatureFlags(user.featureFlags),
    };

    return {
      data: { ...userWithoutPassword, redirectTo },
      errors: null,
    };
  }

  return { data: null, errors: { email: "Email/Password combo not found" } };
}
