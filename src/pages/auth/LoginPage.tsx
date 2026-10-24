import { AuthAPI } from '@/api/authAPI';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLoginError } from '@/hooks/useLoginError';

export default function LoginPage() {
  const loginError = useLoginError();

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold">Auth Service</h1>
          <p className="text-muted-foreground text-sm">Sign in to continue.</p>
        </div>

        {loginError && (
          <p
            role="alert"
            className="border-destructive/40 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
          >
            {loginError.message}
          </p>
        )}

        <Button asChild size="lg" className="h-12 w-full">
          <a href={AuthAPI.getGoogleSignInURL()}>Sign in with Google</a>
        </Button>
      </Card>
    </main>
  );
}
