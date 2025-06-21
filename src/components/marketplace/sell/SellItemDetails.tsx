
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SellItemDetailsProps {
  formData: {
    brand: string;
    condition: string;
    species: string;
    size: string;
    color: string;
    material: string;
    filling: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export const SellItemDetails = ({ formData, onInputChange }: SellItemDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => onInputChange('brand', e.target.value)}
            placeholder="e.g., Jellycat, Build-A-Bear"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select value={formData.condition} onValueChange={(value) => onInputChange('condition', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New with tags</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="species">Species/Type</Label>
          <Input
            id="species"
            value={formData.species}
            onChange={(e) => onInputChange('species', e.target.value)}
            placeholder="e.g., Bear, Bunny, Cat"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Input
            id="size"
            value={formData.size}
            onChange={(e) => onInputChange('size', e.target.value)}
            placeholder="e.g., Small, Medium, Large"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => onInputChange('color', e.target.value)}
            placeholder="e.g., Brown, Pink, Multi"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Input
            id="material"
            value={formData.material}
            onChange={(e) => onInputChange('material', e.target.value)}
            placeholder="e.g., Soft plush, Velour"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="filling">Filling</Label>
          <Input
            id="filling"
            value={formData.filling}
            onChange={(e) => onInputChange('filling', e.target.value)}
            placeholder="e.g., Polyester, Beans"
          />
        </div>
      </div>
    </div>
  );
};
