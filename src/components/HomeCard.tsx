import { Home } from "@/types/home";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface HomeCardProps {
  home: Home;
}

export function HomeCard({ home }: HomeCardProps) {
  const hasMultipleImages = home.additional_image_urls && home.additional_image_urls.length > 0;
  const allImages = [home.main_image_url, ...(home.additional_image_urls || [])];

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <div className="relative aspect-[4/3]">
        {hasMultipleImages ? (
          <Carousel className="w-full">
            <CarouselContent>
              {allImages.map((imageUrl, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[4/3]">
                    <img
                      src={imageUrl}
                      alt={`${home.title} - Image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <img
            src={home.main_image_url}
            alt={home.title}
            className="object-cover w-full h-full"
          />
        )}
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