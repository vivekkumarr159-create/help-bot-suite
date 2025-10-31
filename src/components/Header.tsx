import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Ticket } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">BookNow</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" className="gap-2">
              <Ticket className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/chat">
            <Button className="gap-2 bg-gradient-primary hover:opacity-90">
              <MessageSquare className="h-4 w-4" />
              New Booking
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
