const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = 'zrange' | 'sismember' | 'get' | 'smembers';

async function redis(command: Command, ...args: (string | number)[]) {
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`;

  console.log(commandUrl);

  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`Error executing Redis command: ${response.statusText}`);

  const data = await response.json();
  return data.result;
}

export const redisHelper = {
  async getUser(idUser: string) {
    return redis('get', `user:${idUser}`);
  },
  async getUserByEmail(email: string) {
    return redis('get', `user:email:${email}`);
  },
  async getUserFriendsRequests(idUser: string) {
    return redis('smembers', `user:${idUser}:incoming_friend_requests`);
  },
  async getUserFriendsIds(idUser: string) {
    return redis('smembers', `user:${idUser}:friends`);
  },
  async getUserFriends(idUser: string) {
    const friendIds = (await redis('smembers', `user:${idUser}:friends`)) as string[];
    const friends = await Promise.all(
      friendIds.map(async (id) => {
        const friend = (await this.getUser(id)) as string;
        const parsedFriend = JSON.parse(friend) as User;

        return parsedFriend;
      })
    );

    return friends;
  },
  async getFriendRequest(idUser: string, idSearch: string = '') {
    return redis('sismember', `user:${idUser}:incoming_friend_requests`, idSearch);
  },
  async getFriend(idUser: string, idSearch: string = '') {
    return redis('sismember', `user:${idUser}:friends`, idSearch);
  },
  async getChatMessages(chatId: string) {
    return redis('zrange', `chat:${chatId}:messages`, 0, -1);
  },
};
