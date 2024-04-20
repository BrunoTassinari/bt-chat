import { redisHelper } from '@/helpers/redis';

export const validate = async (idUser: string, idToAdd: string) => {
  const isAlreadyFriend = await redisHelper.getFriend(idUser, idToAdd);

  if (isAlreadyFriend) return new Response('Already friends', { status: 400 });

  const hasFriendRequest = await redisHelper.getFriendRequest(idUser, idToAdd);

  if (!hasFriendRequest) return new Response('Friend request not found', { status: 404 });

  return true;
};
