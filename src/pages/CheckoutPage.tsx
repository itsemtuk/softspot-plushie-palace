
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from '@/components/ui/use-toast';
import { CheckoutLayout } from '@/components/checkout/CheckoutLayout';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingForm, ShippingFormData } from '@/components/checkout/ShippingForm';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { MarketplacePlushie } from '@/types/marketplace';
import { getMarketplaceListings } from '@/utils/storage/localStorageUtils';
import { Spinner } from '@/components/ui/spinner';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isSignedIn } = useUser();
  
  // Parse checkout items from location state or URL query params
  const [items, setItems] = useState<MarketplacePlushie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  const [shippingDetails, setShippingDetails] = useState<ShippingFormData | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  
  // Calculate order totals
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shippingCost = items.length > 0 ? 5.99 : 0; // Example shipping cost
  const taxRate = 0.07; // 7% tax rate example
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  // This would be replaced with a cart system in a real app
  useEffect(() => {
    const loadItems = () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would come from a cart system
        // For demo, we're getting from URL params or using sample data
        const queryParams = new URLSearchParams(location.search);
        const itemId = queryParams.get('item');
        
        if (itemId) {
          // Load specific item
          const allListings = getMarketplaceListings();
          const foundItem = allListings.find(item => item.id === itemId);
          
          if (foundItem) {
            setItems([foundItem]);
          } else {
            // Item not found
            toast({
              title: "Item not found",
              description: "The requested item could not be found.",
              variant: "destructive"
            });
            navigate('/marketplace');
          }
        } else {
          // Load sample item for demo
          const allListings = getMarketplaceListings();
          if (allListings && allListings.length > 0) {
            setItems([allListings[0]]);
          } else {
            // No items available
            toast({
              title: "No items available",
              description: "There are no items in the marketplace.",
              variant: "destructive"
            });
            navigate('/marketplace');
          }
        }
      } catch (error) {
        console.error("Error loading checkout items:", error);
        toast({
          title: "Error",
          description: "Failed to load checkout items.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadItems();
    
    // Try to restore any saved checkout progress from localStorage
    const savedProgress = localStorage.getItem('checkoutProgress');
    if (savedProgress) {
      try {
        const { step, shippingDetails } = JSON.parse(savedProgress);
        setStep(step);
        setShippingDetails(shippingDetails);
      } catch (e) {
        console.error("Error parsing saved checkout progress:", e);
      }
    }
  }, [location.search, navigate]);
  
  // Save checkout progress to localStorage when it changes
  useEffect(() => {
    if (shippingDetails) {
      localStorage.setItem('checkoutProgress', JSON.stringify({
        step,
        shippingDetails
      }));
    }
  }, [step, shippingDetails]);
  
  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingDetails(data);
    setStep(2);
    
    // In a real app, you might want to validate the address with an API
    console.log("Shipping details:", data);
  };
  
  const handlePaymentSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderId(`ORD-${Date.now().toString().substr(-6)}`);
      setStep(3);
      
      // Clear checkout progress from localStorage once completed
      localStorage.removeItem('checkoutProgress');
      
      // In a real app, this would call a Stripe payment API
      console.log("Payment details:", data);
    }, 1500);
  };
  
  const handleBackToShipping = () => {
    setStep(1);
  };

  if (isLoading) {
    return (
      <CheckoutLayout currentStep={1} totalSteps={totalSteps}>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
          <span className="ml-2">Loading checkout...</span>
        </div>
      </CheckoutLayout>
    );
  }

  if (items.length === 0) {
    return (
      <CheckoutLayout currentStep={1} totalSteps={totalSteps}>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No Items In Cart</h2>
          <p className="text-gray-600 mb-6">Your cart is empty.</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-softspot-500 text-white px-4 py-2 rounded hover:bg-softspot-600"
          >
            Continue Shopping
          </button>
        </div>
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout currentStep={step} totalSteps={totalSteps}>
      <div className="space-y-6 mb-10">
        <OrderSummary
          items={items}
          subtotal={subtotal}
          shippingCost={shippingCost}
          tax={tax}
          total={total}
          collapsible={true}
        />
        
        {step === 1 && (
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
            <ShippingForm
              onSubmit={handleShippingSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
        
        {step === 2 && (
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
            <PaymentForm
              onSubmit={handlePaymentSubmit}
              onBack={handleBackToShipping}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
        
        {step === 3 && (
          <OrderConfirmation
            orderId={orderId}
            items={items}
            total={total}
            estimatedDelivery="May 25 - May 30, 2024"
          />
        )}
      </div>
    </CheckoutLayout>
  );
};

export default CheckoutPage;
