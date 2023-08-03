import express from 'express';
import {contactsController} from "../../controllers/index.js";
import  contactsSchemas  from "../../schemas/contact-schemas.js";
import { isEmptyBody, isValidId, authentificate } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";


const router = express.Router();

router.use(authentificate);
    
router.get('/',  contactsController.getAll);

 router.get('/:id',  isValidId, contactsController.getById);

 router.post('/', isEmptyBody, validateBody(contactsSchemas.contactAddSchema), contactsController.add);

 router.delete('/:id',  isValidId, contactsController.deleteById);

router.put('/:id',  isValidId, isEmptyBody, validateBody(contactsSchemas.contactAddSchema), contactsController.updateById);
 
router.patch('/:id/favorite', isValidId, isEmptyBody, validateBody(contactsSchemas.contactUpdateFavoriteSchema), contactsController.updateFavorite);

export default router;
