import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "../../../firebase/server";

export const POST: APIRoute = async ({ request }) => {
  const auth = getAuth(app);

  /* Create user */
  const rawBody = await request.json();
  const formData = new URLSearchParams(rawBody);
  const email = formData.get("email");
  const password = formData.get("password");
  const displayName = formData.get("name");

  // Check for missing fields and return a 400 response if any are missing
  if (!email || !password || !displayName) {
    return new Response("Missing registration fields", {
      status: 400,
    });
  }
  try {
    // Create a new user using Firebase Auth service
    await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    // If successful, you can redirect to /signin or return a success message
    // For the purpose of this example, we'll return a success message.
    // In a real-world application, you'd typically redirect the user.
    return new Response("User registered successfully", {
      status: 200,
      headers: {
        // This is a pseudo-header for redirection. Actual implementation might vary based on your setup.
        Location: "/signin",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(`Something went wrong`, {
      status: 400,
    });
  }
};
