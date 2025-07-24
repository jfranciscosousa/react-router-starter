import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  useFetcher,
  useLoaderData,
} from "react-router";
import { TabsContent } from "~/components/ui/tabs";
import {
  deleteAllSessions,
  deleteSession,
  listsSessions,
  sessionIdFromRequest,
  userIdFromRequest,
} from "~/data/sessions.server";
import { Route } from "./+types/__authed.profile.sessions";
import { Card, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Trash2, Monitor, Smartphone, Tablet } from "lucide-react";

type AuthedProfileSessionsLoaderData = Route.ComponentProps["loaderData"];

function getDeviceIcon(userAgent: string | null) {
  const ua = userAgent?.toLowerCase() ?? "";
  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone")
  ) {
    return <Smartphone className="h-4 w-4" />;
  }
  if (ua.includes("tablet") || ua.includes("ipad")) {
    return <Tablet className="h-4 w-4" />;
  }
  return <Monitor className="h-4 w-4" />;
}

function parseUserAgent(userAgent: string | null) {
  const ua = userAgent?.toLowerCase() ?? "";
  let browser = "Unknown";
  let os = "Unknown";

  if (ua.includes("chrome")) browser = "Chrome";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari")) browser = "Safari";
  else if (ua.includes("edge")) browser = "Edge";

  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("ios")) os = "iOS";

  return { browser, os };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const sessionId = await sessionIdFromRequest(request);
  const userId = await userIdFromRequest(request, "loggedIn");

  return (await listsSessions(userId)).map((session) => ({
    ...session,
    active: session.id === sessionId,
  }));
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await userIdFromRequest(request, "loggedIn");
  const form = Object.fromEntries(await request.formData());

  switch (form._action) {
    case "delete":
      if (form.sessionId) {
        await deleteSession(form.sessionId as string, userId);
      }
      break;

    case "delete-all":
      await deleteAllSessions(userId);
      break;
  }

  return redirect("/profile/sessions");
};

export default function ProfileView() {
  const fetcher = useFetcher();
  const sessions = useLoaderData<AuthedProfileSessionsLoaderData>();

  return (
    <TabsContent value="sessions">
      <CardTitle className="mt-8 mb-6">Active Sessions</CardTitle>

      <div className="space-y-4">
        {sessions.map((session) => {
          const { browser, os } = parseUserAgent(session.userAgent);
          const deviceIcon = getDeviceIcon(session.userAgent);

          return (
            <Card key={session.id} className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {deviceIcon}

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium">
                        {browser} on {os}
                      </h3>
                      {session.active && (
                        <Badge variant="secondary" className="text-xs">
                          Current Session
                        </Badge>
                      )}
                    </div>

                    <div className="text-muted-foreground mt-2 space-y-1 text-xs">
                      {session.ipAddress && <p>IP: {session.ipAddress}</p>}
                      {session.location && <p>Location: {session.location}</p>}
                      {session.device && <p>Device: {session.device}</p>}
                    </div>
                  </div>
                </div>

                {!session.active && (
                  <fetcher.Form method="post" className="ml-4">
                    <input type="hidden" name="sessionId" value={session.id} />
                    <Button
                      variant="ghost"
                      size="sm"
                      type="submit"
                      name="_action"
                      value="delete"
                      aria-label={`Delete session`}
                      disabled={fetcher.state === "submitting"}
                      className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </fetcher.Form>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {sessions.length > 1 && (
        <div className="mt-8 border-t pt-6">
          <fetcher.Form method="post" className="flex justify-center">
            <Button
              variant="destructive"
              type="submit"
              name="_action"
              value="delete-all"
              aria-label="Delete all sessions"
              isLoading={fetcher.state === "submitting"}
              size="sm"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Sessions
            </Button>
          </fetcher.Form>
        </div>
      )}
    </TabsContent>
  );
}
