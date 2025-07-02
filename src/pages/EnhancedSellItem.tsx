import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, DollarSign, Clock, Handshake, Gavel, Check, Camera, Package, Tag, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { AuthGuard } from "@/utils/security/authGuard";
import { ValidationSchemas } from "@/utils/security/inputValidation";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useClerkSupabaseUser } from "@/hooks/useClerkSupabaseUser";
import { toast } from "@/components/ui/use-toast";

const enhancedSellItemSchema = z.object({
  title: ValidationSchemas.postTitle,
  description: ValidationSchemas.postContent,
  brand: ValidationSchemas.brandName,
  condition: ValidationSchemas.condition,
  price: ValidationSchemas.price.optional(),
  
  // Item details
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  species: z.string().min(1, "Animal/character type is required"),
  material: z.string().min(1, "Material is required"),
  filling: z.string().min(1, "Filling type is required"),
  
  // Enhanced selling options
  listingType: z.enum(['fixed_price', 'negotiable', 'auction', 'trade_only']),
  allowsOffers: z.boolean().default(false),
  allowsTrades: z.boolean().default(false),
  minimumOffer: ValidationSchemas.price.optional(),
  
  // Auction fields
  auctionDuration: z.number().min(1).max(30).optional(), // days
  bidIncrement: ValidationSchemas.price.optional(),
  
  // Trade fields
  tradePreferences: z.string().max(500).optional(),
  preferredTradeBrands: z.array(z.string()).optional(),
});

type EnhancedSellItemFormData = z.infer<typeof enhancedSellItemSchema>;

const STEPS = [
  { id: 1, title: "Photos", icon: Camera, description: "Add photos of your plushie" },
  { id: 2, title: "Details", icon: Package, description: "Tell us about your item" },
  { id: 3, title: "Pricing", icon: Tag, description: "Set your price and terms" },
  { id: 4, title: "Review", icon: Sparkles, description: "Review and publish" }
];

export default function EnhancedSellItem() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { supabaseUserId } = useClerkSupabaseUser(user);
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  
  const colorOptions = [
    { name: 'White', value: 'white', hex: 'hsl(0, 0%, 100%)' },
    { name: 'Cream', value: 'cream', hex: 'hsl(43, 13%, 90%)' },
    { name: 'Beige', value: 'beige', hex: 'hsl(43, 13%, 90%)' },
    { name: 'Brown', value: 'brown', hex: 'hsl(25, 75%, 47%)' },
    { name: 'Light Brown', value: 'light-brown', hex: 'hsl(33, 43%, 67%)' },
    { name: 'Dark Brown', value: 'dark-brown', hex: 'hsl(30, 67%, 25%)' },
    { name: 'Black', value: 'black', hex: 'hsl(0, 0%, 0%)' },
    { name: 'Gray', value: 'gray', hex: 'hsl(0, 0%, 50%)' },
    { name: 'Pink', value: 'pink', hex: 'hsl(349, 100%, 88%)' },
    { name: 'Purple', value: 'purple', hex: 'hsl(300, 100%, 25%)' },
    { name: 'Blue', value: 'blue', hex: 'hsl(240, 100%, 50%)' },
    { name: 'Light Blue', value: 'light-blue', hex: 'hsl(197, 71%, 73%)' },
    { name: 'Green', value: 'green', hex: 'hsl(120, 100%, 25%)' },
    { name: 'Yellow', value: 'yellow', hex: 'hsl(60, 100%, 50%)' },
    { name: 'Orange', value: 'orange', hex: 'hsl(39, 100%, 50%)' },
    { name: 'Red', value: 'red', hex: 'hsl(0, 100%, 50%)' },
    { name: 'Multi-colored', value: 'multi', hex: 'hsl(349, 100%, 88%)' },
  ];
  
  const form = useForm<EnhancedSellItemFormData>({
    resolver: zodResolver(enhancedSellItemSchema),
    defaultValues: {
      listingType: 'fixed_price',
      allowsOffers: false,
      allowsTrades: false,
    }
  });

  const listingType = form.watch('listingType');
  const allowsOffers = form.watch('allowsOffers');
  const allowsTrades = form.watch('allowsTrades');

  const uploadImages = async () => {
    const uploadedUrls: string[] = [];
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, image);
        
      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Failed to upload ${image.name}`);
      }
      
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);
        
      uploadedUrls.push(urlData.publicUrl);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (data: EnhancedSellItemFormData) => {
    if (!user || !supabaseUserId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to create listings."
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Starting submission with data:", data);
      
      // Upload images first
      const uploadedImageUrls = images.length > 0 ? await uploadImages() : [];
      
      // Prepare listing data for marketplace_listings table
      const listingData: any = {
        user_id: supabaseUserId,
        title: data.title,
        description: data.description,
        brand: data.brand,
        condition: data.condition,
        listing_type: data.listingType,
        image_urls: uploadedImageUrls,
        allows_offers: data.allowsOffers,
        allows_trades: data.allowsTrades,
        minimum_offer: data.minimumOffer,
        bid_increment: data.bidIncrement,
        trade_preferences: data.tradePreferences,
        preferred_trade_brands: data.preferredTradeBrands || [],
        status: 'active'
      };

      // Add price for non-trade-only listings
      if (data.listingType !== 'trade_only' && data.price) {
        listingData.price = data.price;
      }

      // Add auction end time if it's an auction
      if (data.listingType === 'auction' && data.auctionDuration) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + data.auctionDuration);
        listingData.auction_end_time = endDate.toISOString();
      }

      console.log("Inserting listing data:", listingData);

      const { data: result, error } = await supabase
        .from('marketplace_listings')
        .insert([listingData])
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        toast({
          variant: "destructive",
          title: "Failed to create listing",
          description: error.message || "Please try again."
        });
        return;
      }

      console.log("Listing created successfully:", result);

      // Ask if user wants to share to feed
      const shareToFeed = window.confirm("Listing created successfully! Would you like to share this to your feed as well?");
      
      if (shareToFeed) {
        try {
          const { error: feedError } = await supabase
            .from('feed_posts')
            .insert([{
              user_id: supabaseUserId,
              title: data.title,
              content: data.description,
              description: data.description,
              image: uploadedImageUrls[0] || null
            }]);

          if (feedError) {
            console.error("Failed to share to feed:", feedError);
            toast({
              variant: "destructive",
              title: "Listing created but failed to share to feed",
              description: "Your item is listed but couldn't be shared to the feed."
            });
          } else {
            toast({
              title: "Success!",
              description: "Your item has been listed and shared to the feed."
            });
          }
        } catch (error) {
          console.error("Error sharing to feed:", error);
        }
      } else {
        toast({
          title: "Listing created!",
          description: "Your item has been successfully listed on the marketplace."
        });
      }

      // Reset form and navigate
      form.reset();
      setImages([]);
      setImageUrls([]);
      setCurrentStep(1);
      navigate('/marketplace');

    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while creating your listing."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      const totalImages = images.length + newImages.length;
      
      if (totalImages > 5) {
        toast({
          variant: "destructive",
          title: "Too many images",
          description: "You can upload a maximum of 5 images."
        });
        return;
      }
      
      setImages(prev => [...prev, ...newImages]);
      
      // Create preview URLs
      newImages.forEach(image => {
        const url = URL.createObjectURL(image);
        setImageUrls(prev => [...prev, url]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imageUrls[index]);
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <AuthGuard requireAuth>
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-16">
          {/* Header with Progress */}
          <div className="bg-background/80 backdrop-blur-lg border-b border-border/50 p-4 sticky top-16 z-40">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="h-10 w-10"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-foreground">
                    Create Your Listing
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep} of {STEPS.length} - {STEPS[currentStep - 1]?.description}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between">
                  {STEPS.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'bg-primary text-primary-foreground' 
                            : isActive 
                              ? 'bg-primary/20 text-primary border-2 border-primary' 
                              : 'bg-muted text-muted-foreground'
                        }`}>
                          {isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </div>
                        <span className={`text-xs font-medium ${
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto p-4 space-y-6 pb-20">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              
              {/* Step 1: Photos */}
              {currentStep === 1 && (
                <Card className="animate-fade-in">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Camera className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Add Your Photos</CardTitle>
                        <p className="text-muted-foreground">Upload up to 5 high-quality photos of your plushie</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      
                      <label
                        htmlFor="image-upload"
                        className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block bg-gradient-to-br from-primary/5 to-transparent"
                      >
                        <Upload className="h-12 w-12 text-primary/60 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Click to upload photos
                        </h3>
                        <p className="text-muted-foreground mb-2">
                          or drag and drop your images here
                        </p>
                        <Badge variant="secondary">
                          {images.length}/5 photos
                        </Badge>
                      </label>
                      
                      {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-end pt-4">
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={images.length === 0}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Continue to Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <Card className="animate-fade-in">
                  <CardHeader className="bg-gradient-to-r from-accent/10 to-secondary/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <Package className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Item Details</CardTitle>
                        <p className="text-muted-foreground">Tell us about your plushie</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Label htmlFor="title" className="text-base font-semibold">Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Jellycat Bashful Bunny - Medium Size"
                          className="mt-2"
                          {...form.register('title')}
                        />
                        {form.formState.errors.title && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="description" className="text-base font-semibold">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your plushie's condition, history, and any special features..."
                          className="mt-2 min-h-[100px]"
                          {...form.register('description')}
                        />
                        {form.formState.errors.description && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Brand *</Label>
                        <Select onValueChange={(value) => form.setValue('brand', value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jellycat">Jellycat</SelectItem>
                            <SelectItem value="squishmallows">Squishmallows</SelectItem>
                            <SelectItem value="build-a-bear">Build-A-Bear</SelectItem>
                            <SelectItem value="sanrio">Sanrio</SelectItem>
                            <SelectItem value="disney">Disney</SelectItem>
                            <SelectItem value="pokemon">Pokemon</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Condition *</Label>
                        <Select onValueChange={(value: any) => form.setValue('condition', value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New with tags</SelectItem>
                            <SelectItem value="like-new">Like new</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Size *</Label>
                        <Select onValueChange={(value) => form.setValue('size', value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mini">Mini (0-6 inches)</SelectItem>
                            <SelectItem value="small">Small (7-12 inches)</SelectItem>
                            <SelectItem value="medium">Medium (13-18 inches)</SelectItem>
                            <SelectItem value="large">Large (19-24 inches)</SelectItem>
                            <SelectItem value="xlarge">X-Large (25+ inches)</SelectItem>
                            <SelectItem value="giant">Giant (36+ inches)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Animal/Character *</Label>
                        <Select onValueChange={(value) => form.setValue('species', value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bear">Bear</SelectItem>
                            <SelectItem value="bunny">Bunny/Rabbit</SelectItem>
                            <SelectItem value="cat">Cat</SelectItem>
                            <SelectItem value="dog">Dog</SelectItem>
                            <SelectItem value="elephant">Elephant</SelectItem>
                            <SelectItem value="unicorn">Unicorn</SelectItem>
                            <SelectItem value="dragon">Dragon</SelectItem>
                            <SelectItem value="panda">Panda</SelectItem>
                            <SelectItem value="penguin">Penguin</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Color *</Label>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => {
                                setSelectedColor(color.value);
                                form.setValue('color', color.value);
                              }}
                              className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                                selectedColor === color.value 
                                  ? 'border-primary shadow-lg' 
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <div 
                                className="w-6 h-6 rounded-full mx-auto mb-1"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-xs font-medium">{color.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Material *</Label>
                        <Select onValueChange={(value) => form.setValue('material', value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plush">Soft Plush</SelectItem>
                            <SelectItem value="cotton">Cotton</SelectItem>
                            <SelectItem value="polyester">Polyester</SelectItem>
                            <SelectItem value="velvet">Velvet</SelectItem>
                            <SelectItem value="fleece">Fleece</SelectItem>
                            <SelectItem value="minky">Minky</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Filling *</Label>
                        <Select onValueChange={(value) => form.setValue('filling', value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select filling" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="polyester-fiber">Polyester Fiberfill</SelectItem>
                            <SelectItem value="memory-foam">Memory Foam</SelectItem>
                            <SelectItem value="plastic-pellets">Plastic Pellets</SelectItem>
                            <SelectItem value="bean-bag">Bean Bag Filling</SelectItem>
                            <SelectItem value="cotton">Cotton</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-6">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back to Photos
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Continue to Pricing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Pricing */}
              {currentStep === 3 && (
                <Card className="animate-fade-in">
                  <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Tag className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Pricing & Terms</CardTitle>
                        <p className="text-muted-foreground">Set your price and selling preferences</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Listing Type Selection */}
                    <div>
                      <Label className="text-base font-semibold mb-4 block">How would you like to sell?</Label>
                      <RadioGroup
                        value={listingType}
                        onValueChange={(value: any) => form.setValue('listingType', value)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                          <RadioGroupItem value="fixed_price" id="fixed_price" />
                          <div className="flex items-center gap-3 flex-1">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <Label htmlFor="fixed_price" className="cursor-pointer flex-1">
                              <div className="font-semibold">Fixed Price</div>
                              <div className="text-sm text-muted-foreground">Set a price and sell immediately</div>
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                          <RadioGroupItem value="negotiable" id="negotiable" />
                          <div className="flex items-center gap-3 flex-1">
                            <Handshake className="h-5 w-5 text-blue-600" />
                            <Label htmlFor="negotiable" className="cursor-pointer flex-1">
                              <div className="font-semibold">Negotiable</div>
                              <div className="text-sm text-muted-foreground">Accept offers from buyers</div>
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                          <RadioGroupItem value="auction" id="auction" />
                          <div className="flex items-center gap-3 flex-1">
                            <Gavel className="h-5 w-5 text-purple-600" />
                            <Label htmlFor="auction" className="cursor-pointer flex-1">
                              <div className="font-semibold">Auction</div>
                              <div className="text-sm text-muted-foreground">Let buyers bid on your item</div>
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                          <RadioGroupItem value="trade_only" id="trade_only" />
                          <div className="flex items-center gap-3 flex-1">
                            <Handshake className="h-5 w-5 text-orange-600" />
                            <Label htmlFor="trade_only" className="cursor-pointer flex-1">
                              <div className="font-semibold">Trade Only</div>
                              <div className="text-sm text-muted-foreground">Only accept trades, no money</div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Price Input */}
                    {listingType !== 'trade_only' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price" className="text-base font-semibold">
                            {listingType === 'auction' ? 'Starting Price ($)' : 'Price ($)'} *
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="mt-2"
                            {...form.register('price', { valueAsNumber: true })}
                          />
                        </div>
                        
                        {listingType === 'auction' && (
                          <div>
                            <Label htmlFor="auctionDuration" className="text-base font-semibold">Auction Duration (days)</Label>
                            <Input
                              id="auctionDuration"
                              type="number"
                              min="1"
                              max="30"
                              placeholder="7"
                              className="mt-2"
                              {...form.register('auctionDuration', { valueAsNumber: true })}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Additional Options */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="allowsOffers"
                          checked={allowsOffers}
                          onCheckedChange={(checked: boolean) => form.setValue('allowsOffers', checked)}
                        />
                        <Label htmlFor="allowsOffers" className="text-base">Accept offers</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="allowsTrades"
                          checked={allowsTrades}
                          onCheckedChange={(checked: boolean) => form.setValue('allowsTrades', checked)}
                        />
                        <Label htmlFor="allowsTrades" className="text-base">Accept trades</Label>
                      </div>
                    </div>

                    {allowsTrades && (
                      <div>
                        <Label htmlFor="tradePreferences" className="text-base font-semibold">Trade Preferences</Label>
                        <Textarea
                          id="tradePreferences"
                          placeholder="What are you looking for in a trade?"
                          className="mt-2"
                          {...form.register('tradePreferences')}
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-6">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back to Details
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Review Listing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <Card className="animate-fade-in">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Review Your Listing</CardTitle>
                        <p className="text-muted-foreground">Make sure everything looks perfect</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Preview */}
                    <div className="border rounded-lg p-4 bg-accent/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          {images.length > 0 && (
                            <img
                              src={URL.createObjectURL(images[0])}
                              alt="Main preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          )}
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-bold">{form.watch('title')}</h3>
                          <p className="text-muted-foreground">{form.watch('description')}</p>
                          <div className="space-y-2">
                            <Badge variant="outline">{form.watch('brand')}</Badge>
                            <Badge variant="outline">{form.watch('condition')}</Badge>
                            <Badge variant="outline">{form.watch('size')}</Badge>
                          </div>
                          {listingType !== 'trade_only' && form.watch('price') && (
                            <div className="text-2xl font-bold text-primary">
                              ${form.watch('price')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-6">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back to Pricing
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isSubmitting ? "Creating Listing..." : "Publish Listing"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}