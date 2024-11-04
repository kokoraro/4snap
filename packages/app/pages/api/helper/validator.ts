import Joi from "joi";

export const CreateCliAndInAppCmdSchema = Joi.object({
  name: Joi.string().required(),
  command: Joi.string().required(),
  public: Joi.boolean().optional(),
});
