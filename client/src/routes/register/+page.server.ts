import { API_URL } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

type State = {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
  };
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

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
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
    } else {
      const result: State = await response.json();

      console.log(result);

      if (result.errors) {
        return {
          errors: result.errors
        };
      }

      return {
        message: result.message || 'An error occurred.'
      };
    }
  }
};