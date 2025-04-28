
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExtendedPost } from "@/types/marketplace";
import { Spinner } from "@/components/ui/spinner";
import { MapPin } from "lucide-react";

interface EditPostFormProps {
  post: ExtendedPost;
  onSave: (editedPost: ExtendedPost) => Promise<boolean>;
  onCancel: () => void;
}

export function EditPostForm({ post, onSave, onCancel }: EditPostFormProps) {
  const [editedPost, setEditedPost] = useState<ExtendedPost>({...post});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagsText, setTagsText] = useState(post.tags?.join(', ') || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPost(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsText(e.target.value);
    
    // Convert tags string to array
    const tagsArray = e.target.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    setEditedPost(prev => ({ ...prev, tags: tagsArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(editedPost);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <Input
          id="title"
          name="title"
          value={editedPost.title}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={editedPost.description || ''}
          onChange={handleChange}
          rows={3}
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="location"
            name="location"
            value={editedPost.location || ''}
            onChange={handleChange}
            className="pl-8 w-full"
            placeholder="Add location (optional)"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma separated)
        </label>
        <Input
          id="tags"
          name="tags"
          value={tagsText}
          onChange={handleTagsChange}
          placeholder="e.g. cute, plushie, bear"
          className="w-full"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
