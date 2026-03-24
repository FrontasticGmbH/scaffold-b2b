import ResponsiveModal from '@/components/organisms/responsive-modal';
import ListWishlist from '@/components/molecules/wishlist-modal/components/list-wishlists';
import CreateWishlist from '@/components/molecules/wishlist-modal/components/create-wishlist';
import { WishlistModalProps } from './types';

const WishlistModal = ({
  lists,
  isOpen,
  onSubmit,
  selectedIds,
  loading,
  onClose,
  onAddToNewList,
  handleChange,
}: WishlistModalProps) => {
  return (
    <ResponsiveModal
      onRequestClose={onClose}
      isOpen={isOpen}
      closeButton
      className="flex min-h-[400px] flex-col md:w-[400px] lg:w-[600px]"
    >
      {lists?.length > 0 ? (
        <ListWishlist
          lists={lists}
          handleChange={handleChange}
          isOpen={isOpen}
          onSubmit={onSubmit}
          onClose={onClose}
          selectedIds={selectedIds}
          loading={loading}
        />
      ) : (
        <CreateWishlist onClose={onClose} onAddToNewList={onAddToNewList} />
      )}
    </ResponsiveModal>
  );
};

export default WishlistModal;
