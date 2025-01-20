import Dropdown from 'react-bootstrap/Dropdown';
import threedots from "../assets/3dots.png";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap";

function DropdownComponent({ editPost, deletePost}) {

  return (
    <Dropdown  className="d-inline mx-2">
      <Dropdown.Toggle as="img" src={threedots} id="dropdown-autoclose-true" className="w-[25px] h-[25px] cursor-pointer" alt="Menu" />
      
      <Dropdown.Menu>
      <Dropdown.Item onClick={() => editPost()} href="#">Edit</Dropdown.Item>
      <Dropdown.Item onClick={() => deletePost()} href="#">Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    
  );
}

export default DropdownComponent;
