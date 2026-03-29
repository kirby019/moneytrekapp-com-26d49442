import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 max-w-3xl">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" />Back to Home</Link>
        </Button>
        <h1 className="font-heading text-3xl font-extrabold mb-6">Privacy Policy</h1>
        <div className="prose prose-sm text-muted-foreground space-y-4">
          <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          <p>MoneyTrek ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.</p>
          <h2 className="font-heading text-lg font-bold text-foreground">Information We Collect</h2>
          <p>We collect information you provide directly, including your email address, name, and financial data you enter (debts, payments, goals). We use Supabase for secure data storage with row-level security.</p>
          <h2 className="font-heading text-lg font-bold text-foreground">How We Use Your Information</h2>
          <p>Your data is used solely to provide the MoneyTrek service — tracking debts, recording payments, generating reports, and displaying your financial progress. We do not sell or share your personal data with third parties.</p>
          <h2 className="font-heading text-lg font-bold text-foreground">Data Security</h2>
          <p>We use industry-standard security measures including encrypted authentication and row-level security policies to protect your data.</p>
          <h2 className="font-heading text-lg font-bold text-foreground">Contact</h2>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:hello@moneytrek.app" className="text-accent hover:underline">hello@moneytrek.app</a>.</p>
        </div>
      </div>
    </div>
  );
}
