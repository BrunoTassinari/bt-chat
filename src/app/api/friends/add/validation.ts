import { Session } from 'next-auth';
import { fetchRedis } from '@/helpers/redis';

export const validate = async (idToAdd: string, Session: Session) => {
  if (idToAdd === Session.user.id)
    return new Response('Cannot add yourself as a friend', { status: 400 });

  const isAlreadyFriendRequest = (await fetchRedis(
    'sismember',
    `user:${idToAdd}:incoming_friend_requests`,
    Session.user.id
  )) as 0 | 1;

  if (isAlreadyFriendRequest) return new Response('Friend request already sent', { status: 400 });

  const isAlreadyFriends = (await fetchRedis(
    'sismember',
    `user:${Session.user.id}:friends`,
    idToAdd
  )) as 0 | 1;

  if (isAlreadyFriends) return new Response('Already friends', { status: 400 });

  return true;
};
