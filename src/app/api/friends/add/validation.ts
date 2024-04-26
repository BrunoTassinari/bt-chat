import { redisHelper } from '@/helpers/redis';

export const validate = async (idUser: string, idToAdd: string) => {
  if (idUser === idToAdd) throw new Error('Cannot add yourself as a friend');

  const isAlreadyFriendRequest = (await redisHelper.getFriendRequest(idToAdd, idUser)) as 0 | 1;

  if (isAlreadyFriendRequest) throw new Error('Friend request already sent');

  const isAlreadyFriends = (await redisHelper.getFriend(idUser, idToAdd)) as 0 | 1;

  if (isAlreadyFriends) throw new Error('Already friends');

  return true;
};
