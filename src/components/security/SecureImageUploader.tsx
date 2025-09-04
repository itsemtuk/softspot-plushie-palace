import { useState, useCallback } from 'react';
import { sanitizeImageUrl } from '@/utils/security/domSanitizer';
import { contentLimits } from '@/config/security';
import { logSecurityEvent } from '@/utils/security/securityHeaders';
import { useUser } from '@clerk/clerk-react';

interface SecureImageUploaderProps {
  onUpload: (url: string) => void;
  onError?: (error: string) => void;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  className?: string;
}

export const SecureImageUploader = ({
  onUpload,
  onError,
  maxSizeBytes = contentLimits.maxFileSize,
  allowedTypes = [...contentLimits.allowedImageTypes],
  className
}: SecureImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();

  const validateFile = useCallback(async (file: File): Promise<string | null> => {
    // Size validation
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeBytes / (1024 * 1024)}MB limit`;
    }

    // Type validation
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }

    // Name validation (prevent path traversal)
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return 'Invalid file name';
    }

    // Enhanced security: Check for suspicious file patterns
    const suspiciousPatterns = [/\.php$/, /\.exe$/, /\.bat$/, /\.cmd$/, /\.scr$/, /\.js$/, /\.vbs$/, /\.asp$/, /\.jsp$/];
    if (suspiciousPatterns.some(pattern => pattern.test(file.name.toLowerCase()))) {
      return 'File name contains suspicious patterns';
    }

    // Magic number validation for image files
    try {
      const buffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);
      
      // Check magic numbers for common image types
      const magicNumbers = {
        'image/jpeg': [0xFF, 0xD8, 0xFF],
        'image/png': [0x89, 0x50, 0x4E, 0x47],
        'image/gif': [0x47, 0x49, 0x46],
        'image/webp': [0x52, 0x49, 0x46, 0x46] // RIFF header for WebP
      };

      const declaredType = file.type as keyof typeof magicNumbers;
      const expectedSignature = magicNumbers[declaredType];
      
      if (expectedSignature) {
        const actualSignature = Array.from(uint8Array.slice(0, expectedSignature.length));
        const isValidSignature = expectedSignature.every((byte, index) => byte === actualSignature[index]);
        
        if (!isValidSignature) {
          return 'File content does not match declared file type (potential security threat)';
        }
      }

      // Check for embedded scripts or suspicious content in first 1KB
      const firstKB = new TextDecoder().decode(uint8Array.slice(0, 1024));
      const scriptPatterns = [
        /<script/i,
        /javascript:/i,
        /vbscript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
      ];

      if (scriptPatterns.some(pattern => pattern.test(firstKB))) {
        return 'File contains potentially malicious content';
      }

    } catch (error) {
      console.error('File validation error:', error);
      return 'Failed to validate file content';
    }

    return null;
  }, [maxSizeBytes, allowedTypes]);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Validate file
      const validationError = await validateFile(file);
      if (validationError) {
        onError?.(validationError);
        logSecurityEvent('FILE_VALIDATION_FAILED', {
          userId: user?.id,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          error: validationError
        });
        return;
      }

      // Create secure blob URL
      const blobUrl = URL.createObjectURL(file);
      const sanitizedUrl = sanitizeImageUrl(blobUrl);

      // Log successful upload
      logSecurityEvent('FILE_UPLOAD_SUCCESS', {
        userId: user?.id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      onUpload(sanitizedUrl);

      // Clean up blob URL after some time
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 60000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onError?.(errorMessage);
      
      logSecurityEvent('FILE_UPLOAD_ERROR', {
        userId: user?.id,
        fileName: file.name,
        error: errorMessage
      });
    } finally {
      setIsUploading(false);
      // Clear the input
      event.target.value = '';
    }
  }, [validateFile, onUpload, onError, user]);

  return (
    <div className={className}>
      <input
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
        id="secure-file-input"
      />
      <label 
        htmlFor="secure-file-input"
        className={`
          inline-flex items-center justify-center px-4 py-2 border border-gray-300 
          rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white 
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-primary cursor-pointer
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isUploading ? 'Uploading...' : 'Select Image'}
      </label>
    </div>
  );
};