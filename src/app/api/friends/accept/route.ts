import { z } from 'zod';
import { Session } from 'next-auth';
import { getCurrentSession } from '@/helpers/auth';
import { validate } from './validation';
import { dbHelper } from '@/helpers/database';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = (await getCurrentSession()) as Session;
    const { id } = session.user;

    await validate(id, idToAdd);

    await dbHelper.addFriend(idToAdd, id);
    await dbHelper.removeFriendRequest(id, idToAdd);

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response(`Invalid request - ${error}`, { status: 400 });
  }
};
