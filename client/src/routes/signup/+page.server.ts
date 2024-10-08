import { API_URL } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

type State = {
  message?: string | null;
};

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();

    const username = data.get('username');
    const email = data.get('email');
    const password = data.get('password');

    const body = JSON.stringify({
      username,
      email,
      password
    });

    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (response.ok) {
      const { data } = await response.json();
      const token = data.token;

      cookies.set('token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 // 1 hour
      });

      throw redirect(301, '/');
    }

    const error: State = await response.json();

    return {
      message: error.message || 'An error occured.'
    };
  }
};