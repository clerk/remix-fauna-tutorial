import { rootAuthLoader } from '@clerk/remix/ssr.server';
import { ClerkApp, ClerkCatchBoundary } from '@clerk/remix';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react';

export const meta = () => ({
  charset: 'utf-8',
  title: 'Movie Emoji Quiz',
  viewport: 'width=device-width,initial-scale=1'
});

export const loader = (args) => rootAuthLoader(args);

export const CatchBoundary = ClerkCatchBoundary();

function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default ClerkApp(App);
