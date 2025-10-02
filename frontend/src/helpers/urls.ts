type url = Record<string, string>;

export const urls: url = {
  apiGateway: "http://localhost:8000",
  login: "/auth/login",
  register: "/auth/register",
  userDetails: "/auth/me",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  //frames
  getAllFramesInfo: "/inventory/products/frame",
  createFrame: "/inventory/create/frame",
  removeFrame: "/inventory/product/frame",
  //orders
  getAllOrders: "/orders/allOrders",
  createOrder: "/orders/add",
  updateOrder: "/orders/updateOrder",
  deleteOrder: "/orders/removeOrder",

  //customers
  getAllCustomers: "/customer/all",
};
