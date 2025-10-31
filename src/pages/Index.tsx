import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Zap, Shield, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Support</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
              Support Tickets, Simplified with AI
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Book museums, libraries, sports facilities, movie theaters, and events. Get instant 
              confirmation with beautiful tickets and QR codes for seamless entry.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/chat">
                <Button size="lg" className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow">
                  <MessageSquare className="h-5 w-5" />
                  Create Booking
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Why Choose TicketBot?
          </h2>
          <p className="text-lg text-muted-foreground">
            Revolutionize your support workflow with intelligent automation
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-card p-6 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Natural Conversations
            </h3>
            <p className="text-muted-foreground">
              Describe your issue in plain language. No forms, no hassle. Just chat naturally.
            </p>
          </Card>

          <Card className="bg-gradient-card p-6 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Instant Response
            </h3>
            <p className="text-muted-foreground">
              Get immediate acknowledgment and AI-assisted solutions without waiting in queue.
            </p>
          </Card>

          <Card className="bg-gradient-card p-6 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Smart Categorization
            </h3>
            <p className="text-muted-foreground">
              AI automatically categorizes and prioritizes your tickets for efficient handling.
            </p>
          </Card>

          <Card className="bg-gradient-card p-6 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <Clock className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              24/7 Availability
            </h3>
            <p className="text-muted-foreground">
              Create and track tickets anytime, anywhere. Our AI assistant never sleeps.
            </p>
          </Card>

          <Card className="bg-gradient-card p-6 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Real-time Updates
            </h3>
            <p className="text-muted-foreground">
              Stay informed with instant notifications about your ticket status and responses.
            </p>
          </Card>

          <Card className="bg-gradient-card p-6 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Easy Management
            </h3>
            <p className="text-muted-foreground">
              Track all your tickets in one dashboard with search and filter capabilities.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-primary p-12 text-center shadow-glow">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Transform Your Support?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90">
              Join thousands of users already experiencing faster, smarter support.
            </p>
            <Link to="/chat">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 shadow-lg hover:scale-105 transition-transform"
              >
                <MessageSquare className="h-5 w-5" />
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
