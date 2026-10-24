import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function OnboardingPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-4 p-6 text-center">
        <h1 className="text-lg font-semibold">Welcome!</h1>
        <p className="text-muted-foreground text-sm">Your account has been created.</p>
        <Button asChild className="h-11 w-full">
          <Link to="/">Get started</Link>
        </Button>
      </Card>
    </main>
  );
}
