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
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <h1 
            className="text-lg sm:text-xl md:text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate("/")}
          >
            QuickBook
          </h1>
          <nav className="flex gap-1 sm:gap-2 items-center flex-wrap">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              onClick={() => navigate("/")}
              className="gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-4"
              size="sm"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            <Button
              variant={location.pathname === "/dashboard" ? "default" : "ghost"}
              onClick={() => navigate("/dashboard")}
              className="gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-4"
              size="sm"
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Bookings</span>
            </Button>
            <Button
              variant={location.pathname === "/chat" ? "default" : "ghost"}
              onClick={() => navigate("/chat")}
              className="gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-4"
              size="sm"
            >
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
            
            {isAdminOrSupport && (
              <Button
                variant={location.pathname === "/support" ? "default" : "ghost"}
                onClick={() => navigate("/support")}
                className="gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-4"
                size="sm"
              >
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Support</span>
              </Button>
            )}
            
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2 pl-1 sm:pl-2 border-l">
                <div className="hidden lg:flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-3"
                  size="sm"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                onClick={() => navigate("/auth")}
                className="gap-1 sm:gap-2 ml-1 sm:ml-2 h-8 sm:h-10 px-2 sm:px-4"
                size="sm"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
