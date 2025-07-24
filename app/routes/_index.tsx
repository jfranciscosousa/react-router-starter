import { LoaderFunction, redirect } from "react-router";

export const loader: LoaderFunction = async () => redirect("/notes");
