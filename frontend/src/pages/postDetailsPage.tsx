import PostDetails from "../components/postDetails";
import { PostDetailsProps } from "../types";

const PostDetailsPage:React.FC<PostDetailsProps> = ({ username }) => {
  return <PostDetails username={username} />;
}
export default PostDetailsPage;