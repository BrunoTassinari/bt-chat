import { db } from '@/lib/db';

export const dbHelper = {
  async getUser(id: string) {
    return db.get(`user:${id}`);
  },
  async addFriend(idUser: string, idToAdd: string) {
    await db.sadd(`user:${idUser}:friends`, idToAdd);
    await db.sadd(`user:${idToAdd}:friends`, idUser);
  },
  async sendRequest(idUser: string, idToAdd: string) {
    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, idUser);
  },
  async removeFriendRequest(idUser: string, idToDeny: string) {
    await db.srem(`user:${idUser}:incoming_friend_requests`, idToDeny);
  },
  async sendMessage(chatId: string, timestamp: number, message: Message) {
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });
  },
};
