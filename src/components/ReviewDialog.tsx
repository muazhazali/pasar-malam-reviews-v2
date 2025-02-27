import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReviewForm } from '@/components/ReviewForm';
import { createReview } from '@/lib/services/reviews';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ReviewDialogProps {
  shopId: string;
  shopName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewDialog({ shopId, shopName, isOpen, onClose }: ReviewDialogProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      onClose();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (rating: number, content: string) => {
    try {
      await reviewMutation.mutate({
        shop_id: shopId,
        rating,
        content,
      });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a Review for {shopName}</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        <ReviewForm
          shopId={shopId}
          onSubmit={handleSubmit}
          isSubmitting={reviewMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
} 