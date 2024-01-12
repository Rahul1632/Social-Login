import LogoutButton from "../components/Logout";
import { useUser } from "../context/index";

const Home = () => {
  const { userData } = useUser();
  
  return (
    <div className="bg-[#164E63] h-[85vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full mx-4 md:mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
          Welcome to Your Profile, {userData && userData.name}!
        </h2>
        {userData && (
          <div className="flex flex-col items-center">
            <img
              className="w-32 h-32 rounded-full mb-4 border-4 border-indigo-500"
              src={userData?.picture}
              alt="User"
            />
            <p className="text-lg mb-2 text-gray-700">
              <span className="font-bold">Name:</span> {userData.name}
            </p>
            <p className="text-lg mb-5 text-gray-700">
              <span className="font-bold">Email:</span> {userData.email}
            </p>
            <LogoutButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
