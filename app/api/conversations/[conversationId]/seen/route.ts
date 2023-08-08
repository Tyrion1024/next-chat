import getCurrentUser from "@/app/actions/getCurrentUser";
import { resultHandler } from "@/app/api/util";
import Prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { Message } from "@prisma/client";

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
    
    const conversation = Prisma.conversation.findUnique({
      where: {id: conversationId},
      include: {
        message: {
          include: {
            seen: true
          }
        },
        users: true
      }
    })

    if (!conversation || !conversation?.message) {
      return resultHandler(null, 400, 'Invalid Id');
    }
    
    const lastMessage = (conversation?.message as unknown as [])[conversation?.message?.length - 1];
    if (!lastMessage) {
      return resultHandler(conversation)
    }

    const updateMessage = await Prisma.message.update({
      where: {
        id: (lastMessage as Message).id
      },
      include: {
        sender: true,
        seen: true
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      }
    })

    await pusherServer.trigger(currentUser.email!, 'conversation:update', {
      id:conversationId,
      message: [updateMessage]
    })

    if ((lastMessage as Message).seenIds.includes(currentUser.id)) {
      return resultHandler(updateMessage)
    }

    await pusherServer.trigger(conversationId, 'message:update', updateMessage)

    return resultHandler(updateMessage)

  } catch(err: any) {
    return resultHandler(null, 500, `Server Error: ${err.message}`)
  }
}