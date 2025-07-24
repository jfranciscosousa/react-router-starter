import { ActionFunction, LoaderFunction, redirect } from "react-router";
import { logout } from "~/data/sessions.server";

export const action: ActionFunction = async ({ request }) => logout(request);

export const loader: LoaderFunction = () => redirect("/", { status: 404 });
