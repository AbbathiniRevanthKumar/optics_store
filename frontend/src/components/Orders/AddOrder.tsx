import FormField from "../Helpers/FormField";
import { useEffect, useMemo, useState } from "react";
import { apigateway, handleApiError } from "../../config/axios.config";
import { urls } from "../../helpers/urls";
import { Minus, Plus, Trash } from "lucide-react";
import { toast } from "react-toastify";
import CustomToaster from "../Helpers/CustomToaster";
import Spinner from "../Loaders/Spinner";

type Props = {
  completed: any;
  orderData: any;
};

// Unified type for inventory items
type InventoryItem = {
  id: number;
  type: "frames" | "lens";
  f_code?: string;
  f_name?: string;
  f_price?: number;
  f_qty?: number;
  f_discount?: number;
  l_code?: string;
  l_name?: string;
  l_qty?: number;
  l_price?: number;
  l_discount?: number;
};

type OrderItem = {
  id: number;
  Type: string;
  Name: string;
  Quantity: number;
  Price: number;
  Discount: number;
  edit: boolean;
};

const orderItemHeaders = [
  "Type",
  "Name",
  "Quantity",
  "Price",
  "Discount",
  "Actions",
];

// const orderItemsTemplate: OrderItem[] = [];

const AddOrder = ({ completed, orderData }: Props) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const [orderDate, setOrderDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [deliveryDate, setDeliveryDate] = useState<string>(
    (() => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      return date.toISOString().split("T")[0];
    })()
  );
  const [notes, setNotes] = useState<string>("");
  const [error, setErrors] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data } = await apigateway.get(urls.getAllFramesInfo);
        setInventory(data.data);
      } catch (error) {
        console.log(error);
        setInventory([]);
      }
    };
    fetchInventory();
  }, []);

  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        const { data } = await apigateway.get(urls.getAllCustomers);
        setCustomers(data.data);
      } catch (error) {
        console.log(error);
        setCustomers([]);
      }
    };
    fetchCustomersData();
  }, []);

  useEffect(() => {
    if (Object.keys(orderData).length === 0 || inventory.length === 0) return;
    setLoading(true);

    handleSelectCustomer(orderData.customer);

    const itemsToList: OrderItem[] = [];
    orderData.order_items.map((item: any) => {
      const itemToList = getItemBody(item.frame, item.p_qty);
      itemsToList.push(itemToList);
    });

    setOrderId(orderData.id);
    setOrderItems(itemsToList);
    setDeliveryDate(orderData.o_delivery_date);
    setOrderDate(orderData.o_order_date);
    setOrderStatus(orderData.o_status);
    setNotes(orderData.o_notes);
    setIsEdit(true);
    setLoading(false);
  }, [orderData, inventory]);

  const filteredItems = inventory.filter((item) => {
    const code = item.f_code || item.l_code || "";
    const name = item.f_name || item.l_name || "";
    return (
      code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredCustomers = customers.filter((customer) => {
    const name = customer.c_name;
    const mobileNumber = customer.c_mobile_number;

    return (
      name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      mobileNumber.toLowerCase().includes(customerSearchQuery.toLowerCase())
    );
  });

  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item);
    const name = item.f_name || item.l_name || "";
    setSearchQuery(name);
  };

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setCustomerSearchQuery(customer.c_name);
  };

  const checkItemRequiredQuantityInInventory = (item: OrderItem) => {
    const inventoryItem: any = inventory.find(
      (inventoryItem) => inventoryItem.id === item.id
    );
    
    if (!inventoryItem) return false;

    return inventoryItem.f_qty >= item.Quantity + 1;
  };

  const getItemBody = (selectedItem: any, item_qty: number = 1) => {
    const id = selectedItem.id;
    const name = selectedItem.f_name || selectedItem.l_name || "";
    const price = selectedItem.f_price ?? selectedItem.l_price ?? 0;
    const discount = selectedItem.f_discount ?? selectedItem.l_discount ?? 0;
    const type = selectedItem.f_name ? "Frame" : "Lens";

    const newItem: OrderItem = {
      id: id,
      Type: type,
      Name: name,
      Quantity: item_qty,
      Price: price,
      Discount: discount,
      edit: false,
    };

    return newItem;
  };

  const addItem = (selectedItem: any) => {
    if (!selectedItem) return;

    const newItem = getItemBody(selectedItem);
    setOrderItems((prevItems) => {
      const itemPresent = prevItems.find((item) => item.id === newItem.id);
      if (!itemPresent) {
        return [...prevItems, newItem];
      } else {
        if (!checkItemRequiredQuantityInInventory(itemPresent)) {
          toast(
            <CustomToaster
              type="error"
              message="Selected Item Quantity is low"
            />
          );
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, Quantity: item.Quantity + 1 }
            : item
        );
      }
    });

    setSelectedItem(null);
    setSearchQuery("");
  };

  const deleteItem = (id: number) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementQuantity = (item: OrderItem) => {
    if (!checkItemRequiredQuantityInInventory(item)) {
      toast(
        <CustomToaster type="error" message="Selected Item Quantity is low" />
      );
      return;
    }
    setOrderItems((prev) =>
      prev.map((orderItem) =>
        orderItem.id === item.id
          ? { ...orderItem, Quantity: orderItem.Quantity + 1 }
          : orderItem
      )
    );
  };

  const decrementQuantity = (id: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === id && item.Quantity > 1
          ? { ...item, Quantity: item.Quantity - 1 }
          : item
      )
    );
  };

  const { subTotal, totalDiscount, totalAmount } = useMemo(() => {
    const subTotal = orderItems.reduce(
      (sum, item) => sum + item.Price * item.Quantity,
      0
    );
    const totalDiscount = Number(
      orderItems
        .reduce(
          (sum, item) =>
            sum + (item.Price * item.Quantity * item.Discount) / 100,
          0
        )
        .toFixed(2)
    );
    const totalAmount = (subTotal - totalDiscount).toFixed(2);
    return { subTotal, totalDiscount, totalAmount };
  }, [orderItems]);

  const saveOrder = async () => {
    let hasError = false;
    let newErrors = { ...error };

    // Check customer
    if (!selectedCustomer) {
      newErrors["customer"] = "Select a customer";
      hasError = true;
    } else {
      newErrors["customer"] = null;
    }

    // Check order items
    if (orderItems.length === 0) {
      newErrors["orderItems"] = "Add at least one order item";
      hasError = true;
    } else {
      newErrors["orderItems"] = null;
    }

    // Check order date
    if (!orderDate) {
      newErrors["orderDate"] = "Order date is required";
      hasError = true;
    } else {
      newErrors["orderDate"] = null;
    }

    // Check delivery date
    if (!deliveryDate) {
      newErrors["deliveryDate"] = "Delivery date is required";
      hasError = true;
    } else {
      newErrors["deliveryDate"] = null;
    }

    setErrors(newErrors);

    if (hasError) {
      toast(
        <CustomToaster type="error" message="Please fill all required fields" />
      );
      return;
    }

    const orderItemsList = orderItems.map((item) => {
      return {
        id: item.id,
        quantity: item.Quantity,
        type:
          item.Type === "Frame" ? "frames" : item.Type === "Lens" ? "lens" : "",
      };
    });

    const orderBody = {
      c_id: selectedCustomer.id,
      order_items: orderItemsList,
      o_order_date: orderDate,
      o_delivery_date: deliveryDate,
      o_status: orderStatus,
      o_notes: notes,
    };

    try {
      let saveOrderResponse = null;
      if (isEdit && orderId) {
        saveOrderResponse = await apigateway.put(
          `${urls.updateOrder}/${orderId}`,
          orderBody
        );
      } else {
        saveOrderResponse = await apigateway.post(urls.createOrder, orderBody);
      }
      completed(true);
      toast(
        <CustomToaster
          type="success"
          message={saveOrderResponse?.data?.message || "Ordered!"}
        />
      );
    } catch (error) {
      console.log(error);
      const message = handleApiError(error, "Error at saving new order");
      toast(<CustomToaster message={message} type="error" />);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Scrollable Content */}
      {loading && <Spinner />}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Customer Details */}
        <div className="flex flex-col gap-3">
          <div className="font-semibold text-lg bg-background py-1 rounded-t-lg px-3">
            Customer Details
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-3 items-center justify-between px-4">
            <div className="relative basis-full md:basis-3/5">
              <FormField
                field={{ type: "text", name: "customer" }}
                value={customerSearchQuery}
                onChange={(_name, value) => {
                  setCustomerSearchQuery(value as string);
                  setSelectedCustomer(null);
                  setErrors({ ...error, ["customer"]: null });
                }}
              />
              {error.customer && (
                <div className="text-error text-sm mt-1">{error.customer}</div>
              )}
              {!selectedCustomer && customerSearchQuery && (
                <div className="absolute bg-white border-2 border-border text-text-primary mt-1 w-full max-h-60 z-10 rounded-lg shadow-md overflow-hidden">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => {
                      const id = customer.id;
                      const name = customer.c_name;
                      const number = customer.c_mobile_number;
                      return (
                        <div
                          key={id}
                          className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          {`${name}-${number}`}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-2 text-gray-500">No items found</div>
                  )}
                </div>
              )}
            </div>
            {!isEdit && (
              <div className="w-full md:w-auto">
                <button
                  className="bg-primary/80 hover:bg-primary-hover transition duration-150 ease-in-out hover:text-text-primary px-3 rounded-lg py-2.5 cursor-pointer w-full md:w-auto"
                  onClick={() => {}}
                >
                  + Add New Customer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search & Add Item */}
        <div className="flex flex-col gap-3 mt-6">
          <div className="font-semibold text-lg bg-background py-1 rounded-t-lg px-3">
            Add Order Item
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-3 items-center justify-between px-4">
            <div className="relative basis-full md:basis-3/5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedItem(null);
                }}
                placeholder="Search frame or lens..."
                className="bg-cards px-3 py-2.5 w-full rounded-lg border-2 border-border text-text-primary
                 focus:border-primary focus:ring-2 focus:ring-primary/40
                 transition-all duration-200 ease-in-out appearance-none outline-none text-[0.95rem]"
              />
              {!selectedItem && searchQuery && (
                <div className="absolute bg-white border-2 border-border text-text-primary mt-1 w-full max-h-60 z-10 rounded-lg shadow-md overflow-hidden">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                      const code = item.f_code || item.l_code || "";
                      const name = item.f_name || item.l_name || "";
                      const price = item.f_price ?? item.l_price ?? 0;
                      return (
                        <div
                          key={item.id}
                          className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                          onClick={() => handleSelectItem(item)}
                        >
                          {code} - {name} - Rs. {price}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-2 text-gray-500">No items found</div>
                  )}
                </div>
              )}
            </div>
            <div className="w-full md:w-auto">
              <button
                className="bg-primary/80 hover:bg-primary-hover transition duration-150 ease-in-out hover:text-text-primary px-3 rounded-lg py-2.5 cursor-pointer w-full md:w-auto"
                onClick={() => addItem(selectedItem)}
              >
                + Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="flex flex-col gap-3 mt-6">
          <div className="font-semibold text-lg bg-background py-1 rounded-t-lg px-3">
            Order Items
          </div>
          {error.orderItems && (
            <div className="text-error text-sm mt-1">{error.orderItems}</div>
          )}
          <div className="max-h-[300px] rounded-lg overflow-auto px-4">
            <div className="grid grid-cols-6 gap-4 bg-primary/40 p-3 rounded-t-lg">
              {orderItemHeaders.map((header) => (
                <div
                  key={header}
                  className="text-center font-semibold text-xs md:text-sm"
                >
                  {header}
                </div>
              ))}
            </div>
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-6 gap-4 py-2 items-center bg-white border-b border-gray-200 text-xs md:text-sm"
              >
                <div className="text-center">{item.Type}</div>
                <div className="text-center">{item.Name}</div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className="bg-primary px-2 rounded-lg py-1 cursor-pointer"
                      onClick={() => decrementQuantity(item.id)}
                    >
                      <Minus size={18} />
                    </button>
                    <span>{item.Quantity}</span>
                    <button
                      className="bg-primary px-2 rounded-lg py-1 cursor-pointer"
                      onClick={() => incrementQuantity(item)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div className="text-center">Rs. {item.Price}</div>
                <div className="text-center">{item.Discount} %</div>
                <div className="text-center flex items-center justify-center gap-2">
                  <button
                    className="text-error/80 hover:text-error px-4 rounded-lg py-1 cursor-pointer"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))}
            {orderItems.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No items added yet.
              </div>
            )}
          </div>
        </div>

        {/* Order Information */}
        <div className="flex flex-col gap-3 mt-6 mb-12">
          <div className="font-semibold text-lg bg-background py-1 rounded-t-lg px-3">
            Order Information
          </div>
          <div className="px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col justify-between gap-1">
                <label htmlFor="">Order Date</label>
                <FormField
                  field={{ type: "date", name: "OrderDate" }}
                  value={orderDate}
                  onChange={(_name, value) => {
                    setOrderDate(value as any);
                    setErrors({ ...error, ["orderDate"]: null });
                  }}
                />
                {error.orderDate && (
                  <div className="text-error text-sm mt-1">
                    {error.orderDate}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between gap-1">
                <label htmlFor="">Delivery Date</label>
                <FormField
                  field={{ type: "date", name: "DeliveryDate" }}
                  value={deliveryDate}
                  onChange={(_name, value) => {
                    setDeliveryDate(value as any);
                    setErrors({ ...error, ["deliveryDate"]: null });
                  }}
                />
                {error.deliveryDate && (
                  <div className="text-error text-sm mt-1">
                    {error.deliveryDate}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between gap-1">
                <label htmlFor="">Status</label>
                <FormField
                  field={{
                    type: "select",
                    name: "Status",
                    options: [
                      { label: "Pending", value: "pending" },
                      { label: "Completed", value: "completed" },
                      { label: "Progress", value: "progress" },
                    ],
                  }}
                  value={orderStatus}
                  onChange={(_name, value) => {
                    setOrderStatus(value as string);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col justify-between gap-1 mt-4">
              <label htmlFor="">Notes</label>
              <div>
                <FormField
                  field={{ type: "text", name: "Notes" }}
                  value={notes}
                  onChange={(_name, value) => {
                    setNotes(value as string);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="p-4 py-2 bg-background sticky bottom-0 rounded-t-xl mx-2 shadow-lg">
        <div>
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <div>Sub Total</div>
            <div>Rs. {subTotal}</div>
          </div>
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <div>Discount Applied</div>
            <div>Rs. {totalDiscount}</div>
          </div>
          <div className="flex justify-between items-center font-semibold text-sm sm:text-base">
            <div>Total Amount</div>
            <div>Rs. {totalAmount}</div>
          </div>
        </div>
        <div className="flex justify-end font-semibold text-text-primary py-2">
          <button
            onClick={saveOrder}
            className="bg-primary hover:text-text-primary px-4 rounded-lg py-1 cursor-pointer w-full sm:w-auto"
          >
            {!isEdit ? "Save Order" : "Update order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
