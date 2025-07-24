import { hash, compare, genSalt } from "bcrypt-ts";

export async function encryptPassword(password: string): Promise<string> {
  return hash(password, await genSalt(12));
}

export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  return compare(password, hash);
}
