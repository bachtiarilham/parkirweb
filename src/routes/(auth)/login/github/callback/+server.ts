import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.js";

export const GET: RequestHandler = async () => {
	redirect(302, "/login");
};
