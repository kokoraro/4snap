import Joi from "joi";

export const CreateCliAndInAppCmdSchema = Joi.object({
  name: Joi.string().required(),
  command: Joi.string().required(),
  public: Joi.boolean().optional(),
});

export const DeleteCliAndInAppCmdSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().optional(),
});
