import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Calendar, MessageSquare, LogOut, User, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdminOrSupport, setIsAdminOrSupport] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRole(session.user.id);
      } else {
        setIsAdminOrSupport(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId: string) => {
    try {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      const hasRole = roles?.some(r => r.role === "admin" || r.role === "support");
      setIsAdminOrSupport(hasRole || false);
    } catch (error) {
      console.error("[Header] Error checking role:", error);
      setIsAdminOrSupport(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 
            className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate("/")}
          >
            QuickBook
          </h1>
          <nav className="flex gap-2 items-center">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant={location.pathname === "/dashboard" ? "default" : "ghost"}
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Bookings
            </Button>
            <Button
              variant={location.pathname === "/chat" ? "default" : "ghost"}
              onClick={() => navigate("/chat")}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              New Booking
            </Button>
            
            {isAdminOrSupport && (
              <Button
                variant={location.pathname === "/support" ? "default" : "ghost"}
                onClick={() => navigate("/support")}
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                Support
              </Button>
            )}
            
            {user ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="gap-2"
                  size="sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                onClick={() => navigate("/auth")}
                className="gap-2 ml-2"
              >
                <User className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
