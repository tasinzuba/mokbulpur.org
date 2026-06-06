import { Container } from "./Container";
import { Construction } from "lucide-react";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-muted-bg text-muted">
          <Construction className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
    </Container>
  );
}
