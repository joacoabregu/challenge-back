import Joi from "joi";
export var codeSchema = Joi.string().length(8);
export var emailSchema = Joi.string().email();
export var numberSchema = Joi.number();
