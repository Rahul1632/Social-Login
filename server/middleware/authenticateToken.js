// this is the code that we can use to authenticate user if he make any api request to the server
import jwt from "jsonwebtoken";
import { NOT_AUTHORIZED } from "../utils/errors";

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const authenticateToken = (req, res, next) => {
  const jwtToken = req.headers.authorization;

  if (jwtToken && jwtToken.startsWith("Bearer ")) {
    const token = jwtToken.split(' ')[1];
    const decodedToken = verifyToken(token);

    if (decodedToken) {
      req.user = decodedToken;
      next();
      return;
    }
  }
  res.status(401).json({ message: NOT_AUTHORIZED });
};

export default verifyToken;
