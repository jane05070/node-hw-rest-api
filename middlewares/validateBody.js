import { HttpError } from "../helpers/index.js";

const validateBody = (contactSchema) => {
    const func = (req, res, next) => {
        const { error } = contactSchema.validate(req.body, { abortEarly: false });
               const emptyField = !Object.keys(req.body).length;
         
        if (emptyField) {
            throw HttpError (400, "missing fields")
        }
        if (error) {
            
            throw (HttpError (400, error.message))
        }
        next();
    };
    return func;
}


export default validateBody;