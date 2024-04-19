import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export const getCurrentSession = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return new Response('Unauthorized', { status: 401 });

  return session;
};
