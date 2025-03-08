import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
export default function NotFound() {
  return (
    <Alert variant="destructive" className="mx-auto mt-10 max-w-2xl">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        This note doesn&apos;t exist or is not publicly available.
      </AlertDescription>
    </Alert>
  );
}
