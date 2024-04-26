import { Session } from 'next-auth';
import { z } from 'zod';
import { redisHelper } from '@/helpers/redis';
import { validate } from './validation';
import { addFriendValidator } from '@/lib/validations/add-friend';
import { getCurrentSession } from '@/helpers/auth';
import { dbHelper } from '@/helpers/database';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const idToAdd = (await redisHelper.getUserByEmail(emailToAdd)) as string;

    if (!idToAdd) return new Response('User not found', { status: 404 });

    const session = (await getCurrentSession()) as Session;
    const { id, email } = session.user;

    await validate(id, idToAdd);

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      'incoming_friend_request',
      {
        senderId: id,
        senderEmail: email,
      }
    );
    await dbHelper.sendRequest(id, idToAdd);

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response(`Invalid request - ${error}`, { status: 400 });
  }
};
