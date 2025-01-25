import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const listings = [
  {
    id: 1,
    image: "/placeholder.svg",
    title: "Modern Downtown Loft",
    price: "$599,000",
    location: "Downtown",
    beds: 2,
    baths: 2,
  },
  {
    id: 2,
    image: "/placeholder.svg",
    title: "Suburban Family Home",
    price: "$799,000",
    location: "Suburbs",
    beds: 4,
    baths: 3,
  },
  {
    id: 3,
    image: "/placeholder.svg",
    title: "Luxury Penthouse",
    price: "$1,299,000",
    location: "Waterfront",
    beds: 3,
    baths: 3,
  },
];

export const FeaturedListings = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Featured Homes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className="overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <div className="relative h-64">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-accent text-white">
                  {listing.price}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                <p className="text-gray-600 mb-4">{listing.location}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{listing.beds} beds</span>
                  <span>{listing.baths} baths</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};