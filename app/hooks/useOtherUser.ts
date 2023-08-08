import { useSession } from "next-auth/react";
import { useMemo } from "react";
import type { FullConversationType } from "../types";
import { User } from '@prisma/client';

const useOtherUser = (conversation: FullConversationType | {
  users: User[]
}) => {
  const session = useSession();
  return useMemo(() => conversation.users.filter((user: User) => user.email !== session?.data?.user?.email), [session?.data?.user?.email, conversation.users])[0]
}


export default useOtherUser