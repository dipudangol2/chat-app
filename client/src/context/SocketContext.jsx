import { HOST } from "@/utils/constants";
import { io } from "socket.io-client";
import { createContext, useContext, useEffect, useRef } from "react";
import { useAppStore } from "../store";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket.");
      });

      const handleRecieveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage, addContactsInDMContacts } =
          useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          console.log("message recieved", message);
          addMessage(message);
        }
        addContactsInDMContacts(message);
      };
      const handlerecieveChannelMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList } =
          useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message.channelId
        ) {
          addMessage(message);
        }
        addChannelInChannelList(message);
      };

      socket.current.on("recieveMessage", handleRecieveMessage);
      socket.current.on("recieve-channel-message", handlerecieveChannelMessage);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
