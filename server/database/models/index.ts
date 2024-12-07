import { Model, InferSchemaType, FilterQuery } from "mongoose";
import { users } from "./user.model";
import { logs } from "./logs.model";
import { files } from "./files.model";
import { links } from "./links.model";
import { pricing } from "./pricing.model";
import { storage } from "./storage.model";

/**
 * Registry of all available database models
 * @const registeredModels
 */
export const registeredModels = {
  users,
  logs,
  files,
  links,
  pricing,
  storage,
} as const;

export type ModelsList = typeof registeredModels;
export type ModelNames = keyof ModelsList;

export type DocumentType<ModelType> = ModelType extends Model<infer T>
  ? T
  : never;

export type CreateDocType<Doc extends ModelNames> = Omit<
  DocumentType<ModelsList[Doc]>,
  "createdAt" | "updatedAt" | "_id"
>;

export type FilterQueryType<ModelName extends ModelNames> = FilterQuery<
  DocumentType<ModelsList[ModelName]>
>;

export type UpdateQueryType<Doc extends ModelNames> = Partial<
  Omit<DocumentType<ModelsList[Doc]>, "createdAt" | "updatedAt" | "_id">
>;
