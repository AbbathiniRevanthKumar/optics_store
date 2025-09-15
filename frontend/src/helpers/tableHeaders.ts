export const frameProductHeaders: Record<string, string> = {
  Id: "id",
  Code: "f_code",
  "Frame name": "f_name",
  "Company name": "f_company",
  size: "f_size",
  model: "f_model",
  material: "f_material",
  price: "f_price",
  qty: "f_qty",
  discount: "f_discount",
};

export const orderListHeaders: Record<string, string> = {
  ID: "orderId",
  Customer: "customerName",
  Description: "productsDesc",
  ["Total Price"]: "price",
  ["Ordered On"]: "orderedDate",
  ["Delivery Date"]: "orderDeliveryDate",
  ["Status"]: "orderStatus",
};
