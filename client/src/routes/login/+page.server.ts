import { API_URL } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();

    const email = formData.get('email');
    const password = formData.get('password');
    const body = JSON.stringify({ email, password });

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body
    });

    if (response.ok) {
      const token = await response.json();

      cookies.set('token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 30
      });

      throw redirect(301, '/protected');
    }

    return {
      error: await response.text()
    };
  }
};