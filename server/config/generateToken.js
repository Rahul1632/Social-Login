import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken';


const jwtSecret = process.env.JWT_SECRET;

export const generateJwtToken = (payloadData) => {
  try {
    const token = jwt.sign(
      {
        userId: payloadData._id,
        userName: payloadData.userName,
        email: payloadData.email,
      },
      jwtSecret,
      { expiresIn: '1h' }
    );
    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw error;
  }
};
