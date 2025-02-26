import { useState, useRef } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewFormProps {
  shopId: string;
  onSubmit: (review: {
    rating: number;
    content: string;
    photos: File[];
  }) => Promise<void>;
  onCancel: () => void;
}

export function ReviewForm({ shopId, onSubmit, onCancel }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + photos.length > 4) {
      alert('You can only upload up to 4 photos');
      return;
    }

    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPhotoPreviewUrls([...photoPreviewUrls, ...newPreviewUrls]);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);

    // Revoke the old URL and remove it
    URL.revokeObjectURL(photoPreviewUrls[index]);
    const newPreviewUrls = photoPreviewUrls.filter((_, i) => i !== index);
    setPhotoPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to submit a review');
      return;
    }
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!content.trim()) {
      alert('Please write a review');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        content: content.trim(),
        photos,
      });
      // Clean up preview URLs
      photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating Stars */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating)
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Review Text */}
      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Your Review
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[100px] rounded-lg border bg-background px-3 py-2 text-sm"
          placeholder="Write your review here..."
          maxLength={1000}
        />
        <div className="text-xs text-muted-foreground">
          {content.length}/1000 characters
        </div>
      </div>

      {/* Photo Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Photos (optional)</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {photoPreviewUrls.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={url}
                alt={`Review photo ${index + 1}`}
                className="h-full w-full rounded-lg border object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -right-2 -top-2 rounded-full bg-background p-1 shadow-sm border hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {photos.length < 4 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border border-dashed flex items-center justify-center hover:bg-accent"
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoChange}
        />
        <p className="text-xs text-muted-foreground">
          You can upload up to 4 photos (max 5MB each)
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
} 