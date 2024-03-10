// Import the Joi library for schema validation
import Joi from "joi";

// Define a schema for a valid ID, which can be either a string or an object
export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

// Define a schema for user credentials, which includes an email and a password
export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().example("admin@test.com").required(),
    password: Joi.string().example("secret123").required(),
  })
  .label("UserCredentials");

// Define a schema for users, which extends the user credentials schema with optional first name, last name, brand name, type, and name
export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").optional(),
  lastName: Joi.string().example("Simpson").optional(),
  brandName: Joi.string().example("Simpson").optional(),
  type: Joi.string().example("Simpson").optional(),
  name: Joi.string().example("name").optional(),
}).label("UserDetails");

// Define a schema for users with additional ID and version fields for Swagger documentation
export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserSpecUpdate = {
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().required(),
};

// Define a schema for an array of users
export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

// Define a schema for brand users, which includes a name, brand name, email, and password
export const BrandUserSpec = {
  name: Joi.string().required(),
  brandName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

// Define a schema for dealers, which includes a name, address, phone, email, website, latitude, and longitude
export const DealerSpec = Joi.object() .keys({
  name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().allow("").optional(),
  email: Joi.string().allow("").optional(),
  website: Joi.string().allow("").optional(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});

// Define a schema for dealers with additional ID and version fields for Swagger documentation
export const DealerSpecPlus = DealerSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("DealerDetailsPlus");

// Define a schema for counties, which includes a county name
export const CountySpec = {
  county: Joi.string().required(),
};

// Define a schema for car types, which includes a car name, car range, and car type
export const CarTypeSpec = {
  carName: Joi.string().required(),
  carRange: Joi.string().required(),
  carType: Joi.string().required(),
};

// Define a schema for editing car types, which extends the car type schema with an image
export const EditCarTypeSpec = {
  carName: Joi.string().required(),
  carRange: Joi.string().required(),
  carType: Joi.string().required(),
  image: Joi.any().required(),
};

// Define a schema for JWT authentication, which includes a success flag and a token
export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("Jwt Authentification");