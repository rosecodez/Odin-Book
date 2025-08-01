import Feed from "../components/feed";
import { FeedPageProps } from "../types";

const FeedPage: React.FC<FeedPageProps> = ({ isVisitor, setIsVisitor }) => {
  return (
    <Feed
      isVisitor={isVisitor}
      setIsVisitor={setIsVisitor}
    />
  );
};

export default FeedPage;
