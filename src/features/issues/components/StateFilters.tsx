type StateFiltersProps = {
  paramState: "open" | "closed" | null;
  setParams: (key: string, value: string) => void;
  state: "open" | "closed";
  totalCount: number | null | undefined;
};

export default function StateFilters({
  paramState,
  setParams,
  state,
  totalCount,
}: StateFiltersProps) {
  const isActive = paramState ? paramState === state : state === "open";

  return (
    <button
      className={`${
        isActive ? "text-gh-text" : "text-gh-gray"
      } flex items-center gap-1 px-2 py-2 text-sm font-bold capitalize`}
      onClick={() => setParams("state", state)}
    >
      {state}
      <span className="bg-gh-tab-bg min-h-[28px] min-w-[45px] rounded-full px-2 py-1">
        {totalCount ?? ""}
      </span>
    </button>
  );
}
