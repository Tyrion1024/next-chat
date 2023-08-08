import getCurrentUser from "@/app/actions/getCurrentUser";
import { resultHandler } from "@/app/api/util";
import Prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId: string
}

export const POST = async (
  request: Request,
  { params }: { params: IParams }
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser?.id || !currentUser?.email) {
      return resultHandler(null, 401, 'Unauthorized')
    }

    const {
      conversationId
    } = params;
    
    const conversation = await Prisma.conversation.findUnique({
      where: {id: conversationId},
      include: {
        users: true
      }
    })

    if (!conversation || !conversation.id) {
      return resultHandler(null, 400, 'Invalid Id');
    }
    
    const deleteConversation = await Prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      },
    })


    conversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:delete', conversation)
      }
    });


    return resultHandler(deleteConversation)

  } catch(err: any) {
    return resultHandler(null, 500, `Server Error: ${err.message}`)
  }
}