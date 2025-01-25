export interface Home {
  id: string;
  title: string;
  description: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  main_image_url: string;
  additional_image_urls: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface HomeLike {
  id: string;
  user_id: string;
  home_id: string;
  liked: boolean;
  created_at: string;
}