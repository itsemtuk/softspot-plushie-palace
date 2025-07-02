import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Upload, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase, createAuthenticatedSupabaseClient } from '@/integrations/supabase/client';
import { useUser, useAuth } from '@clerk/clerk-react';

interface ProfileHeaderCustomizationData {
  header_background_color: string;
  header_gradient_start?: string;
  header_gradient_end?: string;
  header_background_image?: string;
  header_text_color: string;
}

interface ProfileHeaderCustomizerProps {
  userId: string;
  onCustomizationChange: (customization: ProfileHeaderCustomizationData) => void;
  currentCustomization?: ProfileHeaderCustomizationData;
}

const predefinedGradients = [
  { name: 'Ocean', start: '#667eea', end: '#764ba2' },
  { name: 'Sunset', start: '#f093fb', end: '#f5576c' },
  { name: 'Forest', start: '#43e97b', end: '#38f9d7' },
  { name: 'Purple Dream', start: '#a8edea', end: '#fed6e3' },
  { name: 'Pink Bliss', start: '#d299c2', end: '#fef9d7' },
  { name: 'Blue Sky', start: '#89f7fe', end: '#66a6ff' },
  { name: 'Warm Sunset', start: '#fa709a', end: '#fee140' },
  { name: 'Cool Mint', start: '#a8e6cf', end: '#dcedc1' },
];

const predefinedColors = [
  '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6',
  '#ffeaa7', '#fdcb6e', '#e17055', '#d63031',
  '#74b9ff', '#0984e3', '#00b894', '#00cec9',
  '#a29bfe', '#6c5ce7', '#fd79a8', '#e84393',
];

export const ProfileHeaderCustomizer: React.FC<ProfileHeaderCustomizerProps> = ({
  userId,
  onCustomizationChange,
  currentCustomization
}) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [customization, setCustomization] = useState<ProfileHeaderCustomizationData>({
    header_background_color: '#ffffff',
    header_gradient_start: '',
    header_gradient_end: '',
    header_background_image: '',
    header_text_color: '#000000',
    ...currentCustomization
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentCustomization) {
      setCustomization(currentCustomization);
    }
  }, [currentCustomization]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image under 5MB."
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `header-bg-${userId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);
        
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);
        
      setCustomization(prev => ({
        ...prev,
        header_background_image: urlData.publicUrl
      }));
      
      toast({
        title: "Image uploaded",
        description: "Background image uploaded successfully!"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload image. Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const clerkToken = await getToken();
      if (!clerkToken) {
        throw new Error("Authentication required");
      }

      const authSupabase = createAuthenticatedSupabaseClient(clerkToken);
      
      const { error } = await authSupabase
        .from('profiles')
        .upsert({
          user_uuid: userId,
          ...customization,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      onCustomizationChange(customization);
      setIsOpen(false);
      
      toast({
        title: "Profile updated",
        description: "Your header customization has been saved!"
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Failed to save customization. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCustomization({
      header_background_color: '#ffffff',
      header_gradient_start: '',
      header_gradient_end: '',
      header_background_image: '',
      header_text_color: '#000000'
    });
  };

  const handleGradientSelect = (gradient: { start: string; end: string }) => {
    setCustomization(prev => ({
      ...prev,
      header_gradient_start: gradient.start,
      header_gradient_end: gradient.end,
      header_background_color: '' // Clear solid color when using gradient
    }));
  };

  const handleColorSelect = (color: string) => {
    setCustomization(prev => ({
      ...prev,
      header_background_color: color,
      header_gradient_start: '', // Clear gradient when using solid color
      header_gradient_end: ''
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          Customize Header
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Customize Profile Header</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="background" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="background">Background</TabsTrigger>
              <TabsTrigger value="gradients">Gradients</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>
            
            <TabsContent value="background" className="space-y-4 mt-4">
              <div>
                <Label className="text-base font-semibold">Solid Colors</Label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                        customization.header_background_color === color 
                          ? 'border-primary shadow-lg' 
                          : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="custom-bg-color" className="text-base font-semibold">Custom Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="custom-bg-color"
                    type="color"
                    value={customization.header_background_color}
                    onChange={(e) => handleColorSelect(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={customization.header_background_color}
                    onChange={(e) => handleColorSelect(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="text-color" className="text-base font-semibold">Text Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="text-color"
                    type="color"
                    value={customization.header_text_color}
                    onChange={(e) => setCustomization(prev => ({ ...prev, header_text_color: e.target.value }))}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={customization.header_text_color}
                    onChange={(e) => setCustomization(prev => ({ ...prev, header_text_color: e.target.value }))}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="gradients" className="space-y-4 mt-4">
              <div>
                <Label className="text-base font-semibold">Preset Gradients</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {predefinedGradients.map((gradient) => (
                    <button
                      key={gradient.name}
                      type="button"
                      onClick={() => handleGradientSelect(gradient)}
                      className={`h-16 rounded-lg border-2 transition-all hover:scale-105 ${
                        customization.header_gradient_start === gradient.start && 
                        customization.header_gradient_end === gradient.end
                          ? 'border-primary shadow-lg' 
                          : 'border-border'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${gradient.start}, ${gradient.end})`
                      }}
                    >
                      <span className="text-white font-medium text-sm drop-shadow-md">
                        {gradient.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gradient-start">Gradient Start</Label>
                  <Input
                    id="gradient-start"
                    type="color"
                    value={customization.header_gradient_start || '#667eea'}
                    onChange={(e) => setCustomization(prev => ({
                      ...prev,
                      header_gradient_start: e.target.value,
                      header_background_color: ''
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="gradient-end">Gradient End</Label>
                  <Input
                    id="gradient-end"
                    type="color"
                    value={customization.header_gradient_end || '#764ba2'}
                    onChange={(e) => setCustomization(prev => ({
                      ...prev,
                      header_gradient_end: e.target.value,
                      header_background_color: ''
                    }))}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="image" className="space-y-4 mt-4">
              <div>
                <Label className="text-base font-semibold">Background Image</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      {isUploading ? "Uploading..." : "Click to upload image"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max file size: 5MB
                    </p>
                  </label>
                </div>
                
                {customization.header_background_image && (
                  <div className="mt-4">
                    <img
                      src={customization.header_background_image}
                      alt="Header background preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomization(prev => ({ ...prev, header_background_image: '' }))}
                      className="mt-2"
                    >
                      Remove Image
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Preview and Actions - Fixed at bottom */}
        <div className="flex-shrink-0 border-t bg-background p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="h-20 rounded-lg flex items-center justify-center relative overflow-hidden"
                style={{
                  backgroundColor: customization.header_background_color || undefined,
                  backgroundImage: customization.header_gradient_start && customization.header_gradient_end 
                    ? `linear-gradient(135deg, ${customization.header_gradient_start}, ${customization.header_gradient_end})`
                    : customization.header_background_image
                      ? `url(${customization.header_background_image})`
                      : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: customization.header_text_color
                }}
              >
                {customization.header_background_image && (
                  <div className="absolute inset-0 bg-black/20" />
                )}
                <span className="relative font-semibold">Sample Header Text</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};