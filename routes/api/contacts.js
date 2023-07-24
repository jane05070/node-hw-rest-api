import express from 'express';
import {contactsController} from "../../controllers/index.js";
import  contactsSchemas  from "../../schemas/contact-schemas.js";
import {validateBody} from "../../middlewares/index.js";

const router = express.Router();


router.get('/', contactsController.getAll);

// router.get('/:id', contactsController.getById);

// router.post('/', validateBody(contactsSchemas.contactAddSchema), contactsController.add);

// router.delete('/:id', contactsController.deleteById);

// router.put('/:id', validateBody(contactsSchemas.contactAddSchema), contactsController.updateById);

export default router;
