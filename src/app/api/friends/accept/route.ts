import { z } from 'zod';
import { Session } from 'next-auth';
import { getCurrentSession } from '@/helpers/auth';
import { validate } from './validation';
import { dbHelper } from '@/helpers/database';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { redisHelper } from '@/helpers/redis';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = (await getCurrentSession()) as Session;
    const { id, email } = session.user;

    await validate(id, idToAdd);

    pusherServer.trigger(toPusherKey(`user:${idToAdd}:friends`), 'friends', {
      senderId: id,
      senderEmail: email,
    });

    const [userRaw, friendRaw] = (await Promise.all([
      redisHelper.getUser(id),
      redisHelper.getUser(idToAdd),
    ])) as [string, string];

    const user = JSON.parse(userRaw) as User;
    const friend = JSON.parse(friendRaw) as User;

    await Promise.all([
      pusherServer.trigger(toPusherKey(`user:${idToAdd}:friends`), 'new_friend', user),
      pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`), 'new_friend', friend),

      await dbHelper.addFriend(idToAdd, id),
      await dbHelper.removeFriendRequest(id, idToAdd),
    ]);

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response(`Invalid request - ${error}`, { status: 400 });
  }
};
