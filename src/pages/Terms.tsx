import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 max-w-3xl">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" />Back to Home</Link>
        </Button>
        <h1 className="font-heading text-3xl font-extrabold mb-6">Terms of Service</h1>
        <div className="prose prose-sm text-muted-foreground space-y-4">
          <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          <p>Welcome to MoneyTrek. By using our service, you agree to these Terms of Service.</p>
          <h2 className="font-heading text-lg font-bold text-foreground">Use of Service</h2>
          <p>MoneyTrek is a financial progress tracking tool. You are responsible for the accuracy of data you enter. MoneyTrek is not a financial advisor and does not provide financial advice.</p>
          <h2 className="font-heading text-lg font-bold text-foreground">Accounts</h2>
          <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials.</p>
          <h2 className="font-heading text-lg font-bold text-foreground">Subscriptions</h2>
          <p>Some features require a Pro subscription. Subscription details and pricing are displayed on the Subscription page within the app.</p>
          <h2 className="font-heading text-lg font-bold text-foreground">Limitation of Liability</h2>
          <p>MoneyTrek is provided "as is" without warranties. We are not liable for any financial decisions you make based on information displayed in the app.</p>
          <h2 className="font-heading text-lg font-bold text-foreground">Contact</h2>
          <p>Questions about these terms? Contact us at <a href="mailto:hello@moneytrek.app" className="text-accent hover:underline">hello@moneytrek.app</a>.</p>
        </div>
      </div>
    </div>
  );
}
