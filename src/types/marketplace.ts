export interface PostCreationData {
  image: string;
  title: string;
  description?: string;
  tags?: string[];
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface ImageEditorOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface ExtendedPost {
  id: string;
  userId: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  description?: string;
  tags?: string[];
  timestamp: string;
}

// Add the Comment interface if it doesn't exist
export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  likes?: { userId: string; username: string }[];
}
