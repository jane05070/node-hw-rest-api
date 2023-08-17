import User from "../models/user.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";
import Jimp from 'jimp';
import gravatar from 'gravatar';
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const { JWT_SECRET, BASE_URL } = process.env;

const avatarPath = path.resolve("public", "avatars");

const verificationToken = nanoid();


const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({ ...req.body, password: hashPassword, verificationToken, avatarURL });
    
    const verifiEmail = {
        to: email,
        subject: "Verify email",
        html: `<a href="${BASE_URL}/api/auth/verify/${verificationToken}" target="_blank">Click verify email</a>`
    }
    await sendEmail(verifiEmail);

    res.status(201).json({
  user: {
    email:  newUser.email,
    subscription: newUser.subscription,
  }
})
    
}

const signin = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    if (!user.verify) {
        throw HttpError(401, "User not found");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError (401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });


    res.json({
        token,
        user: { email: user.email, subscription: user.subscription },
    })

}

const getCurrent = (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    
    if (!user) {
        throw HttpError(404, "User not found")
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
    res.json({ message: "Verification successful" });

}

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw HttpError(404, "User not found");
    if (user.verify) throw HttpError(400, "Verification has already been passed");

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: 
            `<a href="${BASE_URL}/api/auth/verify/${user.verificationToken}" target="_blank">
              CLICK on this link to verify your email </a>`
    };

    await sendEmail(verifyEmail);

    res.json({ message: "Email resend" });
};

const signout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json()
    
}

const updateSubscriptionUser = async (req, res) => {
    const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, { ...req.body }, { new: true })
  res.json(result)
}

const updateAvatar = async (req, res) => {
    const { path: oldPath, filename } = req.file;
    const outputPath = path.resolve("temp", filename);
    try {
        const image = await Jimp.read(outputPath);
        await image.resize(250, 250);
        await image.writeAsync(outputPath);
        req.file.path = outputPath;
    } catch (error) {
        throw HttpError(400, `${error.message}`);
    }
    
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    const url = path.join("avatars", filename);

    const { _id } = req.user;

    const updateAvatar = await User.findByIdAndUpdate(
        _id,
        { avatarURL: url },
        {
            new: true,
        }
    );
    if (!updateAvatar) {
        throw HttpError(404, `User with id=${_id} is not found`);
    }
    res.json({
        avatarURL
    });
};


export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),



}



