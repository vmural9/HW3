import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";

export const POST: APIRoute = async () => {
  try {
    const db = getFirestore(app);
    // WRITE
    // .....YOUR
    // ..........CODE
    // ................HERE
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", {
      status: 500,
    });
  }
};
