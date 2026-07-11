import Joi from "joi";

export const vehicleSchema = Joi.object({

    vehicleNumber: Joi.string()
        .required()
        .messages({
            "string.empty": "Vehicle Number is required",
            "any.required": "Vehicle Number is required",
        }),

    vehicleType: Joi.string()
        .valid("Truck", "Van", "Bus")
        .required(),

    brand: Joi.string().required(),

    model: Joi.string().required(),

    capacity: Joi.number()
        .positive()
        .required(),

    fuelType: Joi.string()
        .valid("Diesel", "Petrol", "Electric", "CNG")
        .required(),

    status: Joi.string()
        .valid("Available", "On Trip", "Maintenance")
        .default("Available")

});