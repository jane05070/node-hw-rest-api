import Joi from "joi"

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
        "any.required": `missing required name field`
    }),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
        "any.required": `missing required email field`
    }),
  phone: Joi.string().required().messages({
        "any.required": `missing required number field`
    })
})

export default {
  contactAddSchema,
}