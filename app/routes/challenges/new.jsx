import { useUser } from '@clerk/remix';
import { getAuth } from '@clerk/remix/ssr.server';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';

import styles from '~/styles/form.css';
import { getClient, q } from '../../utils/db.server';

export const links = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

const badRequest = (data) => json(data, { status: 400 });

const validateEmoji = (emoji) =>
  !emoji.trim() || /\P{Extended_Pictographic}/gu.test(emoji)
    ? 'Please enter only emoji'
    : undefined;

const validateTitle = (title) =>
  title && title.length > 1 ? undefined : 'Please enter a movie title';

export const action = async ({ request }) => {
  const form = await request.formData();
  const emoji = form.get('emoji');
  const title = form.get('title');

  if (typeof emoji !== 'string' || typeof title !== 'string') {
    return badRequest({
      formError: 'Form not submitted correctly.'
    });
  }

  const fieldErrors = {
    emoji: validateEmoji(emoji),
    title: validateTitle(title)
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors });
  }

  const { userId } = await getAuth(request);
  const client = await getClient(request);
  const data = {
    emoji,
    title,
    userId
  };

  const response = await client.query(q.Create('challenge', { data }));

  return redirect(`/challenges/${response.ref.value.id}`);
};

export default function NewRoute() {
  const { user } = useUser();
  const actionData = useActionData();

  return (
    <div>
      <h1>Create new challenge</h1>
      <address className="author">Submitted by {user?.username}</address>
      <Form method="post" autoComplete="off">
        <div className="form-field">
          <label htmlFor="emoji">Emoji</label>
          <input id="emoji" type="text" name="emoji" />
        </div>
        {actionData?.fieldErrors?.emoji ? (
          <p className="form-validation-error" role="alert" id="name-error">
            {actionData.fieldErrors.emoji}
          </p>
        ) : null}
        <div className="form-field">
          <label htmlFor="title">Movie</label>
          <input id="title" type="text" name="title" />
        </div>
        {actionData?.fieldErrors?.title ? (
          <p className="form-validation-error" role="alert" id="name-error">
            {actionData.fieldErrors.title}
          </p>
        ) : null}
        {actionData?.formError ? (
          <p className="form-validation-error" role="alert">
            {actionData.formError}
          </p>
        ) : null}
        <button className="submit-btn">Submit challenge</button>
      </Form>
    </div>
  );
}
