import { LoaderFunction, redirect } from "react-router";

export const config = { runtime: "edge" };

export const loader: LoaderFunction = async () => redirect("/notes");
