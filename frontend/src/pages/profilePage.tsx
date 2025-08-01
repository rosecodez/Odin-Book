import Profile from "../components/profile";
import { ProfilePageProps } from "../types";

const ProfilePage:React.FC<ProfilePageProps> = ({ isVisitor, setIsVisitor }) => {
  return <Profile isVisitor={isVisitor} setIsVisitor={setIsVisitor} />;
}

export default ProfilePage;