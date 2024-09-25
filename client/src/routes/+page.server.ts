import { redirect } from "@sveltejs/kit";
import { API_URL } from "$env/static/private";

type Payload = {
  user?: {
    id?: number,
    username?: string;
  };
};

export const load = async ({ cookies, request }) => {
  const token = cookies.get('token');

  if (!token) {
    throw redirect(301, "/signin");
  }

  const response = await fetch(`${API_URL}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (response.ok) {
    const { data }: { data: Payload; } = await response.json();
    return data;
  }

  return {
    error: await response.text()
  };
};