import { memo } from "react";

type StateFiltersProps = {
  label: "open" | "closed";
  isActive: boolean;
  totalCount?: number;
  onClick: () => void;
  loading: boolean;
};

function StateFilters({ label, isActive, onClick, totalCount, loading }: StateFiltersProps) {
  return (
    <button
      className={`${
        isActive ? "text-gh-text" : "text-gh-gray"
      } flex items-center gap-1 px-2 py-2 text-sm font-bold capitalize`}
      onClick={onClick}
    >
      {label}

      <span className="bg-gh-tab-bg min-h-[28px] min-w-[45px] rounded-full px-2 py-1">
        {loading ? <span /> : (totalCount ?? 0)}
      </span>
    </button>
  );
}

export default memo(StateFilters);
