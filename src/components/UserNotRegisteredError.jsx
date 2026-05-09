export default function UserNotRegisteredError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Access Restricted</h1>
        <p className="mt-3 text-muted-foreground">
          You are not registered to use this application. Please contact the app administrator to request access.
        </p>
        <div className="mt-6 text-left text-sm text-muted-foreground">
          <p className="font-medium text-foreground">If you believe this is an error, you can:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Verify you are logged in with the correct account.</li>
            <li>Contact the app administrator for access.</li>
            <li>Try logging out and back in again.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
