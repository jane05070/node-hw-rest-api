import { HttpError } from "../helpers/index.js";


const isEmptyBody = (req, res, next) => {
  if (req.method === "PATCH") {
    const { length } = Object.keys(req.body);
    if (!length) {
      return res.status(400).json({ message: "missing field favorite" });
      
    }
  }

  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpError(400, "missing fields"));
  }
  next();
};

export default isEmptyBody;
