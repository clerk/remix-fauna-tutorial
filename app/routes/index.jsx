import { SignIn } from '@clerk/remix';
import { redirect } from '@remix-run/node';

import { Header } from '~/components';
import { getClient, q } from '~/utils/db.server';
import styles from '~/styles/index.css';

export const links = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export const loader = async ({ request }) => {
  const client = await getClient(request);

  if (!client) {
    return null;
  }

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
