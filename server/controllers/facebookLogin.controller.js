import axios from "axios";
import passport from "passport";
import FacebookTokenStrategy from "passport-facebook-token";
import { generateJwtToken } from "../config/generateToken.js";
import { User } from "../models/socialLogin.model.js";
import {
  FACEBOOK_AUTH_ERROR,
  USER_ALREADY_EXISTS,
} from "../utils/errors.js";

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          id: profile.id,
          email: profile.email,
          picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
          provider: "facebook",
        };

        return done(null, user);
      } catch (error) {
        console.error(FACEBOOK_AUTH_ERROR, error);
        return done(error, false);
      }
    }
  )
);

export const facebookLoginAuth = async (req, res, next) => {
  const { accessToken, provider } = req.body;
  try {
    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const pictureUrl = `https://graph.facebook.com/${response.data.id}/picture?type=large`;

    const { name, id, email } = response.data;

    const user = await User.findOne({ email });

    if (!user) {
      const newUser = new User({
        id: id,
        email,
        name,
        picture: pictureUrl,
        socialAccounts: [provider],
      });
        const jwtToken = generateJwtToken(newUser);

        return res.status(200).json({
          user: newUser,
          jwtToken,
          message: USERDATA_SAVED_SUCCESSFULLY,
        });
      } else {
        if (!user.socialAccounts.includes(provider)) {
          user.socialAccounts.push(provider);
          await user.save();
        }
  
        const jwtToken = generateJwtToken(user);
        return res.status(200).json({
          user,
          jwtToken,
          message: USER_ALREADY_EXISTS,
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ error: INTERNAL_ERROR });
    }
  };