
export type PlushieMaterial = 'cotton' | 'polyester' | 'minky' | 'plush' | 'fur' | 'velvet';
export type PlushieFilling = 'polyester-fill' | 'cotton' | 'beans' | 'foam';
export type PlushieSpecies = 'bear' | 'cat' | 'dog' | 'rabbit' | 'dragon' | 'unicorn' | 'other';
export type PlushieBrand = 'build-a-bear' | 'squishmallows' | 'jellycat' | 'gund' | 'ty' | 'other';

export interface MarketplaceFilters {
  color?: string[];
  material?: PlushieMaterial[];
  filling?: PlushieFilling[];
  species?: PlushieSpecies[];
  brand?: PlushieBrand[];
  minPrice?: number;
  maxPrice?: number;
}
