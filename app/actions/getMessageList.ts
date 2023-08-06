import Prisma from '@/app/libs/prismadb';

export default async function getMessageList (conversationId: string) {

  try {
    const messageList = await Prisma.message.findMany({
      orderBy: {
        createdAt: 'asc'
      },
      where: {
        conversationId
      },
      include: {
        sender: true,
        seen: true
      }
    })

    return messageList
  } catch(err: any) {
    return []
  }
}