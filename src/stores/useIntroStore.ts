import { create } from 'zustand';

type IntroStore = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

export const useIntroStore = create<IntroStore>(set => ({
  isVisible: false,
  setIsVisible: visible => {
    set({ isVisible: visible });
  },
}));
