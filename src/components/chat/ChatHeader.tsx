import { Home } from "@/types/home";

interface ChatHeaderProps {
  home: Home;
  children?: React.ReactNode;
}

export function ChatHeader({ home, children }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={home.main_image_url}
            alt={home.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h2 className="font-semibold">{home.title}</h2>
            <p className="text-sm text-gray-500">
              {home.city}, {home.state}
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}