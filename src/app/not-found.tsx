import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-16">
      <Card className="max-w-xl">
        <CardContent className="space-y-5 p-8 text-center">
          <p className="section-kicker">404</p>
          <h1 className="text-3xl font-semibold tracking-tight">This decision path does not exist.</h1>
          <p className="text-muted-foreground">
            The page may have moved, or the route may require authentication. Return to the home page and continue from there.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
