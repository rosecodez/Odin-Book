import Feed from "../components/feed";

export default function FeedPage({ isVisitor, setIsVisitor }) {
  return <Feed isVisitor={isVisitor} setIsVisitor={setIsVisitor} />;
}
