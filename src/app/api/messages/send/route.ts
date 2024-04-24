import { Session } from 'next-auth';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { getCurrentSession } from '@/helpers/auth';
import { redisHelper } from '@/helpers/redis';
import { messageValidator } from '@/lib/validations/message';
import { dbHelper } from '@/helpers/database';

export const POST = async (req: Request) => {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = (await getCurrentSession()) as Session;

    const [idUser1, idUser2] = chatId.split('--');

    if (session.user.id !== idUser1 && session.user.id !== idUser2)
      return new Response('Unauthorized', { status: 401 });

    const friendId = session.user.id === idUser1 ? idUser2 : idUser1;
    const friendList = await redisHelper.getUserFriendsIds(session.user.id);

    const isFriend = friendList.includes(friendId);

    if (!isFriend) return new Response('Unauthorized', { status: 401 });

    const rawSender = (await redisHelper.getUser(session.user.id)) as string;
    const sender = JSON.parse(rawSender) as User;

    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    await dbHelper.sendMessage(chatId, timestamp, message);

    return new Response('OK');
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response('Internal server error', { status: 500 });
  }
};
