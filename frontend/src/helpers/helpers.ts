export const calcPrice = (price: number, discount: number, qty: number = 1) => {
  const discountPrice = (price * discount) / 100;
  const finalPrice = price - discountPrice;
  return qty * finalPrice;
};
