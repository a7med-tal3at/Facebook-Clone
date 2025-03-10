import { create } from 'zustand';

interface ThemeModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useThemeModal = create<ThemeModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useThemeModal;
