'use client'
import InboxPage from "@/components/inbox/inbox-page"
import Main from "@/components/ui/main";
import { useAuth } from "@/store/authStore";
import { useRouter } from "next/navigation";

const Inbox: React.FC = () => {
    const {user} = useAuth();
    //TODO: Disable authentication here as backend is sending status code 200 even though the credentials are invalid
    // const router = useRouter()
    // if(!user) 
    //     router.push('/login');
    return (
        <Main >
        <InboxPage/>
        </Main>
    )
}


export default Inbox;