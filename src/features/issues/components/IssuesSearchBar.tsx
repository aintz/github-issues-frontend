type IssuesSearchBarProps = {
  onSubmit: (formData: FormData) => void;
  defaultValue?: URLSearchParams;
};

export default function IssuesSearchBar({ onSubmit, defaultValue }: IssuesSearchBarProps) {
  return (
    <form className="relative w-full" action={onSubmit}>
      <input
        type="search"
        name="query"
        defaultValue={defaultValue?.get("query") ?? ""}
        placeholder="Search issues"
        className="border-gh-muted w-full rounded-lg border p-6 py-2 pr-10 pl-4 text-left text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        className="text-gh-gray bg-gh-tab-bg absolute inset-y-0 right-0 flex items-center rounded-tr-lg rounded-br-lg px-3"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
      </button>
    </form>
  );
}
