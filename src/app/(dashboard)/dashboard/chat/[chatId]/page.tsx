import { FC } from 'react';
import { Session } from 'next-auth';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCurrentSession } from '@/helpers/auth';
import { dbHelper } from '@/helpers/database';
import { redisHelper } from '@/helpers/redis';
import { messageArrayValidator } from '@/lib/validations/message';
import Messages from '@/components/messages';
import ChatInput from '@/components/chat-input';

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

    const messages = messageArrayValidator.parse(reversedMessages) as Message[];

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

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">{chatPartner.name}</span>
            </div>

            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages initialMessages={initialMessages} sessionId={session.user.id} />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};
export default page;
