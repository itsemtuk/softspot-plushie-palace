
export type PlushieCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
export type PlushieSize = 'Small' | 'Medium' | 'Large' | 'Extra Large';
export type PlushieMaterial = 'Cotton' | 'Polyester' | 'Plush' | 'Fur' | 'Velvet' | 'Other';
export type PlushieFilling = 'Cotton' | 'Polyester' | 'Beads' | 'Memory Foam' | 'Other';
export type PlushieSpecies = 'Bear' | 'Cat' | 'Dog' | 'Rabbit' | 'Mythical' | 'Other';
export type PlushieBrand = 'Build-A-Bear' | 'Squishmallows' | 'Jellycat' | 'Care Bears' | 'Disney' | 'Other';

export interface MarketplacePlushie {
  id: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  price: number;
  forSale: boolean;
  condition: PlushieCondition;
  description: string;
  color: string;
  size?: PlushieSize;
  material: PlushieMaterial;
  filling: PlushieFilling;
  species: PlushieSpecies;
  brand: PlushieBrand;
  deliveryMethod?: 'Shipping' | 'Collection' | 'Both';
  deliveryCost?: number;
  tags?: string[];
}
