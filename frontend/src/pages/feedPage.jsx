import Feed from "../components/feed";

export default function FeedPage({ isAuthenticated, isVisitor, setIsVisitor }) {
  return (
    <Feed
      isAuthenticated={isAuthenticated}
      isVisitor={isVisitor}
      setIsVisitor={setIsVisitor}
    />
  );
}
