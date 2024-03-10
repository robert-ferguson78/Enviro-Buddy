import Boom from "@hapi/boom";

// This function logs a validation error and throws a bad request error with the validation error message
export function validationError(request, h, error) {
  console.error("Validation error:", error.message);
  throw Boom.badRequest(error.message); // Or any appropriate error response
}