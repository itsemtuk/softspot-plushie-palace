
import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

// Store platform data
const storePlatforms = [
  { id: "etsy", label: "Etsy" },
  { id: "ebay", label: "eBay" },
  { id: "poshmark", label: "Poshmark" },
  { id: "mercari", label: "Mercari" },
  { id: "depop", label: "Depop" },
  { id: "amazon", label: "Amazon" },
  { id: "shopify", label: "Shopify Store" },
  { id: "other", label: "Other Online Store" }
];

interface StoreLinksTabProps {
  form: UseFormReturn<any>;
}

export const StoreLinksTab = ({ form }: StoreLinksTabProps) => {
  const [newPlatform, setNewPlatform] = useState("");
  const [newStoreUrl, setNewStoreUrl] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const storeLinks = form.watch("storeLinks") || [];
  
  const addStoreLink = () => {
    if (!newPlatform || !newStoreUrl) return;
    
    const updatedLinks = [...storeLinks, {
      platform: newPlatform,
      url: newStoreUrl
    }];
    
    form.setValue("storeLinks", updatedLinks);
    setNewPlatform("");
    setNewStoreUrl("");
    setDialogOpen(false);
  };
  
  const removeStoreLink = (index: number) => {
    const updatedLinks = [...storeLinks];
    updatedLinks.splice(index, 1);
    form.setValue("storeLinks", updatedLinks);
  };
  
  return (
    <div className="border-b border-gray-200 pb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Online Store Links</h3>
      <p className="text-sm text-gray-500 mb-4">
        Connect your online stores where you sell or trade plushies
      </p>
      
      <div className="space-y-4">
        {/* Display existing store links */}
        {storeLinks.length > 0 && (
          <div className="space-y-3 mb-4">
            {storeLinks.map((link: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">{link.platform}</p>
                  <p className="text-sm text-gray-500 truncate max-w-xs">{link.url}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStoreLink(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Add new store platform */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Store</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Online Store</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="platform">Store Platform</FormLabel>
                <Select value={newPlatform} onValueChange={setNewPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {storePlatforms.map(platform => (
                        <SelectItem key={platform.id} value={platform.id}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <FormLabel htmlFor="storeUrl">Store URL</FormLabel>
                <Input 
                  id="storeUrl" 
                  value={newStoreUrl} 
                  onChange={e => setNewStoreUrl(e.target.value)} 
                  placeholder="https://www.example.com/mystore"
                />
              </div>
              <div className="flex justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={addStoreLink} disabled={!newPlatform || !newStoreUrl}>
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Help text */}
        <p className="text-sm text-gray-500">
          Add your online store links to help others find your listings.
        </p>
      </div>
    </div>
  );
};
