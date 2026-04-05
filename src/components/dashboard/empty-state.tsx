import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ title, body, ctaLabel, ctaHref }: { title: string; body: string; ctaLabel?: string; ctaHref?: string }) {
  return (
    <Card className="border-dashed bg-muted/20">
      <CardContent className="flex flex-col items-start gap-4 p-8">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{body}</p>
        </div>
        {ctaLabel && ctaHref ? (
          <a href={ctaHref}>
            <Button>{ctaLabel}</Button>
          </a>
        ) : null}
      </CardContent>
    </Card>
  );
}
