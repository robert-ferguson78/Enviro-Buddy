import Joi from "joi";

export const UserCredentialsSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const UserSpec = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const DealerSpec = {
  name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().allow("").optional(),
  email: Joi.string().allow("").optional(),
  website: Joi.string().allow("").optional(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
};

export const CountySpec = {
  county: Joi.string().required(),
};

export const CarTypeSpec = {
  carName: Joi.string().required(),
  carRange: Joi.string().required(),
  carType: Joi.string().required(),
};

export const EditCarTypeSpec = {
  carName: Joi.string().required(),
  carRange: Joi.string().required(),
  carType: Joi.string().required(),
  image: Joi.any().required(),
};
