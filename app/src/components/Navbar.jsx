import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className="bg-[#164E63]">
        <nav className="flex items-center justify-between p-4">
          <Link
            to="/"
            className="text-white font-semibold text-lg hover:underline"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-white font-semibold text-lg hover:underline"
          >
            Social Login
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
