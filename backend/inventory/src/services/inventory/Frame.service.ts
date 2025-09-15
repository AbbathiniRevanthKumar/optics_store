import { db } from "../../models";
import { frameDetails } from "../../types/inventory.types";
import crudService from "../crud.service";

export const findDuplicateFrame = async (details: frameDetails) => {
  const existing = await db.Frame.findOne({
    where: {
      f_name: details.f_name,
      f_company: details.f_company,
      f_size: details.f_size,
      f_model: details.f_model,
      f_material: details.f_material,
    },
  });
  return existing as any;
};

export const generateFrameCode = async () => {
  const lastFrame: any = await db.Frame.findOne({
    order: [["createdAt", "DESC"]],
  });
  let nextNumber = 1;
  if (lastFrame && lastFrame.f_code) {
    const lastCode = lastFrame.f_code.replace("FR", "");
    nextNumber = parseInt(lastCode, 10) + 1;
  }
  const f_code = `FR${String(nextNumber).padStart(5, "0")}`;
  return f_code;
};



export const crud = crudService(db.Frame);
