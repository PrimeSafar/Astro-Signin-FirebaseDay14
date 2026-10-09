export const prerender = false;

import { adminAuth } from "../../../firebase/server";

export async function POST({ request, cookies }) {
  const { idToken } = await request.json();

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn,
  });

  cookies.set("session", sessionCookie, {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: expiresIn / 1000,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}