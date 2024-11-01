import { useQuery } from '@tanstack/react-query';
import type { KeyboardEvent } from 'react';
import { useState, useEffect } from 'react';

import { searchBook } from 'api';
import { useModalState, useModalDispatch } from 'context';
import { useSearchBookStore } from 'stores';

export const SearchModal = () => {
  const { isOpen } = useModalState();
  const dispatch = useModalDispatch();
  const [bookTitle, setBookTitle] = useState<string>('');
  const [searchTitle, setSearchTitle] = useState<string>('');
  const { setBookId, bookId } = useSearchBookStore();

  const { data: books, refetch: handleSearch } = useQuery({
    queryKey: ['searchBook', searchTitle],
    queryFn: () => searchBook({ bookTitle: searchTitle }),
    enabled: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (searchTitle) {
        await handleSearch();
      }
    };
    void fetchData();
  }, [searchTitle, handleSearch]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSearchTitle(bookTitle);
      setBookTitle('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]'>
      <div className='p-2.5 bg-white rounded-lg flex-col justify-start items-start gap-2.5 inline-flex w-[21rem]'>
        <div className='relative justify-start items-start gap-2.5 inline-flex flex-row w-full'>
          <div className='h-9 p-2 w-full bg-[#fcfcfc] rounded border border-[#afa18b] justify-start items-center gap-1.5 flex'>
            <img alt='search-icon' className='w-[15px] h-[15px] relative' src='/search-icon.svg' />
            <input
              className='text-[#959595] text-sm font-normal leading-tight w-full'
              onChange={e => {
                setBookTitle(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder='What are you looking for?'
              value={bookTitle}
            />
          </div>
          <button
            className='w-9 h-9 bg-[#243868] rounded flex-col justify-center items-center gap-2.5 inline-flex'
            onClick={() => {
              dispatch({ type: 'CLOSE_MODAL' });
            }}
          >
            <img alt='close' src='/close.svg' />
          </button>
        </div>
        <div className='self-stretch h-[135px] flex-col justify-start items-start gap-2 flex w-full'>
          <div className="text-black/50 text-[11px] font-medium font-['Manrope']">Results</div>
          <div className='self-stretch h-28 flex-col justify-start items-start gap-0.5 flex'>
            {books?.length == 0 && (
              <p className='text-[#3a3b3f] text-sm font-normal leading-tight'>No results found</p>
            )}
            {books?.map(book => (
              <div
                className='self-stretch p-2 rounded-lg justify-start items-center gap-1.5 inline-flex cursor-pointer w-full'
                key={book.id}
                onClick={() => {
                  if (bookId === book.id) {
                    setBookId(undefined);
                  } else {
                    setBookId(book.id);
                  }
                  dispatch({ type: 'CLOSE_MODAL' });
                }}
              >
                <div
                  className='w-8 h-8 bg-center bg-cover rounded'
                  style={{
                    backgroundImage: `url(${book.cover || '/default-bookcover.png'})`,
                  }}
                />
                <div className='flex-col justify-center items-start gap-0.5 inline-flex w-[calc(100%-4rem)]'>
                  <div className="text-[#3a3b3f] text-sm font-normal font-['Inknut Antiqua'] leading-tight truncate w-full">
                    {book.title}
                  </div>
                  <div className="text-[#98999b] text-xs font-normal font-['Inknut Antiqua'] leading-none truncate w-full">
                    {book.author?.replace(/\(Authors?\)/g, '').trim()}
                  </div>
                </div>
                {bookId === book.id && <img alt='selected' src='/Icon/check.svg' />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
