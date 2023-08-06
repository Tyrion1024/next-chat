import Prisma from '@/app/libs/prismadb';
import { resultHandler } from '@/app/api/util';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { User } from '@prisma/client';


export const POST = async (
  request: Request
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !(currentUser as User)?.id || !(currentUser as User)?.email) {
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


    await Prisma.conversation.update({
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


    return resultHandler(newMessage);

  } catch(err: any) {
    return resultHandler(null, 500, `Server Error: ${err.message}`)
  }
}

