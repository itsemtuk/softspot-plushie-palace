
export interface ImageUploadResult {
  url?: string;
  success: boolean;
  error?: string;
}

export interface ImageEditorOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface PostCreationData {
  image: string;
  title: string;
  description?: string;
  location?: string;
  tags?: string[];
}

export interface PlushieItem {
  id: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  price?: number;
  forSale?: boolean;
  timestamp?: string;
  tags: string[];
}
