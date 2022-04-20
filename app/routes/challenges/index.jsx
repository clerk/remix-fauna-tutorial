import { redirect } from '@remix-run/node';
import { getClient, q } from '../../utils/db.server';

export const loader = async ({ request }) => {
  const client = await getClient(request);
  const firstId = await client.query(
    q.Select(['ref', 'id'], q.Get(q.Documents(q.Collection('challenge'))))
  );
  return redirect(`/challenges/${firstId}`);
};

export default function Index() {
  return null;
}
