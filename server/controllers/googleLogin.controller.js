import { User } from "../models/socialLogin.model.js";
import { generateJwtToken } from "../config/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import {
  USER_ALREADY_EXISTS,
  INTERNAL_ERROR,
  TOKEN_ID_REQUIRED,
  USERDATA_SAVED_SUCCESSFULLY,
} from "../utils/errors.js";

// Fetching client ID from environment variables
const clientId = process.env.CLIENT_ID;

// Creating an instance of OAuth2Client with the provided client ID
const authClient = new OAuth2Client(clientId);

// Controller function to save user data from social login
export const saveUserData = async (req, res) => {
  // Extracting tokenId and provider from the request body
  const { tokenId, provider } = req.body;
  try {
    // Checking if tokenId is present in the request
    if (!tokenId) {
      return res.status(400).json({ error: TOKEN_ID_REQUIRED });
    }

    // Verifying the ID token using the OAuth2Client based on the provider
    let ticket;
    if (provider === "google") {
      ticket = await authClient.verifyIdToken({
        idToken: tokenId,
        audience: clientId,
      });
    } // Add additional providers here if needed

    // Extracting user information from the token payload
    const { email, sub, name, picture } = ticket.getPayload();

    // Checking if the user already exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      // Creating a new user if not found and saving to the database
      const newUser = new User({
        id: sub,
        email,
        name: name,
        picture: picture,
        socialAccounts: [provider], // Add the provider to the socialAccounts array
      });

      await newUser.save();

      // Generating JWT token for the new user
      const jwtToken = generateJwtToken(newUser);

      // Responding with user data and success message
      return res.status(200).json({
        user: newUser,
        jwtToken,
        message: USERDATA_SAVED_SUCCESSFULLY,
      });
    } else {
      // update the socialAccounts if its not already there
      if (!user.socialAccounts.includes(provider)) {
        user.socialAccounts.push(provider);
        await user.save();
      }

      // Generate JWT token and respond with a user already exists message
      const jwtToken = generateJwtToken(user);
      return res.status(200).json({
        user,
        jwtToken,
        message: USER_ALREADY_EXISTS,
      });
    }
  } catch (error) {
    // Handling errors and responding with an internal server error message
    console.error("Error:", error.message);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};
