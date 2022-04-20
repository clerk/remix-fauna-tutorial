import { NavLink } from '@remix-run/react';

export default function Sidebar({ data }) {
  return (
    <aside>
      <h2>Guess these movies...</h2>
      <ul>
        {data?.map((movie) => (
          <li key={movie.id}>
            <NavLink to={`/challenges/${movie.id}`}>{movie.emoji}</NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
