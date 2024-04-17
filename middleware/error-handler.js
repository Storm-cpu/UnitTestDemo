import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../constants/index.js'

const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || MESSAGES.BadRequest,
  }
  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
  }
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST
    defaultError.msg = ` Trường ${Object.keys(err.keyValue)} phải là duy nhất`
  }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg })
}

export default errorHandlerMiddleware
