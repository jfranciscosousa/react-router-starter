import { ActionFunction, LoaderFunction, redirect } from "react-router";
import { setTheme } from "~/web/theme.server";

export const config = { runtime: "edge" };

export const action: ActionFunction = async ({ request }) => setTheme(request);

export const loader: LoaderFunction = () => redirect("/", { status: 404 });
