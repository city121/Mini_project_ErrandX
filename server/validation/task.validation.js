import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(5).required(),
  status: Joi.string().valid("pending", "in-progress", "completed"),
  reward: Joi.number().min(0),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(5),
  status: Joi.string().valid("pending", "in-progress", "completed"),
  reward: Joi.number().min(0),
});
