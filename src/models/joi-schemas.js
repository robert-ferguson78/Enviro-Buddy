import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

// spec for users credentials
export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().example("admin@test.com").required(),
    password: Joi.string().example("secret123").required(),
  })
  .label("UserCredentials");

// spec for users
export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").optional(),
  lastName: Joi.string().example("Simpson").optional(),
  brandName: Joi.string().example("Simpson").optional(),
  type: Joi.string().example("Simpson").optional(),
  name: Joi.string().example("name").optional(),
}).label("UserDetails");

// adding Id and V for swagger
export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const BrandUserSpec = {
  name: Joi.string().required(),
  brandName: Joi.string().required(),
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

// adding Id and V for swagger
export const DealerSpecPlus = DealerSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("DealerDetailsPlus");

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

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("Jwt Authentification");