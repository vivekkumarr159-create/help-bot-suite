import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Zap, Shield, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        {/* Animated background text */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <div className="absolute top-1/4 whitespace-nowrap animate-slide-text">
            <span className="text-6xl font-bold text-primary">
              SECURED TICKET BOOKING SYSTEM • VERIFIED & PROTECTED • QR CODE AUTHENTICATION • 
            </span>
          </div>
          <div className="absolute top-1/2 whitespace-nowrap animate-slide-text" style={{ animationDelay: '-5s' }}>
            <span className="text-6xl font-bold text-secondary">
              INSTANT CONFIRMATION • SAFE & RELIABLE • 24/7 SECURE BOOKING • 
            </span>
          </div>
          <div className="absolute top-3/4 whitespace-nowrap animate-slide-text" style={{ animationDelay: '-10s' }}>
            <span className="text-6xl font-bold text-accent">
              ENCRYPTED TRANSACTIONS • TRUSTED PLATFORM • DIGITAL TICKETS • 
            </span>
          </div>
        </div>

        {/* Floating security badges */}
        <div className="absolute top-20 left-10 animate-float opacity-10">
          <Shield className="h-32 w-32 text-primary" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float opacity-10" style={{ animationDelay: '-2s' }}>
          <Shield className="h-32 w-32 text-secondary" />
        </div>

        <div className="container px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 animate-pulse-glow">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Secured AI-Powered Booking</span>
            </div>
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground px-4">
              Support Tickets, Simplified with AI
            </h1>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl text-muted-foreground px-4">
              Book museums, libraries, sports facilities, movie theaters, and events. Get instant 
              confirmation with beautiful tickets and QR codes for seamless entry.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-4">
              <Link to="/chat" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-primary hover:opacity-90 shadow-glow">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                  Create Booking
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse-glow"></div>
        <div className="absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-secondary/20 blur-3xl animate-pulse-glow" style={{ animationDelay: '-1.5s' }}></div>
      </section>

      {/* Features Section */}
      <section className="container px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground px-4">
            Why Choose TicketBot?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            Revolutionize your support workflow with intelligent automation
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      <section className="bg-gradient-hero py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-primary p-6 sm:p-8 md:p-12 text-center shadow-glow">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Transform Your Support?
            </h2>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-primary-foreground/90">
              Join thousands of users already experiencing faster, smarter support.
            </p>
            <Link to="/chat" className="inline-block w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto gap-2 shadow-lg hover:scale-105 transition-transform"
              >
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
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
