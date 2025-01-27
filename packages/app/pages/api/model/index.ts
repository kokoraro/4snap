import { string } from "joi";
import mongoose from "mongoose";
import { Schema, model, Document } from "mongoose";

const userSchema = new Schema({
  uId: { type: String, required: true },
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
});

export const UserModel = mongoose.models["User"] || model("User", userSchema);

const settingsSchema = new Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const SettingsModel =
  mongoose.models["Settings"] || model("Settings", settingsSchema);

const commandsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  command: { type: String, required: true },
  description: { type: String, required: true },
  public: { type: Boolean, default: false },
});

export const CommandsModel =
  mongoose.models["Commands"] || model("Commands", commandsSchema);

const sharedCommandsSchema = new Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
});

export const SharedCommandsModel =
  mongoose.models["SharedCommands"] ||
  model("SharedCommands", sharedCommandsSchema);
