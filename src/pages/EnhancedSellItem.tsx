import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, DollarSign, Clock, Handshake, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { AuthGuard } from "@/utils/security/authGuard";
import { ValidationSchemas } from "@/utils/security/inputValidation";

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
  feel: z.string().min(1, "Feel/texture is required"),
  location: z.string().min(1, "Location is required"),
  
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

export default function EnhancedSellItem() {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  
  const colorOptions = [
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Cream', value: 'cream', hex: '#F5F5DC' },
    { name: 'Beige', value: 'beige', hex: '#F5F5DC' },
    { name: 'Brown', value: 'brown', hex: '#8B4513' },
    { name: 'Light Brown', value: 'light-brown', hex: '#DEB887' },
    { name: 'Dark Brown', value: 'dark-brown', hex: '#654321' },
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Gray', value: 'gray', hex: '#808080' },
    { name: 'Pink', value: 'pink', hex: '#FFC0CB' },
    { name: 'Purple', value: 'purple', hex: '#800080' },
    { name: 'Blue', value: 'blue', hex: '#0000FF' },
    { name: 'Light Blue', value: 'light-blue', hex: '#87CEEB' },
    { name: 'Green', value: 'green', hex: '#008000' },
    { name: 'Yellow', value: 'yellow', hex: '#FFFF00' },
    { name: 'Orange', value: 'orange', hex: '#FFA500' },
    { name: 'Red', value: 'red', hex: '#FF0000' },
    { name: 'Rainbow', value: 'rainbow', hex: 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)' },
    { name: 'Multi-colored', value: 'multi', hex: '#FFB6C1' },
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

  const handleSubmit = async (data: EnhancedSellItemFormData) => {
    console.log("Enhanced form submitted:", data);
    // TODO: Submit to backend
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  };

  return (
    <AuthGuard requireAuth>
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-16 z-40">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Listing
              </h1>
            </div>
          </div>

          <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Listing Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>How would you like to sell?</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={listingType}
                  onValueChange={(value: any) => form.setValue('listingType', value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="fixed_price" id="fixed_price" />
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <Label htmlFor="fixed_price" className="cursor-pointer">
                        <div className="font-medium">Fixed Price</div>
                        <div className="text-sm text-gray-500">Set a price and sell immediately</div>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="negotiable" id="negotiable" />
                    <div className="flex items-center gap-2">
                      <Handshake className="h-4 w-4 text-blue-600" />
                      <Label htmlFor="negotiable" className="cursor-pointer">
                        <div className="font-medium">Negotiable</div>
                        <div className="text-sm text-gray-500">Accept offers from buyers</div>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="auction" id="auction" />
                    <div className="flex items-center gap-2">
                      <Gavel className="h-4 w-4 text-purple-600" />
                      <Label htmlFor="auction" className="cursor-pointer">
                        <div className="font-medium">Auction</div>
                        <div className="text-sm text-gray-500">Let buyers bid on your item</div>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="trade_only" id="trade_only" />
                    <div className="flex items-center gap-2">
                      <Handshake className="h-4 w-4 text-orange-600" />
                      <Label htmlFor="trade_only" className="cursor-pointer">
                        <div className="font-medium">Trade Only</div>
                        <div className="text-sm text-gray-500">Only accept trades, no money</div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Main Form */}
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                </CardHeader>
                <CardContent>
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
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-softspot-300 transition-colors cursor-pointer block"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Click to upload photos or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Add up to 5 photos ({images.length}/5)
                      </p>
                    </label>
                    
                    {images.length > 0 && (
                      <div className="grid grid-cols-5 gap-2">
                        {images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                              onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Item Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Jellycat Bashful Bunny - Medium"
                      {...form.register('title')}
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your plushie's condition, history, and any special features..."
                      {...form.register('description')}
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Brand</Label>
                      <Select onValueChange={(value) => form.setValue('brand', value)}>
                        <SelectTrigger>
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
                      <Label>Condition</Label>
                      <Select onValueChange={(value: any) => form.setValue('condition', value)}>
                        <SelectTrigger>
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Size</Label>
                      <Select onValueChange={(value) => form.setValue('size', value)}>
                        <SelectTrigger>
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
                      <Label>Animal/Character Type</Label>
                      <Select onValueChange={(value) => form.setValue('species', value)}>
                        <SelectTrigger>
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
                          <SelectItem value="lamb">Lamb</SelectItem>
                          <SelectItem value="duck">Duck</SelectItem>
                          <SelectItem value="fox">Fox</SelectItem>
                          <SelectItem value="sloth">Sloth</SelectItem>
                          <SelectItem value="octopus">Octopus</SelectItem>
                          <SelectItem value="dinosaur">Dinosaur</SelectItem>
                          <SelectItem value="pokemon">Pokemon</SelectItem>
                          <SelectItem value="sanrio">Sanrio Character</SelectItem>
                          <SelectItem value="disney">Disney Character</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Color Selection with Swatches */}
                  <div>
                    <Label className="mb-3 block">Color</Label>
                    <div className="grid grid-cols-6 gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => {
                            setSelectedColor(color.value);
                            form.setValue('color', color.value);
                          }}
                          className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                            selectedColor === color.value 
                              ? 'border-softspot-500 bg-softspot-50 dark:bg-softspot-900/20' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-full border-2 border-gray-300 mb-1"
                            style={{ 
                              background: color.value === 'rainbow' 
                                ? color.hex 
                                : color.hex,
                              border: color.value === 'white' ? '2px solid #e5e7eb' : 'none'
                            }}
                          />
                          <span className="text-xs text-center leading-tight">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Material</Label>
                      <Select onValueChange={(value) => form.setValue('material', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="polyester">Polyester</SelectItem>
                          <SelectItem value="cotton">Cotton</SelectItem>
                          <SelectItem value="velvet">Velvet</SelectItem>
                          <SelectItem value="fleece">Fleece</SelectItem>
                          <SelectItem value="minky">Minky</SelectItem>
                          <SelectItem value="faux-fur">Faux Fur</SelectItem>
                          <SelectItem value="chenille">Chenille</SelectItem>
                          <SelectItem value="sherpa">Sherpa</SelectItem>
                          <SelectItem value="bamboo">Bamboo</SelectItem>
                          <SelectItem value="organic-cotton">Organic Cotton</SelectItem>
                          <SelectItem value="mixed">Mixed Materials</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Filling</Label>
                      <Select onValueChange={(value) => form.setValue('filling', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select filling" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="polyester-fiberfill">Polyester Fiberfill</SelectItem>
                          <SelectItem value="memory-foam">Memory Foam</SelectItem>
                          <SelectItem value="bean-pellets">Bean Pellets</SelectItem>
                          <SelectItem value="plastic-pellets">Plastic Pellets</SelectItem>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="lavender">Lavender</SelectItem>
                          <SelectItem value="recycled-filling">Recycled Filling</SelectItem>
                          <SelectItem value="mixed">Mixed Filling</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Feel/Texture</Label>
                      <Select onValueChange={(value) => form.setValue('feel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select feel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super-soft">Super Soft</SelectItem>
                          <SelectItem value="plush">Plush</SelectItem>
                          <SelectItem value="fluffy">Fluffy</SelectItem>
                          <SelectItem value="squishy">Squishy</SelectItem>
                          <SelectItem value="firm">Firm</SelectItem>
                          <SelectItem value="cuddly">Cuddly</SelectItem>
                          <SelectItem value="fuzzy">Fuzzy</SelectItem>
                          <SelectItem value="smooth">Smooth</SelectItem>
                          <SelectItem value="textured">Textured</SelectItem>
                          <SelectItem value="stretchy">Stretchy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Your Location</Label>
                      <Input
                        placeholder="e.g., New York, NY"
                        {...form.register('location')}
                      />
                      {form.formState.errors.location && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.location.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(listingType === 'fixed_price' || listingType === 'negotiable') && (
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="0.00"
                          className="pl-10"
                          {...form.register('price', { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  )}

                  {listingType === 'auction' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="price">Starting Bid *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="price"
                            type="number"
                            placeholder="0.00"
                            className="pl-10"
                            {...form.register('price', { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bidIncrement">Bid Increment</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="bidIncrement"
                            type="number"
                            placeholder="1.00"
                            className="pl-10"
                            {...form.register('bidIncrement', { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="auctionDuration">Auction Duration (days)</Label>
                        <Select onValueChange={(value) => form.setValue('auctionDuration', parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day</SelectItem>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="5">5 days</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {listingType === 'trade_only' && (
                    <div>
                      <Label htmlFor="tradePreferences">What are you looking for?</Label>
                      <Textarea
                        id="tradePreferences"
                        placeholder="Describe what items you'd like to trade for..."
                        {...form.register('tradePreferences')}
                      />
                    </div>
                  )}

                  {/* Additional Options */}
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium">Additional Options</h4>
                    
                    {listingType !== 'trade_only' && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="allowsTrades"
                          checked={allowsTrades}
                          onCheckedChange={(checked) => form.setValue('allowsTrades', !!checked)}
                        />
                        <Label htmlFor="allowsTrades">Accept trade offers</Label>
                      </div>
                    )}

                    {(listingType === 'fixed_price' || listingType === 'auction') && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="allowsOffers"
                          checked={allowsOffers}
                          onCheckedChange={(checked) => form.setValue('allowsOffers', !!checked)}
                        />
                        <Label htmlFor="allowsOffers">Accept money offers</Label>
                      </div>
                    )}

                    {allowsOffers && (
                      <div>
                        <Label htmlFor="minimumOffer">Minimum Offer</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="minimumOffer"
                            type="number"
                            placeholder="0.00"
                            className="pl-10"
                            {...form.register('minimumOffer', { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-softspot-500 hover:bg-softspot-600">
                  Create Listing
                </Button>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}