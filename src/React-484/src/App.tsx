import React from "react";
import "./App.css";
import Landing from "./components/Landing";
// import { UserRecord } from "firebase-admin/auth";
// Define the props interface
interface AppProps {
  email: string;
}

const App: React.FC<AppProps> = () => {
  return (
    <>
      <Landing />
    </>
  );
};

export default App;
