import { FC } from 'react';
import { Session } from 'next-auth';
import { notFound } from 'next/navigation';
import { getCurrentSession } from '@/helpers/auth';
import { dbHelper } from '@/helpers/database';
import { redisHelper } from '@/helpers/redis';
import { messageArrayValidator } from '@/lib/validations/message';

interface PageProps {
  params: {
    chatId: string;
  };
}

const getChatMessages = async (chatId: string) => {
  try {
    const results: string[] = await redisHelper.getChatMessages(chatId);

    const dbMessages = results.map((result) => JSON.parse(result) as Message);

    const reversedMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reversedMessages);

    return messages;
  } catch (error) {
    return notFound();
  }
};

const page: FC<PageProps> = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = (await getCurrentSession()) as Session;
  if (!session) notFound();

  const { user } = session;
  const [idUser1, idUser2] = chatId.split('--');

  if (user.id !== idUser1 && user.id !== idUser2) notFound();

  const chatPartnerId = user.id === idUser1 ? idUser2 : idUser1;
  const chatPartner = (await dbHelper.getUser(chatPartnerId)) as User;
  const initialMessages = await getChatMessages(chatId);

  return <div>{params.chatId}</div>;
};
export default page;
