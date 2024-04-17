import { MESSAGES } from '../constants/index.js';
import { BadRequestError } from '../errors/index.js';

const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError(MESSAGES.BadRequestError);
  }
  next();
};

export default testUser;
