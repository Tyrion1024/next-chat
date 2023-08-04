import { NextResponse } from 'next/server';

export const resultHandler = (data: any = {}, status = 200, message = '') => {
  return NextResponse.json({
    data: data,
    success: status === 200,
    message
  })
}