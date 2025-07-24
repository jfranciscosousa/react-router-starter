import { Outlet } from "react-router";
import { LoaderFunction, redirect } from "react-router";
import LoggedOutLayout from "~/components/layouts/LoggedOutLayout";
import { userFromRequest } from "~/web/auth.server";
import ErrorPage from "~/components/Error500Page";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await userFromRequest(request);

  if (user) return redirect("/notes");

  return null;
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function UnauthedLayout() {
  return (
    <LoggedOutLayout>
      <Outlet />
    </LoggedOutLayout>
  );
}
