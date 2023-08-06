import Sidebar from "../components/sidebar/Sidebar"
import getConversationList from '@/app/actions/getConversationList'
import ConversationList from "./components/ConversationList";
import getUsers from "../actions/getUsers";

export default async function ConversationLayout({
  children
}: {
  children: React.ReactNode
}) {

  const conversitionList = await getConversationList();

  const users = await getUsers();

  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList
          users={users}
          initialItems={conversitionList}
        />
        {children}
      </div>
    </Sidebar>
  )
}