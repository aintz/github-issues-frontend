import { Link } from "react-router-dom";
import type { Issue } from "../../../types/types";
import { formatTime } from "../../../helpers/helpersFunctions";

type IssuesListItemProps = {
  issue: Issue;
  isLast: boolean;
};

export default function IssuesListItem({ issue, isLast }: IssuesListItemProps) {
  return (
    <li
      className={`border-gh-muted px-4 py-2 ${isLast ? "border-none" : "border-b"}`}
      key={issue.id}
    >
      <div className="issue-item flex gap-2">
        <div className="issue-icon"></div>
        <div>
          <div className="flex flex-wrap items-center gap-1">
            <Link to={`${issue.number}`} className="text-base font-medium">
              {issue.title}
            </Link>
            {issue.labels.nodes.length > 0 && (
              <div className="flex items-center gap-1">
                {issue.labels.nodes.map((label) => (
                  <span key={label.id} className="issue-label text-xs font-medium">
                    {label.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="mt-1 flex gap-1">
            <p className="text-gh-gray text-xs">#{issue.number}</p>
            <p className="text-gh-gray text-xs">·</p>
            <p className="text-gh-gray text-xs">{issue.author?.login ?? "unknown"}</p>
            <p className="text-gh-gray text-xs">opened {formatTime(issue.createdAt)} </p>
            <p className="text-gh-gray text-xs">·</p>
            <p className="text-gh-gray text-xs">
              {issue.updatedAt ? "Updated " + formatTime(issue.updatedAt) : ""}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
