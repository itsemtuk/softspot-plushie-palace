
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Redo } from 'lucide-react';

interface AvatarOption {
  id: string;
  src: string;
  bgColor: string;
}

const defaultAvatars: AvatarOption[] = [
  // Plushie avatars
  { id: 'bear', src: '/assets/avatars/bear-avatar.png', bgColor: 'bg-softspot-100' },
  { id: 'bunny', src: '/assets/avatars/bunny-avatar.png', bgColor: 'bg-blue-100' },
  { id: 'cat', src: '/assets/avatars/cat-avatar.png', bgColor: 'bg-softspot-200' },
  { id: 'dog', src: '/assets/avatars/dog-avatar.png', bgColor: 'bg-yellow-100' },
  { id: 'unicorn', src: '/assets/avatars/unicorn-avatar.png', bgColor: 'bg-purple-100' },
  { id: 'penguin', src: '/assets/avatars/penguin-avatar.png', bgColor: 'bg-blue-200' },
  { id: 'fox', src: '/assets/avatars/fox-avatar.png', bgColor: 'bg-orange-100' },
  { id: 'panda', src: '/assets/avatars/panda-avatar.png', bgColor: 'bg-gray-100' },
  // Kai avatars
  { id: 'kai-default', src: '/assets/avatars/Kai.PNG', bgColor: 'bg-pink-100' },
  { id: 'kai-happy', src: '/assets/avatars/Kai-Happy.PNG', bgColor: 'bg-green-100' },
  { id: 'kai-hello', src: '/assets/avatars/Kai-Hello.PNG', bgColor: 'bg-blue-100' },
  { id: 'kai-love', src: '/assets/avatars/Kai-Love.PNG', bgColor: 'bg-red-100' },
  { id: 'kai-sad', src: '/assets/avatars/Kai-Sad.PNG', bgColor: 'bg-purple-100' },
  { id: 'kai-sus', src: '/assets/avatars/Kai-Sus.PNG', bgColor: 'bg-yellow-100' },
];

interface AvatarSelectorProps {
  currentAvatar: string | null;
  onSelect: (avatarUrl: string) => void;
}

export const AvatarSelector = ({ currentAvatar, onSelect }: AvatarSelectorProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar);
  
  useEffect(() => {
    setSelectedAvatar(currentAvatar);
  }, [currentAvatar]);
  
  const handleSelectAvatar = (avatar: AvatarOption) => {
    setSelectedAvatar(avatar.src);
    onSelect(avatar.src);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setSelectedAvatar(ev.target.result as string);
          onSelect(ev.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleReset = () => {
    setSelectedAvatar(null);
    onSelect('');
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          <img 
            src={selectedAvatar || "https://i.pravatar.cc/300"} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover border-4 border-softspot-100"
            onError={(e) => {
              e.currentTarget.src = "https://i.pravatar.cc/300";
            }}
          />
          <Button 
            type="button"
            className="absolute bottom-0 right-0 bg-softspot-500 text-white p-2 h-auto w-auto rounded-full hover:bg-softspot-600"
            onClick={() => document.getElementById("picture-upload")?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
          <input 
            id="picture-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload}
          />
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">Upload a new photo or choose from our avatars</p>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Plushie Avatars</h4>
            <div className="flex flex-wrap gap-3 mb-4">
              {defaultAvatars.slice(0, 8).map((avatar) => (
                <div 
                  key={avatar.id}
                  className={`w-16 h-16 rounded-full cursor-pointer transition-all ${avatar.bgColor} ${
                    selectedAvatar === avatar.src 
                      ? "transform scale-105 shadow-md ring-2 ring-softspot-500 avatar-option selected" 
                      : "hover:transform hover:scale-105 avatar-option"
                  }`}
                  onClick={() => handleSelectAvatar(avatar)}
                >
                  <img 
                    src={avatar.src} 
                    alt={`${avatar.id} avatar`} 
                    className="w-full h-full object-contain p-2 rounded-full"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Kai Avatars</h4>
            <div className="flex flex-wrap gap-3 mb-4">
              {defaultAvatars.slice(8).map((avatar) => (
                <div 
                  key={avatar.id}
                  className={`w-16 h-16 rounded-full cursor-pointer transition-all ${avatar.bgColor} ${
                    selectedAvatar === avatar.src 
                      ? "transform scale-105 shadow-md ring-2 ring-softspot-500 avatar-option selected" 
                      : "hover:transform hover:scale-105 avatar-option"
                  }`}
                  onClick={() => handleSelectAvatar(avatar)}
                >
                  <img 
                    src={avatar.src} 
                    alt={`${avatar.id} avatar`} 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            type="button"
            variant="link" 
            className="text-sm text-softspot-500 font-medium p-0 h-auto"
            onClick={handleReset}
          >
            <Redo className="h-4 w-4 mr-1" /> Reset to Default
          </Button>
        </div>
      </div>
    </div>
  );
};
