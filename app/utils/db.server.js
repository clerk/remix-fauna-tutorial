import { getAuth } from '@clerk/remix/ssr.server';
import faunadb from 'faunadb';

export const getClient = async (request) => {
  const { userId, getToken } = await getAuth(request);

  if (!userId) {
    return null;
  }

  try {
    const secret = await getToken({ template: 'fauna' });
    return new faunadb.Client({ secret });
  } catch (err) {
    throw err;
  }
};

export const q = faunadb.query;

export const getUserById = async (id) => {
  const response = await fetch(`https://api.clerk.dev/v1/users/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_API_KEY}`
    }
  });
  const user = await response.json();

  return user;
};
