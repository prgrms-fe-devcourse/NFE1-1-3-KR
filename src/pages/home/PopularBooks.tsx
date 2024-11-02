import { useState, useEffect } from 'react';

import Slider from './Slider';

import { getBookList } from 'api';
import type { BookData } from 'types';

const PopularBooks = () => {
  // TODO: 데이터 처리 훅으로 분리
  const [data, setData] = useState<BookData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getBookList();
        setData(result);
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
    };

    void fetchData();
  }, []);

  // TODO: 검색 결과 없을 시 안내 표시
  return (
    <>
      <Slider data={data} />
    </>
  );
};

export default PopularBooks;
