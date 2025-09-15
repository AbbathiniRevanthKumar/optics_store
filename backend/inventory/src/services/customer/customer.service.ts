import { db } from "../../models";
import crudService from "../crud.service";

export const crud = crudService(db.Customer);
