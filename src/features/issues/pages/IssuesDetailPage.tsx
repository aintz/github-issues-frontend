import { useParams } from "react-router-dom";

export default function IssuesDetailPage() {
  const { number } = useParams();

  return <p>the issue number is:{number}</p>;
}
