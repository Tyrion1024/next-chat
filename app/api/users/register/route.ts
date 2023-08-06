import bcrypt from 'bcrypt';
import Prisma from '@/app/libs/prismadb';
import { resultHandler } from '@/app/api/util';


export async function POST(
  request: Request
) {
  try {
    const body = await request.json()

    const {
      email,
      name,
      password
    } = body;
  
    if (!email || !name || !password) {
      return resultHandler(null, 400, 'Missing info')
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await Prisma.user.create({
      data: {
        email,
        name,
        hashedPassword
      }
    });

    return resultHandler(user)

  } catch(err: any) {
    return resultHandler(null, 500, `Server Error: ${err.message}`)
  }

}