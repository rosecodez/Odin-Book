import Profile from "../components/profile";

export default function ProfilePage({ isVisitor, setIsVisitor }) {
  return <Profile isVisitor={isVisitor} setIsVisitor={setIsVisitor} />;
}
