import { formatTime } from "../../../helpers/helpersFunctions";

type CommentProps = {
  author: {
    login: string | null;
    avatarUrl: string | null;
    url: string | null;
  };
  createdAt: string;
  bodyHTML: string | null;
  likes: number;
  isOtherComment?: boolean;
};

export default function Comment({
  author,
  createdAt,
  bodyHTML,
  likes,
  isOtherComment,
}: CommentProps) {
  const avatarSrc = author?.avatarUrl ?? "https://github.com/identicons/default.png";

  return (
    <div className="pt-4">
      <div className="flex w-full gap-4">
        <div className="shrink-0">
          <img
            src={avatarSrc}
            alt={author?.login ?? "unknown"}
            className="h-10 w-10 rounded-full"
          />
        </div>

        <div className="border-gh-muted bg-gh-bg min-w-0 flex-1 rounded-lg border">
          <div className="border-gh-muted bg-gh-bg-highlighted relative flex flex-wrap items-center gap-x-2 gap-y-1 rounded-t-lg border-b px-4 py-2">
            <p className="text-gh-text text-sm font-semibold">{author?.login ?? "unknown"}</p>
            <p className="text-gh-gray text-sm">opened {formatTime(createdAt)}</p>

            {isOtherComment && (
              <div className="bg-gh-muted absolute -top-[18px] left-[28px] h-[17px] w-[2px]" />
            )}
          </div>

          <div className="px-4 pt-4 pb-3">
            <div
              className="prose github-body-content max-w-none"
              dangerouslySetInnerHTML={{ __html: bodyHTML ?? "" }}
            />
          </div>

          {likes > 0 && (
            <p className="text-gh-text mb-2 ml-4 py-2 text-sm font-bold">
              <span className="bg-gh-tab-bg rounded-full px-2 py-1">👍 {likes}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
