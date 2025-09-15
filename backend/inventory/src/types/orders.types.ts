export type orderDetails = {
  c_id: number;
  order_items: any;
  o_delivery_date: Date;
  o_order_date : Date;
  o_notes ?: string;
  o_status?: string;
};
