import { json } from '@remix-run/node';
import {
  Form,
  useActionData,
  useCatch,
  useLoaderData,
  useTransition
} from '@remix-run/react';
import { useEffect, useRef } from 'react';

import { getClient, getUserById, q } from '~/utils/db.server';
import styles from '~/styles/challenge.css';

export const links = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return (
    <div className="error">
      <h1>
        {caught.status} - {caught.statusText}
      </h1>
      <p>{caught.data}</p>
    </div>
  );
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
    username: user.username || 'someone'
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
  const data = useActionData();
  const transition = useTransition();
  const ref = useRef();

  useEffect(() => {
    if (transition.type == 'normalLoad') {
      ref.current && ref.current.reset();
    }
  }, [transition]);

  return (
    <div>
      <span className="emoji">{emoji}</span>
      <address className="author">Submitted by {username}</address>
      <Form ref={ref} method="post" autoComplete="off">
        <label htmlFor="guess">What movie is this?</label>
        <input
          id="guess"
          type="text"
          name="guess"
          placeholder="Enter movie title..."
          required
        />
        {data?.guessed ? (
          <p className={`message message--${data.guessed}`}>{data.message}</p>
        ) : null}
        <button className="submit-btn">Submit guess</button>
        {data?.guessed === 'incorrect' ? (
          <div className="reveal">
            <button className="reveal-btn" type="button">
              Reveal answer
            </button>
            <span className="reveal-text">{data?.answer}</span>
          </div>
        ) : null}
      </Form>
    </div>
  );
}
