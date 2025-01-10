import Joi from "joi";

export const CreateCliAndInAppCmdSchema = Joi.object({
  name: Joi.string().required(),
  command: Joi.string().required(),
  description: Joi.string().required().max(60),
  public: Joi.boolean().optional(),
});

export const DeleteCliAndInAppCmdSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().optional(),
});

export const ShareCommandSchema = Joi.object({
  username: Joi.string().required(),
  cmdName: Joi.string().required(),
});
