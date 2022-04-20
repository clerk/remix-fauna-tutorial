import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import Header from '../components/header';
import Sidebar from '../components/sidebar';
import styles from '~/styles/index.css';
import { getClient, q } from '../utils/db.server';

export const links = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export const loader = async ({ request }) => {
  const client = await getClient(request);
  const response = await client.query(q.Call('getChallenges'));

  return json(response);
};

export default function Movies() {
  const { data } = useLoaderData();

  return (
    <div>
      <Header />
      <main>
        <Sidebar data={data} />
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
