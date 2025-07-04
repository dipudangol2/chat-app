import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store/index";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

const MessageContainer = () => {
  //* variables
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  // * Functions

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|png|jpeg|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const downloadFile = async (fileUrl) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${fileUrl}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgress(percentCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", fileUrl.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      } `}
    >
      {message.messageType === "text" && (
        <div
          className={`
      ${
        message.sender !== selectedChatData._id
          ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
          : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20 "
      } 
          border inline-block p-4 rounded my-1 max-w-[50%]  break-words whitespace-pre`}
        >
          {message.content}
        </div>
      )}

      {message.messageType === "file" && (
        <div
          className={`
      ${
        message.sender !== selectedChatData._id
          ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
          : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20 "
      } 
          border inline-block p-2 rounded my-1 max-w-[50%] break-words whitespace-pre`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer "
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div
              className="cursor-pointer flex items-center justify-center gap-2 "
              onClick={() => downloadFile(message.fileUrl)}
            >
              <span className="text-white/80 md:text-xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span className="text-sm md:text-md text-start break-all text-wrap ">
                {message.fileUrl.split("/").pop()}
              </span>
              {/* <span className="bg-black/20 rounded-full p-3 md:text-xl hover:bg-black/50 cursor-pointer transition-all duration-300 hover:text-white"
                    onClick={() => downloadFile(message.fileUrl)}
                  >
                    <IoMdArrowRoundDown />
                  </span> */}
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessages = (message) => {
    console.log(message.sender._id, userInfo.id);
    console.log(message.sender._id === userInfo.id);
    return (
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20 "
            } 
          border inline-block p-4 rounded my-1 max-w-[50%]  break-words whitespace-pre`}
          >
            {message.content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[50] top-0 left-0 h-screen w-screen flex items-center justify-center backdrop-blur-lg flex-col  ">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              alt="message image"
              className="h-auto max-h-[75vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 rounded-full p-3 text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300 hover:text-white"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 rounded-full p-3 text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300 hover:text-white"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
