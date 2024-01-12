import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
// import FacebookLoginForm from "./pages/FacebookLoginForm";
import Home from "./pages/Home";
import { UserProvider, useUser } from "./context/index";
import SocialLoginForm from "./pages/SocialLoginForm";

const App = () => {
  return (
    <div className="w-[100%] h-[100%] flex flex-col">
      <UserProvider>
        <BrowserRouter>
          <Navbar />
          <div className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<PrivateRoute component={<Home />} />} />
              {/* <Route path="/login" element={<FacebookLoginForm />} /> */}
              <Route path="/login" element={<SocialLoginForm />} />
            </Routes>
          </div>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
};

const PrivateRoute = ({ component }) => {
  const { userData } = useUser();
  if (!userData) {
    return <Navigate to="/login" />;
  }
  return component;
};

export default App;
