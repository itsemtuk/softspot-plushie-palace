
export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface ImageEditorOptions {
  brightness: number;
  contrast: number;
  saturation: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}
