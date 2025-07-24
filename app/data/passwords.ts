import argon from "argon2";

export async function encryptPassword(password: string): Promise<string> {
  return argon.hash(password);
}

export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  return argon.verify(hash, password);
}
