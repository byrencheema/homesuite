import { ScrollArea } from "@/components/ui/scroll-area";
import { Home } from "@/types/home";
import { cn } from "@/lib/utils";

interface MatchesSidebarProps {
  matches: Home[];
  selectedHome: Home | null;
  onSelectHome: (home: Home) => void;
  isLoading: boolean;
}

export function MatchesSidebar({ 
  matches, 
  selectedHome, 
  onSelectHome,
  isLoading 
}: MatchesSidebarProps) {
  return (
    <div className="w-80 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No matches yet. Start browsing to find your perfect home!
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {matches.map((home) => (
              <button
                key={home.id}
                onClick={() => onSelectHome(home)}
                className={cn(
                  "w-full p-2 rounded-lg transition-all duration-200",
                  selectedHome?.id === home.id
                    ? "bg-primary/10"
                    : "hover:bg-gray-100"
                )}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={home.main_image_url}
                    alt={home.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="font-medium truncate">{home.title}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {home.city}, {home.state}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}