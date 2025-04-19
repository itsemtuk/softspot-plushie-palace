export interface Plushie {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  rating: number;
  description: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
}

export interface Post {
  id: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags?: string[]; // Add tags property as optional
}

export interface UserProfile {
  id: string;
  username: string;
  profileImageUrl: string;
  bio: string;
  followers: number;
  following: number;
}
