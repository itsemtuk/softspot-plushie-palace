
import React, { useEffect, useState } from "react";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { PostCreationForm } from "@/components/post/PostCreationForm";
import { useNavigate } from "react-router-dom";

interface UseCreatePostOptions {
  redirectAfterCreate?: boolean;
  redirectPath?: string;
}

export const useCreatePost = (options?: UseCreatePostOptions) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const closeForm = () => {
    setIsOpen(false);
  };
  
  const onCreatePost = () => {
    console.log("Opening post creation form");
    setIsOpen(true);
  };
  
  // For mobile, let's use a sheet
  if (isMobile) {
    return {
      onCreatePost,
      CreatePostTrigger: ({ children }: { children: React.ReactNode }) => (
        <SheetTrigger asChild>
          <Button
            onClick={onCreatePost}
            className="bg-softspot-500 hover:bg-softspot-600"
          >
            {children}
          </Button>
        </SheetTrigger>
      ),
      CreatePostContent: () => (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle>Create New Post</SheetTitle>
              <SheetDescription>
                Share a photo of your plushie with the community
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <PostCreationForm 
                onSuccess={() => {
                  closeForm();
                  if (options?.redirectAfterCreate) {
                    navigate(options.redirectPath || '/feed');
                  }
                }}
                onCancel={closeForm}
              />
            </div>
          </SheetContent>
        </Sheet>
      ),
    };
  }
  
  // For desktop, let's use a dialog
  return {
    onCreatePost,
    CreatePostTrigger: ({ children }: { children: React.ReactNode }) => (
      <DialogTrigger asChild>
        <Button
          onClick={onCreatePost}
          className="bg-softspot-500 hover:bg-softspot-600"
        >
          {children}
        </Button>
      </DialogTrigger>
    ),
    CreatePostContent: () => (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share a photo of your plushie with the community
            </DialogDescription>
          </DialogHeader>
          <PostCreationForm 
            onSuccess={() => {
              closeForm();
              if (options?.redirectAfterCreate) {
                navigate(options.redirectPath || '/feed');
              }
            }}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>
    ),
  };
};
