import Joi from "joi";

export const codeSchema = Joi.string().length(8);

export const emailSchema = Joi.string().email();

export const numberSchema = Joi.number();
