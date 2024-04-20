import { redisHelper } from '@/helpers/redis';

export const validate = async (idUser: string, idToAdd: string) => {
  if (idUser === idToAdd) return new Response('Cannot add yourself as a friend', { status: 400 });

  const isAlreadyFriendRequest = (await redisHelper.getFriendRequest(idToAdd, idUser)) as 0 | 1;

  if (isAlreadyFriendRequest) return new Response('Friend request already sent', { status: 400 });

  const isAlreadyFriends = (await redisHelper.getFriend(idUser, idToAdd)) as 0 | 1;

  if (isAlreadyFriends) return new Response('Already friends', { status: 400 });

  return true;
};
