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
    photos: File[];
  }) => Promise<void>;
}

export function ReviewDialog({
  shopId,
  shopName,
  isOpen,
  onClose,
  onSubmit,
}: ReviewDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="fixed left-[50%] top-[50%] z-[10000] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Write a Review</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Share your experience at {shopName}
        </p>
        <div className="mt-4">
          <ReviewForm
            shopId={shopId}
            onSubmit={async (review) => {
              await onSubmit(review);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </>
  );
} 