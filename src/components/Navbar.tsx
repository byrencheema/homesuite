import { Home, LogIn, LogOut, Settings, MessageSquare, Search } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="text-2xl font-semibold">
            home<span className="text-primary">suite</span>
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/browse")}
                className={`flex items-center space-x-2 ${
                  location.pathname === "/browse" ? "bg-primary/10" : ""
                }`}
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Browse</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/messages")}
                className={`flex items-center space-x-2 ${
                  location.pathname === "/messages" ? "bg-primary/10" : ""
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="hidden sm:inline">Messages</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/settings")}
                className={`flex items-center space-x-2 ${
                  location.pathname === "/settings" ? "bg-primary/10" : ""
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth")}
              className="flex items-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};