import { zfd } from "zod-form-data";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { encryptPassword, verifyPassword } from "./users/passwords";
import db from "./utils/drizzle.server";
import { parseFeatureFlags } from "./utils/drizzle.server";
import { users, notes, User } from "./schema";
import { DataResult } from "./utils/types";
import { formatZodErrors } from "./utils/formatZodErrors.server";

export const createUserParams = zfd.formData({
  email: zfd.text(z.email()),
  name: zfd.text(),
  password: zfd.text(),
  passwordConfirmation: zfd.text(),
  rememberMe: zfd.checkbox().optional(),
});

export type CreateUserParams = z.infer<typeof createUserParams> | FormData;

export async function findUserByEmail(
  email: string,
): Promise<Omit<User, "password"> | null> {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      featureFlags: users.featureFlags,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) return null;

  // Parse feature flags using the helper function
  return {
    ...user,
    featureFlags: parseFeatureFlags(user.featureFlags),
  };
}

export async function createUser(
  params: CreateUserParams,
): Promise<DataResult<Omit<User, "password"> & { rememberMe?: boolean }>> {
  const parsedSchema = createUserParams.safeParse(params);

  if (!parsedSchema.success)
    return { data: null, errors: formatZodErrors(parsedSchema.error) };

  const { email, name, password, passwordConfirmation, rememberMe } =
    parsedSchema.data;

  if (password !== passwordConfirmation) {
    return {
      data: null,
      errors: { passwordConfirmation: "Passwords do not match!" },
    };
  }

  if (await findUserByEmail(email)) {
    return { data: null, errors: { email: "User already exists!" } };
  }

  const encryptedPassword = await encryptPassword(password);
  const [user] = await db
    .insert(users)
    .values({
      email,
      name,
      password: encryptedPassword,
      featureFlags: {},
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      featureFlags: users.featureFlags,
    });

  return {
    data: {
      ...user,
      featureFlags: parseFeatureFlags(user.featureFlags),
      rememberMe,
    },
    errors: null,
  };
}

const updateUserParams = zfd.formData({
  email: zfd.text(z.email().optional()),
  name: zfd.text(z.string().optional()),
  currentPassword: zfd.text(),
  newPassword: zfd.text(z.string().optional()),
  passwordConfirmation: zfd.text(z.string().optional()),
});

export type UpdateUserParams = z.infer<typeof updateUserParams> | FormData;

export async function updateUser(
  userId: string,
  params: UpdateUserParams,
): Promise<DataResult<Omit<User, "password">>> {
  const parsedSchema = updateUserParams.safeParse(params);

  if (!parsedSchema.success)
    return { data: null, errors: formatZodErrors(parsedSchema.error) };

  const { name, email, newPassword, passwordConfirmation, currentPassword } =
    parsedSchema.data;

  if (newPassword !== passwordConfirmation) {
    return {
      data: null,
      errors: { passwordConfirmation: "Passwords do not match" },
    };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return { data: null, errors: { userid: "User not found!" } };

  if (!(await verifyPassword(user.password, currentPassword))) {
    return { data: null, errors: { currentPassword: "Wrong password" } };
  }

  const encryptedPassword = newPassword
    ? await encryptPassword(newPassword)
    : undefined;

  const updateData: Partial<typeof users.$inferInsert> = {};
  if (email) updateData.email = email;
  if (name) updateData.name = name;
  if (encryptedPassword) updateData.password = encryptedPassword;
  updateData.updatedAt = new Date();

  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, user.id))
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      featureFlags: users.featureFlags,
    });

  return {
    data: {
      ...updatedUser,
      featureFlags: parseFeatureFlags(updatedUser.featureFlags),
    },
    errors: null,
  };
}

export async function deleteUser(user: User): Promise<Omit<User, "password">> {
  const deletedUser = await db.transaction(async (tx) => {
    // Delete all notes for the user first
    await tx.delete(notes).where(eq(notes.userId, user.id));

    // Delete the user and return the deleted user data
    const [deleted] = await tx
      .delete(users)
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        featureFlags: users.featureFlags,
      });

    return deleted;
  });

  return {
    ...deletedUser,
    featureFlags: parseFeatureFlags(deletedUser.featureFlags),
  };
}
