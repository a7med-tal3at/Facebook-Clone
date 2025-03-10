import { create } from 'zustand';

interface CoverModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCoverModal = create<CoverModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useCoverModal;
