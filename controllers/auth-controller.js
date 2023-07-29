import User from "../models/user.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const signup = async (req, res) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
  user: {
    email:  newUser.email,
    subscription: newUser.subscription,
  }
})
    
}

export default {
    signup: ctrlWrapper(signup),
}
