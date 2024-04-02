import { Session } from 'next-auth';
import { fetchRedis } from '@/helpers/redis';

export const addFriendValidatorRequest = async (idToAdd: string, Session: Session) => {
  if (idToAdd === Session.user.id) {
    throw new Error('Cannot add yourself');
  }

  const isAlreadyFriendRequest = (await fetchRedis(
    'sismember',
    `user:${idToAdd}:incoming_friend_requests`,
    Session.user.id
  )) as 0 | 1;

  if (isAlreadyFriendRequest) {
    throw new Error('Already sent request');
  }

  const isAlreadyFriends = (await fetchRedis(
    'sismember',
    `user:${Session.user.id}:friends`,
    idToAdd
  )) as 0 | 1;

  if (isAlreadyFriends) {
    throw new Error('Already friends with this user');
  }
};
