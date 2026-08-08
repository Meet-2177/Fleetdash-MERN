import Joi from "joi";

export const geofenceSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty":
        "Geofence name is required",
      "any.required":
        "Geofence name is required",
    }),

  description: Joi.string()
    .allow("")
    .optional(),

  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required(),

  longitude: Joi.number()
    .min(-180)
    .max(180)
    .required(),

  radius: Joi.number()
    .min(100)
    .required()
    .messages({
      "number.min":
        "Radius must be at least 100 meters",
    }),

  status: Joi.string()
    .valid("Active", "Inactive")
    .default("Active"),
});