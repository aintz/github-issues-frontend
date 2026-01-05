import { useCallback } from "react";

export default function useSearchHandlers(
  setSearchParams: (fn: (prev: URLSearchParams) => URLSearchParams) => void,
) {
  const clearSearchIfEmpty = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === "") {
        setSearchParams((prev) => {
          const params = new URLSearchParams(prev);
          params.delete("query");
          return params;
        });
      }
    },
    [setSearchParams],
  );

  const submitSearch = useCallback(
    (formData: FormData) => {
      const queryValue = formData.get("query")?.toString().trim() || "";

      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (queryValue) {
          params.set("query", queryValue);
        } else {
          params.delete("query");
        }
        return params;
      });
    },
    [setSearchParams],
  );

  return { clearSearchIfEmpty, submitSearch };
}
