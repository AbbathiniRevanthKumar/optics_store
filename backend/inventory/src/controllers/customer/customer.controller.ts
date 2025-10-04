import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/async.handler";
import ApiResponseHandler, { ApiError } from "../../utils/response.handler";
import type { customerDetailsType } from "../../types/customer.types";
import * as CustomerService from "../../services/customer/customer.service";

export const createCustomer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerDetails: customerDetailsType = req.body;
    if (!customerDetails) {
      throw new ApiError("Please provide the customer Data", 400);
    }

    if (
      !customerDetails.c_name ||
      !customerDetails.c_mobile_number ||
      !customerDetails.c_place
    ) {
      throw new ApiError("Please provide required details ", 400);
    }

    customerDetails.updatedAt = new Date();
    const customerData = await CustomerService.crud.create(customerDetails);

    return ApiResponseHandler.success(res, "Customer added", customerData, 201);
  }
);

export const allCustomers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerDetails = await CustomerService.crud.getAll();

    return ApiResponseHandler.success(
      res,
      "Customers Details",
      customerDetails,
      200
    );
  }
);

export const deleteCustomerById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) throw new ApiError("Provide customer ID", 400);
    const customerDetails = await CustomerService.crud.remove(Number(id));
    return ApiResponseHandler.success(
      res,
      "Deleted customer details",
      customerDetails,
      200
    );
  }
);
