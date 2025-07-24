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
  listsSessions,
  sessionIdFromRequest,
  userIdFromRequest,
} from "~/data/sessions.server";
import { Route } from "./+types/__authed.profile.sessions";
import { Card, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

type AuthedProfileSessionsLoaderData = Route.ComponentProps["loaderData"];

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
      <CardTitle className="mt-8">Sessions</CardTitle>

      {sessions.map((session) => (
        <Card key={session.id} className="p-4">
          {session.userAgent}

          {session.active && (
            <p className="mt-4">This is the currently active session</p>
          )}
        </Card>
      ))}

      <fetcher.Form
        method="post"
        className="flex flex-col items-center justify-center"
      >
        <Button
          variant="destructive"
          type="submit"
          name="_action"
          value="delete-all"
          aria-label="Delete all sessions"
          isLoading={fetcher.state === "submitting"}
        >
          Delete all sessions
        </Button>
      </fetcher.Form>
    </TabsContent>
  );
}
