import { useAppStore } from '@/store/index';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import React, { useEffect } from 'react'
import ContactsContainer from './components/contacts-container/index';
import EmptyChatContainer from './components/empty-chat-container/index';
import ChatContainer from './components/chat-container/index';

const Chat = () => {
    const { userInfo } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast("Please complete your profile setup!! ");
            navigate('/profile');
        }
    }, [userInfo, navigate]);

    return (
        <div className='flex h-screen text-white overflow-hidden'>
            <ContactsContainer />
            {/* <EmptyChatContainer /> */}
            {/* <ChatContainer /> */}
        </div>
    )
}

export default Chat