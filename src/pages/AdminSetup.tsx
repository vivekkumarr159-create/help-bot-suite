import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShieldCheck, Loader2 } from "lucide-react";
import Header from "@/components/Header";

const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("setup-admin-users");

      if (error) throw error;

      setResults(data);
      toast.success("Admin and support users setup completed!");
    } catch (error: any) {
      console.error("[AdminSetup] Error:", error);
      toast.error("Setup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-8">
        <Card className="mx-auto max-w-2xl p-8">
          <div className="mb-6 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Admin Setup</h1>
          </div>

          <p className="mb-6 text-muted-foreground">
            Click the button below to create admin and support user accounts with predefined credentials.
          </p>

          <div className="mb-6 rounded-lg bg-muted p-4">
            <h2 className="mb-2 font-semibold text-foreground">Users to be created:</h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• admin101@gmail.com - Admin@101 (Admin)</li>
              <li>• admin102@gmail.com - Admin@102 (Admin)</li>
              <li>• admin103@gmail.com - Admin@103 (Admin)</li>
              <li>• support101@gmail.com - Support@101 (Support)</li>
              <li>• support102@gmail.com - Support@102 (Support)</li>
              <li>• support103@gmail.com - Support@103 (Support)</li>
            </ul>
          </div>

          <Button
            onClick={handleSetup}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up users...
              </>
            ) : (
              "Setup Admin & Support Users"
            )}
          </Button>

          {results && (
            <div className="mt-6 rounded-lg bg-secondary p-4">
              <h3 className="mb-3 font-semibold text-secondary-foreground">Setup Results:</h3>
              <div className="space-y-2 text-sm">
                {results.results?.map((result: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded border border-border p-2"
                  >
                    <span className="font-mono text-xs">{result.email}</span>
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        result.status === "created"
                          ? "bg-primary text-primary-foreground"
                          : result.status === "already_exists"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-destructive text-destructive-foreground"
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default AdminSetup;
