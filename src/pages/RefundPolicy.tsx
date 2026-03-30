import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 max-w-3xl">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" />Back to Home</Link>
        </Button>
        <h1 className="font-heading text-3xl font-extrabold mb-6">Refund Policy</h1>
        <div className="prose prose-sm text-muted-foreground space-y-4">
          <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

          <h2 className="font-heading text-lg font-bold text-foreground">30-Day Money-Back Guarantee</h2>
          <p>We want you to be completely satisfied with MoneyTrek Pro. If you're not happy with your subscription for any reason, you can request a full refund within 30 days of your initial purchase — no questions asked.</p>

          <h2 className="font-heading text-lg font-bold text-foreground">How to Request a Refund</h2>
          <p>To request a refund, simply email us at <a href="mailto:hello@moneytrek.app" className="text-accent hover:underline">hello@moneytrek.app</a> with your account email address. We'll process your refund within 5–10 business days.</p>

          <h2 className="font-heading text-lg font-bold text-foreground">After the 30-Day Period</h2>
          <p>Refunds are not available after the initial 30-day window. However, you can cancel your subscription at any time from your account settings. Your Pro access will remain active until the end of your current billing period.</p>

          <h2 className="font-heading text-lg font-bold text-foreground">Free Trial</h2>
          <p>If you signed up for a free trial and did not subscribe, you will not be charged and no refund is necessary. If your trial converted to a paid subscription, the 30-day refund policy applies from the date of your first payment.</p>

          <h2 className="font-heading text-lg font-bold text-foreground">Contact</h2>
          <p>Questions about refunds? Reach out to us at <a href="mailto:hello@moneytrek.app" className="text-accent hover:underline">hello@moneytrek.app</a> and we'll be happy to help.</p>
        </div>
      </div>
    </div>
  );
}
