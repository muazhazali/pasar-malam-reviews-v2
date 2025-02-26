import { useAuth } from '@/contexts/AuthContext';

export function SignInButton() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return user ? (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="h-8 w-8 rounded-full"
          />
        )}
        <span className="text-sm font-medium">{user.displayName}</span>
      </div>
      <button
        onClick={() => signOut()}
        className="rounded-md bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/80"
      >
        Sign Out
      </button>
    </div>
  ) : (
    <button
      onClick={() => signInWithGoogle()}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
    >
      Sign In with Google
    </button>
  );
} 