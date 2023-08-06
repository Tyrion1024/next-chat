import getCurrentUser from "@/app/actions/getCurrentUser";
import { resultHandler } from "@/app/api/util";
import Prisma from "@/app/libs/prismadb";
import { Message, User } from "@prisma/client";

interface IParams {
  conversationId: string
}

export const POST = async (
  request: Request,
  { params }: { params: IParams }
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !(currentUser as User)?.id || !(currentUser as User)?.email) {
      return resultHandler(null, 401, 'Unauthorized')
    }

    const {
      conversationId
    } = params;
    
    const conversation = Prisma.conversation.findUnique({
      where: {id: conversationId},
      include: {
        users: true
      }
    })

    if (!conversation || !conversation?.message) {
      return resultHandler(null, 400, 'Invalid Id');
    }
    
    const deleteConversation = Prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      },
    })

    return resultHandler(deleteConversation)

  } catch(err: any) {
    return resultHandler(null, 500, `Server Error: ${err.message}`)
  }
}