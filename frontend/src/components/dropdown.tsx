import Dropdown from "react-bootstrap/Dropdown";
import threedots from "../assets/3dots.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { DropdownProps } from "../../../types/dropdown";

const DropdownComponent: React.FC<DropdownProps> = ({ postId, editPost, deletePost }) => {
  return (
    <Dropdown className="d-inline mx-2">
      <Dropdown.Toggle
        as="img"
        src={threedots}
        id="dropdown-autoclose-true"
        className="w-[25px] h-[25px] cursor-pointer"
        alt="Menu"
      />
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => editPost(postId)}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={() => deletePost(postId)}>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownComponent;
