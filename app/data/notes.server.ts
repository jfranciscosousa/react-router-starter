import { eq, and, asc } from "drizzle-orm";
import db from "./utils/drizzle.server";
import { notes, Note } from "./schema";

export async function listNotes(userId: string): Promise<Note[]> {
  if (!userId) return [];

  return db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(asc(notes.createdAt));
}

export async function deleteNote(userId: string, id: string): Promise<void> {
  await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
}

export async function deleteAllNotes(userId: string): Promise<void> {
  await db.delete(notes).where(eq(notes.userId, userId));
}

export async function createNote(
  userId: string,
  noteParams: { content: string },
) {
  const [newNote] = await db
    .insert(notes)
    .values({
      content: noteParams.content,
      userId,
    })
    .returning();

  return newNote;
}
