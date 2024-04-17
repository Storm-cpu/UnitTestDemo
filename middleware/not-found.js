import { MESSAGES } from "../constants/index.js"

const notFoundMiddleware = (req, res) =>
  res.status(404).send(MESSAGES.NotFound)

export default notFoundMiddleware
