
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlushieAvatarSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PlushieAvatarSelector = ({ value, onChange }: PlushieAvatarSelectorProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(value);
  const [customUrl, setCustomUrl] = useState<string>(value?.startsWith("/assets") ? "" : value || "");
  const [plushieAvatars, setPlushieAvatars] = useState<string[]>([]);
  const [kaiAvatars, setKaiAvatars] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  
  // Get all avatars and separate them into plushie and kai categories
  useEffect(() => {
    const plushies = [
      '/assets/avatars/PLUSH_Bear.PNG',
      '/assets/avatars/PLUSH_Bunny.PNG',
      '/assets/avatars/PLUSH_Cat.PNG',
      '/assets/avatars/PLUSH_Dog.PNG',
      '/assets/avatars/PLUSH_Panda.PNG',
      '/assets/avatars/PLUSH_Penguin.PNG',
      '/assets/avatars/PLUSH_Unicorn.PNG',
    ];
    
    const kai = [
      '/assets/avatars/Kai.PNG',
      '/assets/avatars/Kai-Happy.PNG',
      '/assets/avatars/Kai-Hello.PNG',
      '/assets/avatars/Kai-Love.PNG',
      '/assets/avatars/Kai-Sad.PNG',
      '/assets/avatars/Kai-Sus.PNG',
    ];
    
    setPlushieAvatars(plushies);
    setKaiAvatars(kai);
  }, []);
  
  const handleSelectAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
    setCustomUrl("");
    onChange(avatar);
  };
  
  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(e.target.value);
    if (e.target.value) {
      setSelectedAvatar(e.target.value);
      onChange(e.target.value);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result.toString();
          setSelectedAvatar(imageUrl);
          setCustomUrl("");
          onChange(imageUrl);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
      // Reset the input so the same file can be selected again
      setFileInputKey(prev => prev + 1);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Avatar Preview Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-softspot-100">
              <AvatarImage 
                src={selectedAvatar} 
                alt="Preview" 
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/150";
                }}
              />
              <AvatarFallback>🧸</AvatarFallback>
            </Avatar>
            <Button 
              type="button"
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 rounded-full bg-white w-8 h-8 p-0"
              onClick={() => document.getElementById("avatar-upload")?.click()}
            >
              <Camera className="h-4 w-4" />
              <input
                id="avatar-upload"
                key={fileInputKey}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Button>
          </div>
          
          <div className="space-y-2 flex-1">
            <h3 className="text-base font-medium">Your Avatar</h3>
            <p className="text-sm text-gray-500">This image will be shown on your profile and comments</p>
            
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Custom Avatar URL</h4>
              <Input
                placeholder="Enter a URL for a custom avatar"
                value={customUrl}
                onChange={handleCustomUrlChange}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">
                Enter a URL for a custom avatar or select a plushie avatar below.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Plushie Avatars Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Plushie Avatars</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {plushieAvatars.map((avatar, index) => (
            <div 
              key={`plushie-${index}`}
              onClick={() => handleSelectAvatar(avatar)}
              className={`relative cursor-pointer transition-all ${
                selectedAvatar === avatar 
                  ? 'ring-2 ring-offset-2 ring-softspot-500 scale-105' 
                  : 'hover:opacity-80'
              }`}
            >
              <Card className="overflow-hidden">
                <AspectRatio ratio={1 / 1}>
                  <img 
                    src={avatar} 
                    alt={`Plushie avatar ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = "https://via.placeholder.com/150";
                    }}
                  />
                </AspectRatio>
              </Card>
              
              {selectedAvatar === avatar && (
                <div className="absolute bottom-1 right-1 bg-softspot-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Kai Avatars Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Kai Avatars</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {kaiAvatars.map((avatar, index) => (
            <div 
              key={`kai-${index}`}
              onClick={() => handleSelectAvatar(avatar)}
              className={`relative cursor-pointer transition-all ${
                selectedAvatar === avatar 
                  ? 'ring-2 ring-offset-2 ring-softspot-500 scale-105' 
                  : 'hover:opacity-80'
              }`}
            >
              <Card className="overflow-hidden">
                <AspectRatio ratio={1 / 1}>
                  <img 
                    src={avatar} 
                    alt={`Kai avatar ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = "https://via.placeholder.com/150";
                    }}
                  />
                </AspectRatio>
              </Card>
              
              {selectedAvatar === avatar && (
                <div className="absolute bottom-1 right-1 bg-softspot-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
