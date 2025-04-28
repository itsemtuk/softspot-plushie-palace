
import { PlushieBrand } from "@/types/marketplace";

interface BrandHeaderProps {
  brand: PlushieBrand;
}

export const BrandHeader = ({ brand }: BrandHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row items-center gap-4">
      <img
        src={brand.logo}
        alt={`${brand.name} Logo`}
        className="h-20 w-auto"
      />
      <div>
        <h1 className="text-3xl font-bold">{brand.name}</h1>
        <p className="text-gray-600">{brand.description}</p>
        <div className="mt-2 flex space-x-2">
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-softspot-500 hover:underline"
          >
            Website
          </a>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-softspot-500 hover:underline"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
};
