import { useAppStore } from "@/store/index";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import React, { useEffect } from "react";
import ContactsContainer from "./components/contacts-container/index";
import EmptyChatContainer from "./components/empty-chat-container/index";
import ChatContainer from "./components/chat-container/index";

const Chat = () => {
    const {
        userInfo,
        selectedChatType,
        isUploading,
        isDownloading,
        fileUploadProgress,
        fileDownloadProgress,
    } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast("Please complete your profile setup!! ");
            navigate("/profile");
        }
    }, [userInfo, navigate]);

    return (
        <div className="flex h-screen text-white overflow-hidden">
            {
                isUploading && (
                    <div className="h-screen w-screen fixed top-0 z-100 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg ">
                        <h5 className="text-5xl animate-pulse">Uploading File</h5>
                        {fileUploadProgress}%
                    </div>
                )
            }
            {
                isDownloading && (
                    <div className="h-screen w-screen fixed top-0 z-100 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg ">
                        <h5 className="text-5xl animate-pulse">Downloading File</h5>
                        {fileDownloadProgress}%
                    </div>
                )
            }
            <ContactsContainer />
            {selectedChatType === undefined ? (
                <EmptyChatContainer />
            ) : (
                <ChatContainer />
            )}
        </div>
    );
};

export default Chat;
