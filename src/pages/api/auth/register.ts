import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "../../../firebase/server";

export const POST: APIRoute = async ({ request, redirect }) => {
  const auth = getAuth(app);
  console.log("Inside Register");
  /* Create user */
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const displayName = formData.get("name");

  console.log(email);
  console.log(password);
  console.log(displayName);
  console.log(typeof email);

  // Check for missing fields and return a 400 response if any are missing
  if (!email || !password || !displayName) {
    return new Response("Missing registration fields", {
      status: 400,
    });
  }
  try {
    // Create a new user using Firebase Auth service
    await auth
      .createUser({
        email: email,
        password: password,
        displayName: displayName,
      })
      .then((userRecord) => {
        console.log("Successfully created new user:", userRecord.uid);
      })
      .catch((error) => {
        console.log("Error creating new user:", error);
      });

    console.log(email);
    console.log("Creating User");
    // If successful, you can redirect to /signin or return a success message
    // For the purpose of this example, we'll return a success message.
    // In a real-world application, you'd typically redirect the user.

    return redirect("/signin");
  } catch (error) {
    console.log(error);
    return new Response(`Something went wrong lololol`, {
      status: 400,
    });
  }
};
