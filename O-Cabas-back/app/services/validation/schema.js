import Joi from 'joi';


/**
 * schema corresponding to the data expected from the API user
 */
const schema_create_user = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required().pattern(/[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/),
    password: Joi.string().required().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;"'?><,./\[\]\\\-]).{8,}$/),
    // repeat_password: Joi.ref('password'),
    phone_number: Joi.string().pattern(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/),
    date_of_birth: Joi.date().required(),
    address: Joi.string().required(),
    zip_code: Joi.number().integer().required(),
    city: Joi.string().required(),
    avatar: Joi.string(),
    is_admin: Joi.boolean(),
    status: Joi.boolean()
}).min(8).max(12).required();

const schema_login_user = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).length(2).required();

const schema_contact = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required().pattern(/[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/),
    message: Joi.string().required()

});

const order_schema = Joi.object({
    order: Joi.object({
      userId: Joi.number().integer().required(),
      status: Joi.bool().required(),
      orderTotalPrice: Joi.number().positive().required()
    }),
    products: Joi.array().items(
      Joi.object({
        id: Joi.number().integer().required(),
        price: Joi.number().positive().required(),
        quantity: Joi.number().integer().min(1).required(),
        producers_id: Joi.number().integer(),
        categories_id: Joi.number().integer(),
        name: Joi.string(),
        description: Joi.string(),
        unit_type: Joi.string(),
        picture: Joi.string(),
        status: Joi.boolean().required(),
        createdat: Joi.date().iso(),
        updatedat: Joi.date().allow(null)
      }).min(4).required()
    )
  });

export {schema_create_user, schema_login_user, schema_contact, order_schema};