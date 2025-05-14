
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PlushieAvatarSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PlushieAvatarSelector = ({ value, onChange }: PlushieAvatarSelectorProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(value);
  const [plushieAvatars, setPlushieAvatars] = useState<string[]>([]);
  const [kaiAvatars, setKaiAvatars] = useState<string[]>([]);
  
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
    onChange(avatar);
  };
  
  return (
    <div className="space-y-6">
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
