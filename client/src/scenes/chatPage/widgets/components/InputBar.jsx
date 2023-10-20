import { Box } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
export const InputBar = (sendMessages) => {
  const [currentMessage, setCurrentMessage] = useState("");
  return (
    <>
      <WidgetWrapper>
        <div className="chat-footer">
          <input
            type="text"
            value={currentMessage}
            placeholder="Hey..."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
          />
          {/* <button onClick={() => sendMessages(currentMessage)}>&#9658;</button> */}
        </div>
      </WidgetWrapper>
    </>
  );
};
