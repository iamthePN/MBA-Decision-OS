import { PublicHeader } from "@/components/layout/public-header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      <PublicHeader />
      <div className="container-shell flex min-h-[calc(100vh-88px)] items-center justify-center py-12">{children}</div>
    </div>
  );
}
