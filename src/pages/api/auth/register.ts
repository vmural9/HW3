import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "../../../firebase/server";

export const POST: APIRoute = async () => {
  const auth = getAuth(app);

  /* TODO: Get form data */
  // From the form data, get the email, password and name.
  // For any missing field send 400 response.
  // Create a user using Auth service.
  // Takes in email, password, displayName
  // If successful, redirect to /signin

  /* Create user */
  try {
    // WRITE
    // .....YOUR
    // ..........CODE
    // ................HERE
    // WRITE
    // .....YOUR
    // ..........CODE
    // ................HERE
    // WRITE
    // .....YOUR
    // ..........CODE
    // ................HERE
  } catch (error) {
    console.log(error);
    return new Response(`Something went wrong`, {
      status: 400,
    });
  }
  // WRITE
  // .....YOUR
  // ..........CODE
  // ................HERE
};
