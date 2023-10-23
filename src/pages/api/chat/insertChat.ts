import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";

export const POST: APIRoute = async ({ request }) => {
  try {
    const db = getFirestore(app);
    // Parse the request body
    const body = await request.json();
    const email = body.email;
    const title = body.title;
    const message = body.message;

    // Validate the data (optional but recommended)
    if (!email || !title || !message) {
      return new Response("Invalid request data", { status: 400 });
    }

    // Reference to the Firestore collection (modify as per your schema)
    const emailDocRef = db.collection("chatHistory").doc(email);
    const titleDocRef = emailDocRef.collection("title").doc(title);

    const titleDocSnapshot = await titleDocRef.get();
    let existingMessages = [];
    if (titleDocSnapshot.exists) {
      existingMessages = titleDocSnapshot.data()?.messages || [];
    }

    // Append the new message to the existing messages
    existingMessages.push(message);

    // Update the messages in Firestore
    await titleDocRef.set({ messages: existingMessages }, { merge: true });
    // Append the new message to the existing messages
    existingMessages.push(message);

    return new Response(`Chat added added successfully`, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", {
      status: 500,
    });
  }
};
