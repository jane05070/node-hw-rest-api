import express from 'express';
import contactsService from "../../models/contacts.js"
import { HttpError } from '../../helpers/index.js';
import Joi from "joi"

const router = express.Router();

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
        "any.required": `missing required name field`,
    }),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
        "any.required": `missing required email field`,
    }),
  phone: Joi.number().required().messages({
        "any.required": `missing required number field`,
    })
})

router.get('/', async (req, res, next) => {
   try {
  const result = await contactsService.listContacts();
  res.json(result);
}
  catch (eror) {
    res.status(500).json({
      message: "Server error"
    })
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`)
      
    }
    res.json(result);
  }
  catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
 try {
   const { error } = contactAddSchema.validate(req.body);
   if (error) {
     throw HttpError(404, error.message)
   }
   const result = await contactsService.addContact(req.body);
   res.status(201).json(result);
    } 
  catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`)
    }
    res, json({
      message: "Delete success"
    })
  }
  catch (error) {
    next(error);
  }
})

router.put('/:id', async (req, res, next) => {
  try {
        const { error } = movieAddSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const {id} = req.params;
        const result = await contactsService.updateContactById(id, req.body);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(result);
    }
    catch (error) {
        next(error);
    }
})

export default router;
