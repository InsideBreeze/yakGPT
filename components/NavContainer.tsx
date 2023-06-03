import { useChatStore } from "@/stores/ChatStore";
import Nav from "./Nav";

export default function NavContainer() {
    const chats = useChatStore(state => state.chats)

    return (
        <Nav chats={chats} />
    )
}
