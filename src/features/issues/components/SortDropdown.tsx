import { useState } from "react";

type SortDropdownProps = {
  onClick: (label: string, param: string) => void;
  currentSort: string;
  currentOrder: string;
};

export default function SortDropdown({ onClick, currentSort, currentOrder }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick(label: string, param: string) {
    onClick(label, param);
    setIsOpen(false);
  }

  const dropDownLabel =
    currentSort === "created"
      ? "Created on"
      : currentSort === "updated"
        ? "Last updated"
        : "Total comments";

  const orderLabel =
    currentOrder === "asc" ? (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="text-gh-gray h-4 w-4 shrink-0"
        aria-hidden="true"
        data-testid="asc-icon"
      >
        <path d="m12.927 2.573 3 3A.25.25 0 0 1 15.75 6H13.5v6.75a.75.75 0 0 1-1.5 0V6H9.75a.25.25 0 0 1-.177-.427l3-3a.25.25 0 0 1 .354 0ZM0 12.25a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75Zm0-4a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 8.25Zm0-4a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 4.25Z"></path>
      </svg>
    ) : (
      <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
        fill="currentColor"
        className="text-gh-gray"
        aria-hidden="true"
        data-testid="desc-icon"
      >
        <path d="M0 4.25a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 4.25Zm0 4a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 8.25Zm0 4a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75ZM13.5 10h2.25a.25.25 0 0 1 .177.427l-3 3a.25.25 0 0 1-.354 0l-3-3A.25.25 0 0 1 9.75 10H12V3.75a.75.75 0 0 1 1.5 0V10Z"></path>
      </svg>
    );

  return (
    <div className="relative flex w-[177px] items-center gap-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="text-gh-text flex w-[177px] items-center justify-between rounded-md px-2 py-2 text-sm font-bold"
      >
        {orderLabel}
        <span>{dropDownLabel}</span>
        <svg
          viewBox="0 0 16 16"
          width="18"
          height="18"
          fill="currentColor"
          className="text-gh-gray"
          aria-hidden="true"
        >
          <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="border-gh-muted bg-gh-header-bg absolute top-full left-0 mt-2 w-48 w-[177px] rounded-lg border-2 pt-3 shadow-md">
          <div className="border-b-gh-muted border-b px-3 pb-2">
            <p className="text-gh-gray text-xs">Sort by</p>
            <ul className="py-1">
              <li
                onClick={() => handleClick("sort", "created")}
                className="mb-2 flex items-center justify-start py-1.5 pl-[5px] text-sm"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={`text-gh-gray mr-2 h-4 w-4 ${currentSort === "created" ? "opacity-100" : "opacity-0"}`}
                >
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                </svg>
                Created on
              </li>
              <li
                onClick={() => handleClick("sort", "updated")}
                className="mb-2 flex items-center justify-start py-1.5 pl-[5px] text-sm"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={`text-gh-gray mr-2 h-4 w-4 ${currentSort === "updated" ? "opacity-100" : "opacity-0"}`}
                >
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                </svg>
                Last updated
              </li>
              <li
                onClick={() => handleClick("sort", "comments")}
                className="mb-2 flex items-center justify-start py-1.5 pl-[5px] text-sm"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={`text-gh-gray mr-2 h-4 w-4 ${currentSort === "comments" ? "opacity-100" : "opacity-0"}`}
                >
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                </svg>
                Total comments
              </li>
            </ul>
          </div>
          <div className="border-b-gh-muted border-b px-3 py-2 pb-2">
            <p className="text-gh-gray text-xs">Order</p>
            <ul className="py-1">
              <li
                onClick={() => handleClick("order", "asc")}
                className="mb-2 flex items-center justify-start py-1.5 pl-[5px] text-sm"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={`text-gh-gray mr-2 h-4 w-4 ${currentOrder === "asc" ? "opacity-100" : "opacity-0"}`}
                >
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                </svg>
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="text-gh-gray mr-1 h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="m12.927 2.573 3 3A.25.25 0 0 1 15.75 6H13.5v6.75a.75.75 0 0 1-1.5 0V6H9.75a.25.25 0 0 1-.177-.427l3-3a.25.25 0 0 1 .354 0ZM0 12.25a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75Zm0-4a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 8.25Zm0-4a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 4.25Z"></path>
                </svg>
                Oldest
              </li>
              <li
                onClick={() => handleClick("order", "desc")}
                className="mb-2 flex items-center justify-start py-1.5 pl-[5px] text-sm"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={`text-gh-gray mr-2 h-4 w-4 ${currentOrder === "desc" ? "opacity-100" : "opacity-0"}`}
                >
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                </svg>
                <svg
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="text-gh-gray mr-1"
                  aria-hidden="true"
                >
                  <path d="M0 4.25a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 4.25Zm0 4a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 8.25Zm0 4a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75ZM13.5 10h2.25a.25.25 0 0 1 .177.427l-3 3a.25.25 0 0 1-.354 0l-3-3A.25.25 0 0 1 9.75 10H12V3.75a.75.75 0 0 1 1.5 0V10Z"></path>
                </svg>
                Newest
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
