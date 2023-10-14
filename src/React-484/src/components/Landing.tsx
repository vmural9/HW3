import { type SetStateAction, useEffect, useState } from "react";
import type { Chat, ChatMessage } from "../utils/types";

function Landing() {
  const [value, setValue] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [previousChats, setPreviousChats] = useState<Array<ChatMessage>>([]);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);

  // TODO Complete the functionality
  // Make a request to get all the chats associated with a particular email.
  // The response from the GET request should be an array of type "Chat". [Formulate your APIs accordingly]
  // If there are chat messages available for email:
  // 1. Format chat messages into a flat array of objects i.e Convert the current array of type "Chat" to an Array of type "ChatMessage".
  //    HINT: flatMap chats by iterating over objects of type "Chat" and for each Chat flatMap the message of type "Message".
  //          Your formattedMessage should be an array of "ChatMessage"
  // 2. Update the setPreviousChats state with the formattedMessage.
  // Set the current chat title to the title of the first chat received in the response.

  useEffect(() => {
    async function getChats() {
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
        // WRITE
        // .....YOUR
        // ..........CODE
        // ................HERE
        // WRITE
        // .....YOUR
        // ..........CODE
        // ................HERE
      } catch (error) {
        console.error(error);
      }
    }
    getChats();
  }, [email]); // Include email as a dependency

  const createNewChat = () => {
    setMessage("");
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle: SetStateAction<string | null>) => {
    setCurrentTitle(uniqueTitle);
    setMessage("");
    setValue("");
  };

  // Function to generate a random sentence
  const generateRandomSentence = () => {
    const subjects = ["The cat", "A dog", "My friend", "The weather"];
    const verbs = ["jumps", "barks at", "loves", "hates"];
    const objects = ["the moon", "the park", "chocolate", "rainy days"];

    const getRandomElement = (array: string | unknown[]) => {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    };

    const subject = getRandomElement(subjects);
    const verb = getRandomElement(verbs);
    const object = getRandomElement(objects);

    return `${subject} ${verb} ${object}.`;
  };

  // Function to generate random text of a specified length
  const chatsHandler = async () => {
    // console.log(email);
    try {
      // Generate a random sentence
      const title = currentTitle || value;
      const randomSentence = generateRandomSentence();
      setMessage(randomSentence);

      // TODO Complete the functionality
      // Make a POST request to add the new chat
      // As part of request body, send stringified {email: email, title: title, message: {USER: USER_INPUT, BOT: BOT_RANDOM}}
      // If response.status === 200, set current input value to ""
      // Else set current input value to "XXXXXXXXXX ERROR OCCURRED XXXXXXXXX"

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
      console.error(error);
    }
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }

    if (currentTitle && value && message) {
      setPreviousChats((previousChats) => [
        ...previousChats,
        {
          title: currentTitle,
          role: "User:",
          content: value,
        },
        {
          title: currentTitle,
          role: "BOT:",
          content: message,
        },
      ]);
    }
    // eslint-disable-next-line
  }, [message, currentTitle]);

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button id="newChat" onClick={createNewChat}>
          +New Chat
        </button>
        <ul className="history" role="history-pane">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}{" "}
            </li>
          ))}
        </ul>
        <nav>
          <p>Baked for CS484 💝</p>
        </nav>
        <form action="/api/auth/signout">
          <button id="logout" type="submit">
            Sign out
          </button>
        </form>
      </section>

      <section className="main">
        {!currentTitle && <h1> GPT-484</h1>}
        <ul className="feed" role="view-pane">
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content} </p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              id="inputField"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  chatsHandler();
                }
              }}
            />
            <div id="submit" onClick={chatsHandler}>
              ➢
            </div>
          </div>
          <p className="info">
            Fun to love GPT App for showing a Full-stack application. Allows to
            demo a Full-stack Serverless Application.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Landing;
