import { MESSAGES } from "../constants/index.js";
import { UnAuthenticatedError } from "../errors/index.js";

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return;

  throw new UnAuthenticatedError(MESSAGES.UnAuthenticatedError);
};

export default checkPermissions;
