import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, MessageSquare, Search } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  created: string;
  messages: number;
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Unable to login to my account",
    status: "in-progress",
    priority: "high",
    created: "2 hours ago",
    messages: 5,
  },
  {
    id: "2",
    title: "Payment processing issue",
    status: "open",
    priority: "high",
    created: "5 hours ago",
    messages: 2,
  },
  {
    id: "3",
    title: "Feature request: Dark mode",
    status: "open",
    priority: "low",
    created: "1 day ago",
    messages: 3,
  },
  {
    id: "4",
    title: "Bug in mobile app",
    status: "resolved",
    priority: "medium",
    created: "2 days ago",
    messages: 8,
  },
];

const Dashboard = () => {
  const [search, setSearch] = useState("");

  const filteredTickets = mockTickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return "bg-secondary text-secondary-foreground";
      case "in-progress":
        return "bg-accent text-accent-foreground";
      case "resolved":
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-muted text-muted-foreground";
      case "medium":
        return "bg-secondary text-secondary-foreground";
      case "high":
        return "bg-destructive text-destructive-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Your Tickets</h1>
          <p className="text-lg text-muted-foreground">
            Track and manage all your support tickets in one place
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredTickets.map((ticket) => (
            <Link key={ticket.id} to={`/ticket/${ticket.id}`}>
              <Card className="bg-gradient-card p-6 transition-all hover:shadow-lg hover:scale-[1.01]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace("-", " ")}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">
                      {ticket.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {ticket.created}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {ticket.messages} messages
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" className="shrink-0">
                    View Details
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">No tickets found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
