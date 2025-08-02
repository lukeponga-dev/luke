'use client';

import { useFormState } from 'react-dom';
import { login } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const initialState = {
  error: '',
};

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your password to manage the portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" name="password" required />
            </div>
            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
