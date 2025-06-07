
import React, { useState, useRef } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onSuccess: (path: string) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  currentImageUrl?: string;
  onRemove?: () => void;
}

const FileUploader = ({ 
  onSuccess, 
  onError, 
  accept = "image/*,video/*", 
  maxSize = 10,
  className = "",
  currentImageUrl,
  onRemove
}: FileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      const error = `File size must be less than ${maxSize}MB`;
      toast({
        variant: "destructive",
        title: "File too large",
        description: error,
      });
      if (onError) onError(error);
      return;
    }

    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (error) throw error;

      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully.",
      });

      onSuccess(data.path);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = 'Failed to upload file. Please try again.';
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: errorMessage,
      });
      if (onError) onError(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerUpload = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleUpload}
        accept={accept}
        className="absolute inset-0 opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      
      {currentImageUrl ? (
        <div className="relative inline-block">
          <img 
            src={currentImageUrl} 
            alt="Current upload" 
            className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
          />
          {onRemove && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={onRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            onClick={triggerUpload}
            className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            size="sm"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
        </div>
      ) : (
        <Button 
          onClick={triggerUpload}
          className="bg-softspot-500 hover:bg-softspot-600 text-white flex items-center gap-2 transition-colors"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      )}
    </div>
  );
};

export default FileUploader;
