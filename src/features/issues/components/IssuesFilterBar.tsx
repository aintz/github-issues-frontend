import SortDropdown from "./SortDropdown";
import StateFilters from "./StateFilters";

type IssuesFilterBarProps = {
  setParams: (key: string, value: string) => void;
  totalOpenCount: number;
  totalClosedCount: number;
  currentLoading: boolean;
  state: string;
  sort: string;
  order: string;
};
export default function IssuesFilterBar({
  setParams,
  totalOpenCount,
  totalClosedCount,
  currentLoading,
  state,
  sort,
  order,
}: IssuesFilterBarProps) {
  return (
    <div className="filter-container bg-gh-bg-highlighted">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex gap-0">
          <StateFilters
            isActive={state === "open"}
            label={"open"}
            onClick={() => setParams("state", "open")}
            totalCount={totalOpenCount}
            loading={currentLoading}
          />
          <StateFilters
            label={"closed"}
            isActive={state === "closed"}
            onClick={() => setParams("state", "closed")}
            totalCount={totalClosedCount}
            loading={currentLoading}
          />
        </div>

        <div>
          <SortDropdown onClick={setParams} currentSort={sort} currentOrder={order} />
        </div>
      </div>
    </div>
  );
}
