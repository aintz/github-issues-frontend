import { useState, useEffect } from "react";
type useListPaginationProps = {
  setParams: (key: string, value: string) => void;
  isSearching: boolean;
  currentPage: number;
};
export default function useListPagination({
  setParams,
  isSearching,
  currentPage,
}: useListPaginationProps) {
  const [cursorByPage, setCursorByPage] = useState<Record<number, string | null>>({ 1: null });

  useEffect(() => {
    if (currentPage === 1) return;
    if (!isSearching && !cursorByPage[currentPage]) {
      setParams("page", "1");
    }
  }, [currentPage, cursorByPage, setParams]);

  return { cursorByPage, setCursorByPage };
}
