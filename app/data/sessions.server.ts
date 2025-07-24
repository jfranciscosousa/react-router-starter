import { createCookie, redirect } from "react-router";
import { and, eq, not } from "drizzle-orm";
import db, { parseFeatureFlags } from "~/data/utils/drizzle.server";
import { sessions, users } from "~/data/schema";
import { SERVER_ENV } from "~/env/envFlags.server";
import { getRequestInfo } from "./request-info.server";

const authCookie = createCookie("auth", {
  secrets: [SERVER_ENV.SECRET_KEY_BASE],
  sameSite: "lax",
  httpOnly: true,
  secure: SERVER_ENV.SECURE_AUTH_COOKIE,
  maxAge: 31536000,
});

export async function authenticate(
  request: Request,
  user: { id: string },
  { redirectTo = "/" } = {},
) {
  const requestInfo = await getRequestInfo(request);
  const [session] = await db
    .insert(sessions)
    .values({ ...requestInfo, userId: user.id })
    .returning();

  return redirect(redirectTo, {
    status: 302,
    headers: {
      location: redirectTo,
      "Set-Cookie": await authCookie.serialize({
        sessionId: session.id,
      }),
    },
  });
}

export async function logout(request: Request) {
  const sessionId = await sessionIdFromRequest(request);

  if (sessionId) await db.delete(sessions).where(eq(sessions.id, sessionId));

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/login",
      "Set-Cookie": await authCookie.serialize({}),
    },
  });
}

export async function sessionIdFromRequest(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const { sessionId } = (await authCookie.parse(cookieHeader)) || {};

  return sessionId;
}

export async function userIdFromRequest(
  request: Request,
): Promise<string | undefined>;
export async function userIdFromRequest(
  request: Request,
  loggedIn: "loggedIn",
): Promise<string>;

export async function userIdFromRequest(
  request: Request,
  loggedIn?: string,
): Promise<string | undefined> {
  const sessionId = await sessionIdFromRequest(request);
  const session = await db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.id, sessionId),
  });

  if (loggedIn === "loggedIn") {
    if (!session?.userId) throw new Error("unauthenticated");
  }

  return session?.userId;
}

export async function userFromRequest(request: Request) {
  const userId = await userIdFromRequest(request);

  if (!userId) return null;

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
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return null;

  return {
    ...user,
    featureFlags: parseFeatureFlags(user.featureFlags),
  };
}

export async function listsSessions(userId: string) {
  return db.query.sessions.findMany({
    where: (sessions, { eq }) => eq(sessions.userId, userId),
  });
}

export async function deleteAllSessions(userId: string) {
  return db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function deleteAllOtherSessions(
  sessionId: string,
  userId: string,
) {
  const fromUserId = eq(sessions.userId, userId);
  const notThisSession = not(eq(sessions.id, sessionId));

  return db.delete(sessions).where(and(fromUserId, notThisSession));
}
