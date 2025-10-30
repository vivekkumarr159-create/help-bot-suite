import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Clock, Send, User, Bot } from "lucide-react";
import { useState } from "react";

const TicketDetail = () => {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");

  // Mock data
  const ticket = {
    id,
    title: "Unable to login to my account",
    status: "in-progress",
    priority: "high",
    created: "2 hours ago",
  };

  const messages = [
    {
      id: "1",
      content: "I'm having trouble logging into my account. It keeps saying invalid credentials.",
      sender: "user",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      content: "I understand you're having trouble logging in. Have you tried resetting your password?",
      sender: "bot",
      timestamp: "2 hours ago",
    },
    {
      id: "3",
      content: "Yes, I tried that but didn't receive the reset email.",
      sender: "user",
      timestamp: "1 hour ago",
    },
    {
      id: "4",
      content: "Let me check your account settings. Please wait a moment while I investigate this issue.",
      sender: "bot",
      timestamp: "1 hour ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-secondary text-secondary-foreground";
      case "in-progress":
        return "bg-accent text-accent-foreground";
      case "resolved":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-muted text-muted-foreground";
      case "medium":
        return "bg-secondary text-secondary-foreground";
      case "high":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-8">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status.replace("-", " ")}
            </Badge>
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">{ticket.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Created {ticket.created}</span>
          </div>
        </div>

        <Card className="bg-card shadow-lg">
          <div className="space-y-6 p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <span className="block text-xs text-muted-foreground">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type your reply..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button className="gap-2 bg-gradient-primary hover:opacity-90">
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default TicketDetail;
