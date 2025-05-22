import { useAppStore } from '@/store/index';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import React, { useEffect } from 'react'

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
        <div>Chat</div>
    )
}

export default Chat