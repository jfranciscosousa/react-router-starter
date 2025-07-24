import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "react-router";
import {
  createNote,
  deleteAllNotes,
  deleteNote,
  listNotes,
} from "~/data/notes.server";
import NotesView from "~/modules/Notes/NotesView";
import { userIdFromRequest } from "~/web/auth.server";
import { Route } from "./+types/__authed.notes";

export type NotesRouteData = Route.ComponentProps["loaderData"];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await userIdFromRequest(request);
  const notes = await listNotes(userId);

  return { notes };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await userIdFromRequest(request);
  const form = Object.fromEntries(await request.formData());

  switch (form._action) {
    case "create":
      await createNote(userId, {
        content: form.content as string,
      });
      break;

    case "delete":
      await deleteNote(userId, form.id as string);
      break;

    case "delete-all":
      await deleteAllNotes(userId);
      break;
  }

  return redirect("/notes");
};

export const meta: MetaFunction = () => [
  {
    title: "Notes",
  },
];

export default function NotesPage() {
  return <NotesView />;
}
