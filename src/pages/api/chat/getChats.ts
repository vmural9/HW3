import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import type { Chat, Message } from "../../../React-484/src/utils/types";

export const GET: APIRoute = async ({ params }) => {
  try {
    // Getting the Firestore service.
    const db = getFirestore(app);

    // Retrieve the email from the query parameters
    const userEmail = params.email;
    if (!userEmail) {
      return new Response("Email parameter is missing", {
        status: 400,
      });
    }

    // Access the user's document in the chatHistory collection
    const userDoc = db.collection("chatHistory").doc(userEmail);

    // Retrieve the titles (chat sessions) for the user
    const titlesSnapshot = await userDoc.collection("titles").get();

    // Extract chat messages from each title
    const allChats: Chat[] = [];
    titlesSnapshot.forEach((titleDoc) => {
      const titleData = titleDoc.data();
      if (titleData.messages) {
        allChats.push({
          title: titleDoc.id,
          messages: titleData.messages as Message[],
        });
      }
    });

    // Return the chat messages as a response
    return new Response(JSON.stringify(allChats), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", {
      status: 500,
    });
  }
};
