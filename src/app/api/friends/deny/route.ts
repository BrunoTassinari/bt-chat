import { Session } from 'next-auth';
import { z } from 'zod';
import { getCurrentSession } from '@/helpers/auth';
import { db } from '@/lib/db';
import { dbHelper } from '@/helpers/database';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

    const session = (await getCurrentSession()) as Session;

    await dbHelper.removeFriendRequest(session.user.id, idToDeny);

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response(`Invalid request - ${error}`, { status: 400 });
  }
};
