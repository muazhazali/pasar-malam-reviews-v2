import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ReviewForm } from './ReviewForm';

interface ReviewDialogProps {
  shopId: string;
  shopName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: {
    rating: number;
    content: string;
  }) => Promise<void>;
}

export function ReviewDialog({ shopId, shopName, isOpen, onClose, onSubmit }: ReviewDialogProps) {
  const handleSubmit = async (review: {
    rating: number;
    content: string;
  }) => {
    try {
      await onSubmit(review);
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-medium">Write a Review for {shopName}</Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="mt-4">
            <ReviewForm shopId={shopId} onSubmit={handleSubmit} onCancel={onClose} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 