import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, MapPin, Mail, User } from "lucide-react";
import { getMarketplaceListings } from "@/utils/storage/localStorageUtils";
import { MarketplacePlushie } from "@/types/marketplace";
import { ExtendedPost } from "@/types/core";

const CheckoutPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<MarketplacePlushie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    zipCode: '',
    email: ''
  });

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const allPlushies = await getMarketplaceListings();
        const foundItem = allPlushies.find(item => item.id === itemId);
        
        if (foundItem) {
          // Convert ExtendedPost to MarketplacePlushie
          const marketplaceItem: MarketplacePlushie = {
            ...foundItem,
            price: foundItem.price || 0, // Ensure price is defined
            name: foundItem.title || 'Untitled',
            title: foundItem.title || 'Untitled',
            forSale: foundItem.forSale || true
          };
          setItem(marketplaceItem);
        } else {
          toast({
            variant: "destructive",
            title: "Item not found",
            description: "The item you're trying to purchase could not be found.",
          });
          navigate("/marketplace");
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load item details.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItemDetails();
    }
  }, [itemId, navigate]);

  const handlePlaceOrder = async () => {
    if (!item) return;

    setIsProcessing(true);
    try {
      // Convert to MarketplacePlushie format for order processing
      const orderItem: MarketplacePlushie = {
        ...item,
        price: item.price || 0,
        name: item.title || 'Untitled',
        title: item.title || 'Untitled'
      };

      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Order placed!",
        description: `Your order for ${orderItem.title} has been placed successfully.`,
      });
      navigate("/profile");
    } catch (error) {
      console.error("Order processing failed:", error);
      toast({
        variant: "destructive",
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>Item not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Item Details</h2>
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.title} className="w-24 h-24 rounded-md object-cover" />
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-500">${item.price}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    <User className="inline-block h-4 w-4 mr-1" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    <MapPin className="inline-block h-4 w-4 mr-1" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="city" className="text-right">
                    <MapPin className="inline-block h-4 w-4 mr-1" />
                    City
                  </Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="zipCode" className="text-right">
                    <MapPin className="inline-block h-4 w-4 mr-1" />
                    Zip Code
                  </Label>
                  <Input
                    id="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    <Mail className="inline-block h-4 w-4 mr-1" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                    className="col-span-2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="cardNumber" className="text-right">
                  <CreditCard className="inline-block h-4 w-4 mr-1" />
                  Card Number
                </Label>
                <Input id="cardNumber" placeholder="•••• •••• •••• ••••" className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="expiry" className="text-right">
                  Expiry Date
                </Label>
                <Input id="expiry" placeholder="MM/YY" className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="cvc" className="text-right">
                  CVC
                </Label>
                <Input id="cvc" placeholder="CVC" className="col-span-2" />
              </div>
            </div>
          </div>
          <Button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full">
            {isProcessing ? "Processing..." : "Place Order"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPage;
