import { ActionFunction, LoaderFunction, redirect } from "react-router";
import { logout } from "~/web/auth.server";

export const action: ActionFunction = async () => logout();

export const loader: LoaderFunction = () => redirect("/", { status: 404 });
