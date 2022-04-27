import { SignIn } from '@clerk/remix';
import { redirect } from '@remix-run/node';

import { Header } from '~/components';
import { getClient, q } from '~/utils/db.server';
import styles from '~/styles/index.css';
import { useCatch } from '@remix-run/react';

export const links = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return (
    <Index>
      <div className="error">
        <h1>
          {caught.status} - {caught.statusText}
        </h1>
        <p>{caught.data}</p>
      </div>
    </Index>
  );
};

export const loader = async ({ request }) => {
  try {
    const client = await getClient(request);

    if (!client) {
      return null;
    }

    const firstId = await client.query(
      q.Select(['ref', 'id'], q.Get(q.Documents(q.Collection('challenge'))))
    );

    return redirect(`/challenges/${firstId}`);
  } catch (err) {
    throw new Response('Challenges not found', {
      status: 404
    });
  }
};

export default function Index({ children }) {
  return (
    <div>
      <Header />
      <main>
        <div className="content">{children || <SignIn />}</div>
      </main>
    </div>
  );
}
