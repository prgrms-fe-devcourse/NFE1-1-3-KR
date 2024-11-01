import { create } from 'zustand';

type SearchBookStore = {
  bookId: string | undefined;
  setBookId: (bookId: string | undefined) => void;
};

export const useSearchBookStore = create<SearchBookStore>(set => ({
  bookId: undefined,
  setBookId: book => {
    set({ bookId: book });
  },
}));
