import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import attachCookie from '../utils/attachCookie.js';
import { MESSAGES } from '../constants/index.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {                               //--> 1.1; 1.2; 1.3
    throw new BadRequestError(MESSAGES.FormNotValidate);            //--> 2
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {                                          //--> 3
    throw new BadRequestError(MESSAGES.EmailIsExit);
    //throw new BadRequestError(MESSAGES.EmailIsExit);            //--> 4
  }

  const user = await User.create({ name, email, password });        //--> 5
  const token = user.createJWT();
  attachCookie({ res, token });
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },

    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {                                        //--> 1
    throw new BadRequestError(MESSAGES.FormNotValidate);            //--> 2
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {                                                      //--> 3
    throw new UnAuthenticatedError(MESSAGES.IsCredential);          //--> 4
    //throw new UnAuthenticatedError(MESSAGES.IsCredential);          //--> 4
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {                                         //--> 5
    throw new UnAuthenticatedError(MESSAGES.IsCredential);          //--> 6
  }

  const token = user.createJWT();                                   //--> 7
  attachCookie({ res, token });
  user.password = undefined;

  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError(MESSAGES.FormNotValidate);
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: MESSAGES.LogOut });
};

export { register, login, updateUser, getCurrentUser, logout };
