import { SignedIn, UserButton } from '@clerk/remix';
import { Link } from '@remix-run/react';

export default function Header() {
  return (
    <header>
      <span className="logo">Movie Emoji Quiz</span>
      <SignedIn>
        <div className="actions">
          <Link to="/challenges/new">Submit challenge</Link>
          <UserButton />
        </div>
      </SignedIn>
    </header>
  );
}
