
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandLogo } from "../../brand/BrandLogo";
import { MarketplacePlushie } from "@/types/marketplace";

interface PlushieHeaderProps {
  plushie: MarketplacePlushie;
  formattedDate: string;
}

export const PlushieHeader = ({ plushie, formattedDate }: PlushieHeaderProps) => {
  const price = plushie.price || 0;
  const originalPrice = plushie.originalPrice || plushie.price || 0;
  const hasDiscount = plushie.discount && plushie.discount > 0;
  const deliveryCost = typeof plushie.deliveryCost === 'number' ? plushie.deliveryCost : 0;
  const shippingInfo = deliveryCost === 0 ? "Free shipping" : `$${deliveryCost.toFixed(2)} shipping`;

  return (
    <>
      <div className="flex items-center mb-2">
        {plushie.brand && (
  <Link
    to={`/marketplace?brand=${encodeURIComponent(plushie.brand)}`}
    onClick={e => e.stopPropagation()}
    className="flex items-center group"
  >
    <BrandLogo brandName={plushie.brand} className="w-5 h-5 mr-2" />
    <span className="text-sm text-blue-600 group-hover:underline">{plushie.brand}</span>
  </Link>
)}
      </div>
      
      <DialogTitle className="text-xl font-bold mb-2">{plushie.title}</DialogTitle>
      
      <div className="flex items-baseline space-x-2 mb-4">
        <span className="text-2xl font-bold">${price.toFixed(2)}</span>
        {hasDiscount && (
          <span className="text-gray-500 line-through text-sm">
            ${originalPrice.toFixed(2)}
          </span>
        )}
        <span className="text-sm text-gray-600">{shippingInfo}</span>
      </div>
      
      <div className="flex items-center space-x-1 mb-4">
        <Avatar className="h-6 w-6">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${plushie.username || 'U'}`} />
          <AvatarFallback>{plushie.username?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        {(() => {
  const { user } = useUser();
  const isCurrentUser = user && (user.username === plushie.username || user.id === plushie.userId);
  if (plushie.username) {
    return (
      <Link
        to={isCurrentUser ? "/profile" : `/user/${plushie.username}`}
        onClick={e => e.stopPropagation()}
        className="text-sm text-blue-600 hover:underline"
      >
        {plushie.username}
      </Link>
    );
  } else {
    return <span className="text-sm text-gray-600">Anonymous</span>;
  }
})()}

        <span className="text-xs text-gray-500">• {formattedDate}</span>
      </div>
    </>
  );
};
