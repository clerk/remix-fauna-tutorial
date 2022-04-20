import { SignIn } from '@clerk/remix';
import { getAuth } from '@clerk/remix/ssr.server';
import { redirect } from '@remix-run/node';
import { getClient, q } from '../utils/db.server';
import styles from '~/styles/index.css';
import Header from '../components/header';

export const links = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export const loader = async ({ request }) => {
  const { userId } = await getAuth(request);

  if (!userId) {
    return null;
  }

  const client = await getClient(request);
  const firstId = await client.query(
    q.Select(['ref', 'id'], q.Get(q.Documents(q.Collection('challenge'))))
  );

  return redirect(`/challenges/${firstId}`);
};

export default function Index() {
  return (
    <div>
      <Header />
      <main>
        <div className="content">
          <SignIn />
        </div>
      </main>
    </div>
  );
}
