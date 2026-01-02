export function formatTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);

  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute(s) ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour(s) ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day(s) ago`;
  } else if (diffInDays < 14) {
    return `${diffInDays} last week`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}
