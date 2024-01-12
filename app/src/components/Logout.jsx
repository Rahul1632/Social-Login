import { useNavigate } from "react-router-dom";
import { useUser } from "../context/index";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { storeUserData } = useUser();

  const handleLogout = () => {
    storeUserData(null);
    navigate("/login");
  };

  return (
    <>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
        >
          Logout
        </button>
    </>
  );
};

export default LogoutButton;
