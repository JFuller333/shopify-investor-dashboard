import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Shield, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <nav className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-success" />
            <span className="text-xl font-semibold">InvestROI</span>
          </div>
          <Link href="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Invest Smarter with
            <span className="block text-success">Real-Time ROI Tracking</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Track your investment performance, discover high-potential projects, and
            make data-driven decisions with our professional investor dashboard.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth">
              <Button size="lg" className="min-w-[200px]">
                Start Investing
              </Button>
            </Link>
            <Link href="/donor-dashboard">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                View Demo
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Track ROI</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your investment returns in real-time with detailed analytics
              </p>
            </Card>

            <Card className="p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                <Target className="h-6 w-6 text-warning" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Smart Projects</h3>
              <p className="text-sm text-muted-foreground">
                Discover vetted investment opportunities with transparent metrics
              </p>
            </Card>

            <Card className="p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Secure Platform</h3>
              <p className="text-sm text-muted-foreground">
                Bank-level security to protect your investments and personal data
              </p>
            </Card>

            <Card className="p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
                <BarChart3 className="h-6 w-6 text-danger" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Deep Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive insights to help you make informed decisions
              </p>
            </Card>
          </div>
        </section>

        <section className="border-t bg-accent/20 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Start Investing?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
              Join thousands of investors who trust InvestROI to manage and grow their
              portfolios.
            </p>
            <Link href="/auth">
              <Button size="lg">Create Your Account</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 InvestROI. Professional investment tracking platform.</p>
        </div>
      </footer>
    </div>
  );
}
