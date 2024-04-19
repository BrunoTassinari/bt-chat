import { Session } from 'next-auth';
import { fetchRedis } from '@/helpers/redis';

export const validate = async (idToAdd: string, session: Session) => {
  const isAlreadyFriend = await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd);

  if (isAlreadyFriend) return new Response('Already friends', { status: 400 });

  const hasFriendRequest = await fetchRedis(
    'sismember',
    `user:${session.user.id}:incoming_friend_requests`,
    idToAdd
  );

  if (!hasFriendRequest) return new Response('Friend request not found', { status: 404 });

  return true;
};
