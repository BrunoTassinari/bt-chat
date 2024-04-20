import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import FriendRequests from '@/components/friend-requests';
import { redisHelper } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { id } = session.user;

  // ids of people who sent current logged in user a friend requests
  const incomingSenderIds = (await redisHelper.getUserFriendsRequests(id)) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await redisHelper.getUser(senderId)) as string;
      const senderParsed = JSON.parse(sender) as User;

      return {
        senderId,
        senderEmail: senderParsed.email,
      };
    })
  );

  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default page;
