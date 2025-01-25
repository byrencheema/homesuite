import { Home } from "@/types/home";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface HomeCardProps {
  home: Home;
}

export function HomeCard({ home }: HomeCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <div className="relative aspect-[4/3]">
        <img
          src={home.main_image_url}
          alt={home.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-2">{home.title}</h3>
        <p className="text-xl font-bold text-primary mb-4">
          {formatPrice(home.price)}
        </p>
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <span>{home.bedrooms} beds</span>
          <span>{home.bathrooms} baths</span>
          <span>{home.square_feet} sqft</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {home.address}, {home.city}, {home.state} {home.zip_code}
        </p>
      </CardContent>
    </Card>
  );
}