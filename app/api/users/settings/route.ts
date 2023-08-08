import Prisma from '@/app/libs/prismadb';
import { resultHandler } from '@/app/api/util';
import getCurrentUser from '@/app/actions/getCurrentUser';


export async function POST(
  request: Request
) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || !currentUser?.id) {
      return resultHandler(null, 401, 'Unauthorized')
    }

    const body = await request.json()

    const {
      name,
      image
    } = body;
  

    const updateUser = await Prisma.user.update({
      where: {
        id: currentUser?.id
      },
      data: {
        image,
        name
      }
    });

    return resultHandler(updateUser)

  } catch(err: any) {
    return resultHandler(null, 500, `Server Error: ${err.message}`)
  }

}