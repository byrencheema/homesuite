import { Navbar } from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";

const Settings = () => {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Account Information</h2>
            <p className="text-gray-600">Email: {session.user.email}</p>
          </div>
          <p className="text-gray-500 text-sm">More settings coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;