import Prisma from '@/app/libs/prismadb';
import { resultHandler } from '@/app/api/util';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { pusherServer } from '@/app/libs/pusher';

export const POST = async (
  request: Request
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser?.id || !currentUser?.email) {
      return resultHandler(null, 401, 'Unauthorized')
    }
    const body = await request.json()

    const {
      message,
      image,
      conversationId
    } = body;


    const newMessage = await Prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId
          }
        },
        sender: {
          connect: {
            id: currentUser.id
          }
        },
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      },
      include: {
        seen: true,
        sender: true
      }
    })


    const updatedConversation = await Prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        message: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: true,
        message: {
          include: {
            seen: true
          }
        }
      }
    })

    await pusherServer.trigger(conversationId, 'message:new', newMessage)

    const lastMessage = updatedConversation.message[updatedConversation.message.length - 1]

    updatedConversation.users.map(user => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        message: [lastMessage]
      })
    })
    
    return resultHandler(newMessage);
  } catch(err: any) {
    return resultHandler(null, 500, `Server Error: ${err.message}`)
  }
}

