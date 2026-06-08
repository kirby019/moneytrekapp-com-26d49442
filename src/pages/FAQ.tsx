import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "What is MoneyTrek?",
    a: "MoneyTrek is a personal finance web app that helps you track debt, savings, net worth, and financial goals. It combines debt payoff strategies, savings tracking, net worth snapshots, what-if calculators, streaks, and milestone badges in one place — so you can see your full financial picture and stay motivated on your journey to financial freedom."
  },
  {
    q: "Is MoneyTrek free?",
    a: "Yes. MoneyTrek has a free plan that is free forever and includes core debt tracking, savings tracking, financial goals, net worth snapshots, payment history, streaks, and milestones. The Pro plan adds advanced analytics, multi-currency support, automated weekly reports, and CSV data export. When you sign up, you automatically get a 7-day free Pro trial — no credit card required."
  },
  {
    q: "Do I need a credit card to sign up?",
    a: "No credit card is required to sign up. You get a 7-day free Pro trial automatically when you create an account. After 7 days, you stay on the free plan unless you choose to upgrade to Pro."
  },
  {
    q: "Can I use MoneyTrek if I have no debt?",
    a: "Absolutely. While MoneyTrek started as a debt tracker, it has grown into a full personal finance app. You can use it to track savings accounts, set financial goals, monitor your net worth, and plan investments — even if you have zero debt."
  },
  {
    q: "What is the debt snowball method?",
    a: "The debt snowball method is a debt payoff strategy where you pay off your smallest debt balance first while making minimum payments on all other debts. Once the smallest debt is paid off, you roll that payment amount toward the next-smallest debt. This creates a 'snowball' of growing payments. The snowball method is popular because paying off debts quickly provides psychological wins that keep you motivated."
  },
  {
    q: "What is the debt avalanche method?",
    a: "The debt avalanche method is a debt payoff strategy where you pay off the debt with the highest interest rate first while making minimum payments on all others. This approach minimizes the total interest you pay over time, making it the mathematically optimal strategy. MoneyTrek supports both the snowball and avalanche strategies in its debt payoff strategy screen."
  },
  {
    q: "How does the What-If Calculator work?",
    a: "The What-If Calculator on the Future Screen lets you model two scenarios. The Extra Payment Calculator shows what happens if you pay a specific extra amount each month — for example, 'What if I paid $100 extra per month?' MoneyTrek will show you how many months faster you'd be debt-free and how much interest you'd save. The Investment Projector shows how a monthly investment could grow at a chosen annual return rate over 5, 10, 20, or 30 years."
  },
  {
    q: "What currencies does MoneyTrek support?",
    a: "Pro users can track finances in any currency, with automatic exchange rate conversion powered by live exchange rates. Free users track in a single default currency. MoneyTrek is popular with users in the Philippines (PHP), Singapore (SGD), Australia (AUD), the United States (USD), and many other countries."
  },
  {
    q: "What is net worth and how does MoneyTrek track it?",
    a: "Net worth is your total assets minus your total liabilities. For example, if you have $5,000 in savings and $12,000 in debt, your net worth is -$7,000. As you pay down debt and grow savings, your net worth increases. MoneyTrek calculates your live net worth from your savings accounts and active debts, and lets you save dated snapshots so you can track your net worth over time."
  },
  {
    q: "Is my financial data secure?",
    a: "Yes. MoneyTrek uses Supabase as its backend, with row-level security ensuring that each user can only access their own data. Authentication is encrypted. Payments are processed by LemonSqueezy, a trusted payment provider. MoneyTrek does not share your financial data with third parties."
  },
  {
    q: "How do streaks and milestones work?",
    a: "A streak tracks how many consecutive time periods (weeks or months) you have recorded at least one payment. Keeping your streak alive builds the habit of consistent payments. Milestones are badges you earn for reaching specific achievements — such as making your first payment, paying off your first debt, or reaching a net worth milestone. Both streaks and milestones are designed to keep you motivated throughout your debt-free journey."
  },
  {
    q: "Can I export my data?",
    a: "Yes. Pro users can export their debt and payment data as CSV files at any time. This lets you keep a personal backup or analyze your data in a spreadsheet."
  },
  {
    q: "What is Founding Member pricing?",
    a: "Founding Member pricing is a special discounted rate available to early MoneyTrek users. Founding Members lock in their rate permanently — meaning the price never increases for them, even as MoneyTrek adds more features over time. This offer is limited to early adopters."
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a
    }
  }))
};

export default function FAQ() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-schema";
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    document.title = "MoneyTrek FAQ — Common Questions About Features, Pricing & Security";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Answers to the most common questions about MoneyTrek — a personal finance app for tracking debt, savings, net worth, and financial goals. Free plan available, no credit card required.");

    return () => {
      const el = document.getElementById("faq-schema");
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            MoneyTrek
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild><Link to="/login">Log in</Link></Button>
            <Button size="sm" asChild><Link to="/signup">Start Free</Link></Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-b from-primary/5 to-background border-b border-border py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-3">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to know about MoneyTrek — features, pricing, security, and how it works.
          </p>
        </div>
      </div>

      {/* FAQ List */}
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group border border-border rounded-xl bg-card overflow-hidden"
          >
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-muted/40 transition-colors">
              <h2 className="font-semibold text-base pr-4">{faq.q}</h2>
              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-6 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border">
              {faq.a}
            </div>
          </details>
        ))}
      </main>

      {/* CTA */}
      <div className="border-t border-border bg-card py-12 px-4 text-center">
        <h2 className="font-heading text-2xl font-bold mb-2">Ready to take control of your finances?</h2>
        <p className="text-muted-foreground mb-6">Start free — no credit card needed. Get 7 days of Pro access automatically.</p>
        <Button size="lg" asChild>
          <Link to="/signup">
            Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Have more questions? <a href="mailto:support@moneytrekapp.com" className="underline">Contact us</a>
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/features" className="hover:text-foreground">Features</Link>
          <Link to="/how-it-works" className="hover:text-foreground">How It Works</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/refund-policy" className="hover:text-foreground">Refund Policy</Link>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} MoneyTrek. All rights reserved.</p>
      </footer>
    </div>
  );
}
