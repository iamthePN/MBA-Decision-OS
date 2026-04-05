import { ContactForm } from "@/components/forms/contact-form";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="container-shell grid gap-8 py-12 lg:grid-cols-[0.9fr,1.1fr] lg:py-16">
      <div className="space-y-5">
        <p className="section-kicker">Contact</p>
        <h1 className="text-4xl font-semibold tracking-tight">Talk to the team behind the decision engine.</h1>
        <p className="text-lg text-muted-foreground">Use the contact form to request a walkthrough, ask about institution plans, or share data partnerships and pilot ideas.</p>
        <Card>
          <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">Response expectations</p>
              <p className="mt-2">Messages are saved to the admin dashboard immediately. Optional email delivery can be enabled later via environment variables.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Ideal for</p>
              <p className="mt-2">Students, counselors, institutions, data partners, and internal product teams tuning scoring logic.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <ContactForm />
    </div>
  );
}
