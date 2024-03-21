import { db } from '@/lib/db';

const Home = async () => {
  await db.set('hello', 'world');

  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
};

export default Home;
