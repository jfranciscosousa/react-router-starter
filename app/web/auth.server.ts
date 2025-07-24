import { createCookie, redirect } from "react-router";
import { eq } from "drizzle-orm";
import db, { parseFeatureFlags } from "~/data/utils/drizzle.server";
import { users } from "~/data/schema";
import { SERVER_ENV } from "~/env/envFlags.server";

const authCookie = createCookie("auth", {
  secrets: [SERVER_ENV.SECRET_KEY_BASE],
  sameSite: "strict",
  httpOnly: true,
  secure: SERVER_ENV.SECURE_AUTH_COOKIE,
});

export async function authenticate(
  user: { id: string },
  { redirectTo = "/", rememberMe = false } = {},
) {
  return redirect(redirectTo, {
    status: 302,
    headers: {
      location: redirectTo,
      "Set-Cookie": await authCookie.serialize(
        {
          userId: user.id,
        },
        {
          maxAge: rememberMe ? 31536000 : 3600,
        },
      ),
    },
  });
}

export async function logout() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/login",
      "Set-Cookie": await authCookie.serialize({}),
    },
  });
}

export async function userIdFromRequest(request: Request): Promise<string> {
  const cookieHeader = request.headers.get("Cookie");
  const { userId } = (await authCookie.parse(cookieHeader)) || {};

  return userId;
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
