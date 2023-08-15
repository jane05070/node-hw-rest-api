import Joi from "joi"
import emailRegexp from "../constants/user-constants.js";

const userSignupSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const userEmailVerifySchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
}).messages({
    "any.required": "missing required field email",
})

export default {
    userSignupSchema,
    userSigninSchema,
    userEmailVerifySchema,
}