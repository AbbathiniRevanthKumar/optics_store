import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/async.handler";
import ApiResponseHandler, { ApiError } from "../../utils/response.handler";
import * as FrameService from "../../services/inventory/Frame.service";
import { frameDetails } from "../../types/inventory.types";

type inventoryTypes = "frame" | "lens";
const allowedTypes: inventoryTypes[] = ["frame", "lens"];

const createFrame = async (data: frameDetails) => {
  if (
    !data.f_name ||
    !data.f_company ||
    !data.f_material ||
    !data.f_model ||
    !data.f_size
  ) {
    throw new ApiError("Provide mandatory fields", 400);
  }
  const existing = await FrameService.findDuplicateFrame(data);

  if (!existing) {
    const f_code: string = await FrameService.generateFrameCode();
    data.f_code = f_code;
  } else {
    data.f_code = existing.f_code;
  }
  data.updatedAt = new Date();
  return FrameService.crud.create(data);
};

export const createInventory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.params;
    const details = req.body;
    if (!type || !allowedTypes.includes(type as inventoryTypes))
      throw new ApiError(
        "type param is not valid or type param is missing",
        400
      );
    if (!details) {
      throw new ApiError("Provide Data", 400);
    }
    let data: any = [];
    switch (type) {
      case "frame": {
        data = await createFrame(details);
        break;
      }
    }

    return ApiResponseHandler.success(res, "inventory added", data, 201);
  }
);

export const getTotalInventory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.params;
    if (!type || !allowedTypes.includes(type as inventoryTypes))
      throw new ApiError(
        "type param is not valid or type param is missing",
        400
      );
    if (type === "frame") {
      const framesInventory = await FrameService.crud.getAll();
      return ApiResponseHandler.success(
        res,
        "Frames Inventory",
        framesInventory,
        200
      );
    }
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, id } = req.params;

    if (!type || !id || !allowedTypes.includes(type as inventoryTypes))
      throw new ApiError(
        "type param is not valid or type,id params are missing",
        400
      );
    if (type === "frame") {
      const frameDetails = await FrameService.crud.getById(parseInt(id));
      if (!frameDetails) throw new ApiError("Frame not exists", 400);
      return ApiResponseHandler.success(
        res,
        `Frame details of id : ${id}`,
        frameDetails,
        200
      );
    }
  }
);

const updateFrame = async (id: number, details: frameDetails) => {
  const data = await FrameService.crud.update(id, details);
  if (!data) {
    throw new ApiError("Failed to update product", 400);
  }
  return data;
};

export const updateProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, id } = req.params;
    const details = req.body;

    if (!type || !id || !allowedTypes.includes(type as inventoryTypes)) {
      throw new ApiError(
        "type param is not valid or type,id param are missing",
        400
      );
    }

    if (!details) {
      throw new ApiError("Provide Data", 400);
    }

    let data: any = [];
    switch (type) {
      case "frame": {
        data = await updateFrame(parseInt(id), details);
        break;
      }
    }

    return ApiResponseHandler.success(res, "Product updated", data, 201);
  }
);

export const removeProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, id } = req.params;
    if (!type || !id || !allowedTypes.includes(type as inventoryTypes)) {
      throw new ApiError(
        "type param is not valid or type param or id  is missing",
        400
      );
    }
    let data: any = [];
    switch (type) {
      case "frame": {
        data = await FrameService.crud.remove(parseInt(id));
        break;
      }
    }

    return ApiResponseHandler.success(res, "Product deleted", data, 200);
  }
);
