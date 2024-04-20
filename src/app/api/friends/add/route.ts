import { Session } from 'next-auth';
import { z } from 'zod';
import { fetchRedis } from '@/helpers/redis';
import { db } from '@/lib/db';
import { validate } from './validation';

import { addFriendValidator } from '@/lib/validations/add-friend';
import { getCurrentSession } from '@/helpers/auth';
import { dbHelper } from '@/helpers/database';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const idToAdd = (await fetchRedis('get', `user:email:${emailToAdd}`)) as string;

    if (!idToAdd) return new Response('User not found', { status: 404 });

    const session = (await getCurrentSession()) as Session;

    await validate(idToAdd, session);

    await dbHelper.sendRequest(session.user.id, idToAdd);

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response(`Invalid request - ${error}`, { status: 400 });
  }
};
