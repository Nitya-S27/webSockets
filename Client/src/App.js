import React, { useEffect, useRef, useState } from "react";
import { w3cwebsocket as WebSocket } from "websocket";

const App = () => {
  const [inputState, setInputState] = useState({
    userName: "",
    messages: [],
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const usernameRef = useRef(null);

  const client = new WebSocket("ws://127.0.0.1:8000");
  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected.");
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log("got reply! ", dataFromServer);
      if (dataFromServer.type === "message") {
        setInputState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              msg: dataFromServer.msg,
              user: dataFromServer.user,
            },
          ],
        }));
      }
    };
  }, []);

  const buttonClickHandler = (value) => {
    console.log(inputState);
    client.send(
      JSON.stringify({
        type: "message",
        msg: value,
        user: inputState.userName,
      })
    );
    console.log(inputState);
  };
  const submitForm = (e) => {
    e.preventDefault();
    console.log(usernameRef.current.value);
    setInputState((prev) => ({
      ...prev,
      userName: usernameRef.current.value,
    }));
    setIsUserLoggedIn(true);
  };

  return (
    <div className="appWrapper">
      {console.log(inputState)}
      {isUserLoggedIn ? (
        <div>
          {inputState.messages?.map((msg, index) => (
            <p key={index}>
              message: {msg.msg}, user: {msg.user}
            </p>
          ))}
          <button
            onClick={() => {
              buttonClickHandler("Hello");
            }}
          >
            Send
          </button>
        </div>
      ) : (
        <div className="loginComponentWrapper">
          <form onSubmit={submitForm}>
            <input required type="text" ref={usernameRef} />
            <button type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;