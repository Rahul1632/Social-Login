import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/index";
import { toast, ToastContainer } from "react-toastify";
import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";
import { FacebookProvider, LoginButton } from "react-facebook";
import { LoginSocialLinkedin } from "reactjs-social-login";
import {
  LinkedInLoginButton,
  GoogleLoginButton,
  FacebookLoginButton,
} from "react-social-login-buttons";

const handleToast = (message, type = "info") => {
  toast[type](message, {
    position: "top",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const handleGoogleResponse = async (response, storeUserData, navigate) => {
  if (response.error) {
    handleToast("Error during Google login. Please try again.", "error");
    return;
  }

  const { idpId } = response.tokenObj;
  const { tokenId } = response;

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/user/google-login`,
      { tokenId, provider: idpId }
    );

    const { user, message, jwtToken } = data;
    if (user && jwtToken) {
      storeUserData(user);
      handleToast(message, "success");
      navigate("/");
    } else {
      handleToast(message);
    }
  } catch (error) {
    handleToast("Error during login. Please try again.", "error");
  }
};

const handleFacebookResponse = async (response, storeUserData, navigate) => {
  try {
    const { accessToken, graphDomain } = response.authResponse;
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/user/facebook-login`,
      { accessToken, provider: graphDomain }
    );
    const { user, message , jwtToken } = data;
    if (user && jwtToken) {
      storeUserData(user);
      handleToast(message, "success");
      navigate("/");
    } else {
      handleToast(message);
    }
  } catch (error) {
    console.error("Facebook login error:", error.message);
  }
};

const handleLinkedInResponse = async (response, storeUserData, navigate) => {
  try {
    const { provider } = response;
    const { access_token } = response.data;
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/user/linkedIn-login`,
      {
        accessToken: access_token,
        provider,
      }
    );
    const { user, message ,jwtToken } = data;
    if (user && jwtToken) {
      storeUserData(user);
      handleToast(message, "success");
      navigate("/");
    } else {
      handleToast(message);
    }
  } catch (error) {
    console.error("LinkedIn login error:", error.message);
  }
};

const GoogleLoginButtonWrapper = ({ onSuccess, onFailure }) => (
  <GoogleLogin
    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    onSuccess={onSuccess}
    onFailure={onFailure}
    cookiePolicy={"single_host_origin"}
    className="w-full"
    render={(renderProps) => <GoogleLoginButton {...renderProps} />}
  />
);

const FacebookLoginButtonWrapper = ({ onError, onSuccess }) => (
  <FacebookProvider appId={import.meta.env.VITE_FACEBOOK_CLIENT_ID}>
    <LoginButton
      onError={onError}
      onSuccess={onSuccess}
      scope="email"
      className="mt-4 w-full"
    >
      <FacebookLoginButton scope="email" />
    </LoginButton>
  </FacebookProvider>
);

const LinkedInLoginButtonWrapper = ({ onResolve, onReject }) => (
  <LoginSocialLinkedin
    isOnlyGetToken
    client_id={import.meta.env.VITE_LINKEDIN_CLIENT_ID}
    client_secret={import.meta.env.VITE_LINKEDIN_SECRET_ID}
    redirect_uri={import.meta.env.VITE_LINKEDIN_REDIRECT_URL}
    scope="profile openid email w_member_social"
    onResolve={onResolve}
    onReject={onReject}
    className="mt-4"
  >
    <LinkedInLoginButton />
  </LoginSocialLinkedin>
);

const SocialLoginForm = () => {
  const { storeUserData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    gapi.load("auth2", () => {
      gapi.auth2.init({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: import.meta.env.VITE_GOOGLE_API_USERINFO,
      });
    });
  }, []);

  return (
    <div className="h-[90vh] flex items-center justify-center bg-[#164E63]">
      <div className="w-full max-w-md p-6 bg-gray-300 rounded-md shadow-md">
        <GoogleLoginButtonWrapper
          onSuccess={(response) =>
            handleGoogleResponse(response, storeUserData, navigate)
          }
          onFailure={(response) =>
            handleGoogleResponse(response, storeUserData, navigate)
          }
        />

        <FacebookLoginButtonWrapper
          onError={(error) =>
            console.error("Facebook login error:", error.message)
          }
          onSuccess={(response) =>
            handleFacebookResponse(response, storeUserData, navigate)
          }
        />

        <LinkedInLoginButtonWrapper
          onResolve={(response) =>
            handleLinkedInResponse(response, storeUserData, navigate)
          }
          onReject={(err) => console.log(err)}
        />

        <ToastContainer />
      </div>
    </div>
  );
};

export default SocialLoginForm;
