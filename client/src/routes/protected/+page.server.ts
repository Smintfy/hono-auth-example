import { redirect } from "@sveltejs/kit";
import { API_URL } from "$env/static/private";

export const load = async ({ cookies, request }) => {
  const token = cookies.get('token');

  if (!token) {
    throw redirect(301, "/login");
  }
};