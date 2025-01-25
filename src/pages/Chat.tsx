import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Home } from "@/types/home";
import { Navbar } from "@/components/Navbar";

const Chat = () => {
  const { homeId } = useParams();
  const [home, setHome] = useState<Home | null>(null);

  useEffect(() => {
    const fetchHome = async () => {
      if (!homeId) return;
      const { data, error } = await supabase
        .from("homes")
        .select("*")
        .eq("id", homeId)
        .single();

      if (error) {
        console.error("Error fetching home:", error);
        return;
      }

      setHome(data);
    };

    fetchHome();
  }, [homeId]);

  if (!home) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-4">Chat about {home.title}</h1>
          <div className="h-[500px] bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-500 text-center mt-[200px]">
              Chat functionality coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;