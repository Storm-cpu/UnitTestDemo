import jwt from 'jsonwebtoken';
import { UnAuthenticatedError } from '../errors/index.js';
import { MESSAGES } from '../constants/index.js';

const auth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new UnAuthenticatedError(MESSAGES.AuthenticatedError);
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const testUser = payload.userId === '65fb0aa4c0dbe899a833e451';
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnAuthenticatedError(MESSAGES.AuthenticatedError);
  }
};

export default auth;
