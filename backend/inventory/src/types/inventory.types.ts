export type frameDetails = {
  f_code?: string | undefined;
  f_name: string;
  f_company: string;
  f_size: "small" | "medium" | "large";
  f_model: "full-frame" | "half-frame" | "frame-less";
  f_material: "metal" | "fiber";
  f_price: Number;
  f_qty: Number;
  f_discount: Number;
  updatedAt ?: Date;
};
