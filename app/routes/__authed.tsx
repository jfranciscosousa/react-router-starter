import { LoaderFunctionArgs, Outlet, redirect } from "react-router";
import ErrorPage from "~/components/Error500Page";
import LoggedInLayout from "~/components/layouts/LoggedInLayout";
import { userFromRequest } from "~/web/auth.server";
import { Route } from "./+types/__authed";

export type AuthedRouteData = Route.ComponentProps["loaderData"];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await userFromRequest(request);

  if (!user) {
    const url = new URL(request.url);
    const redirectTo = encodeURI(
      `${url.pathname}${url.search ? `?${url.search}` : ``}`,
    );

    throw redirect(`/login?redirectTo=${redirectTo}`);
  }

  return { user };
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function AppPage() {
  return (
    <LoggedInLayout>
      <Outlet />
    </LoggedInLayout>
  );
}
