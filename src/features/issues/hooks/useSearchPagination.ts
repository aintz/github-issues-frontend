import { useState, useEffect } from "react";
type useSearchPaginationProps = {
  setParams: (key: string, value: string) => void;
  isSearching: boolean;
  currentPage: number;
};
export default function useSearchPagination({
  setParams,
  isSearching,
  currentPage,
}: useSearchPaginationProps) {
  const [searchCursorByPage, setSearchCursorByPage] = useState<Record<number, string | null>>({
    1: null,
  });

  useEffect(() => {
    if (currentPage === 1) return;
    if (isSearching && !searchCursorByPage[currentPage]) {
      setParams("page", "1");
    }
  }, [isSearching, currentPage, setParams]);
  return { searchCursorByPage, setSearchCursorByPage };
}
