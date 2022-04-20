import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import styles from '~/styles/form.css';
import { getClient, getUserById, q } from '../../utils/db.server';

export const links = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export const loader = async ({ params, request }) => {
  const client = await getClient(request);

  if (isNaN(params.id)) {
    throw new Response('Challenge not found', {
      status: 404
    });
  }

  const challenge = await client.query(q.Call('getChallengeById', params.id));

  if (!challenge) {
    throw new Response('Challenge not found', {
      status: 404
    });
  }

  const user = await getUserById(challenge.userId);
  const data = {
    ...challenge,
    username: user.username
  };

  return json(data);
};

export const action = async ({ params, request }) => {
  const form = await request.formData();
  const guess = form.get('guess');
  const client = await getClient(request);
  const challenge = await client.query(q.Call('getChallengeById', params.id));
  const isCorrect = guess.toLowerCase() === challenge.title.toLowerCase();

  return json({
    guessed: isCorrect ? 'correct' : 'incorrect',
    message: isCorrect ? 'Correct! ✅' : 'Incorrect! ❌',
    answer: challenge.title
  });
};

export default function EmojiRoute() {
  const { emoji, username } = useLoaderData();

  return (
    <div className="content">
      <span className="emoji">{emoji}</span>
      <address className="author">Submitted by {username}</address>
      <Form method="post" autoComplete="off">
        <label htmlFor="guess">What movie is this?</label>
        <input id="guess" type="text" name="guess" required />
        <button className="submit-btn">Submit guess</button>
      </Form>
    </div>
  );
}
