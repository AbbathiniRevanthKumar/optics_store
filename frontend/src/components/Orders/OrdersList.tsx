import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/customStoreHook";
import Modal from "../Helpers/Modal";
import TableGrid from "../Helpers/TableGrid";
import FormField from "../Helpers/FormField";
import { apigateway, handleApiError } from "../../config/axios.config";
import { urls } from "../../helpers/urls";
import { calcPrice } from "../../helpers/helpers";
import { orderListHeaders } from "../../helpers/tableHeaders";
import AddOrder from "./AddOrder";
import CustomToaster from "../Helpers/CustomToaster";
import { toast } from "react-toastify";

type Props = {};

const OrdersList = (_props: Props) => {
  const { user } = useAppSelector((state) => state.auth);
  const [orderType, setOrderType] = useState<string>("all");
  const [orderList, setOrderList] = useState([]);
  const [filteredOrderList, setFilteredOrderList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isOrdersChanged, setIsOrdersChanged] = useState(0);
  const [currentOrder, setCurrentOrder] = useState({});

  //fetchOrderList
  const fetchOrdersList = async () => {
    try {
      const { data } = await apigateway.get(urls.getAllOrders);
      if (data.success) {
        return data.data;
      }
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const normalizeOrdersData = (ordersList: any) => {
    const orderListRows = ordersList.map((order: any) => {
      let frames: number = 0;
      let totalPrice: number = 0;
      order.order_items.map((item: any) => {
        if (item.f_id) {
          frames = frames + 1;
          totalPrice =
            totalPrice +
            calcPrice(item.frame.f_price, item.frame.f_discount, item.p_qty);
        }
      });

      const itemsDesc = `Frames - ${frames}`;

      return {
        orderId: order.id,
        customerName: order?.customer?.c_name || "-",
        productsDesc: itemsDesc,
        price: `Rs. ${totalPrice.toFixed(2)}`,
        orderedDate: order?.createdAt.split("T")[0],
        orderDeliveryDate: order?.o_delivery_date || "-",
        orderStatus: order?.o_status || "Pending",
      };
    });

    return orderListRows;
  };

  const setOrders = async () => {
    const ordersList = await fetchOrdersList();
    const normalizedOrdersList = normalizeOrdersData(orderList);
    setOrderList(ordersList);
    setFilteredOrderList(normalizedOrdersList);
  };
  useEffect(() => {
    setOrders();
  }, [isOrdersChanged]);

  useEffect(() => {
    let filteredOrderList = normalizeOrdersData(orderList);
    if (orderType !== "all") {
      filteredOrderList = filteredOrderList.filter(
        (item: any) => item.orderStatus === orderType
      );
    }

    setFilteredOrderList(filteredOrderList);
  }, [orderList, orderType]);

  const handleAddOrder = () => {
    setShowModal(true);
    setCurrentOrder({});
  };

  const handleEditOrder = (order: any) => {
    const orderData = orderList.find((item: any) => item.id === order.orderId);
    setCurrentOrder(orderData as any);
    setShowModal(true);
  };

  const handleDeleteOrder = async (order: any) => {
    try {
      const saveOrderResponse: any = await apigateway.delete(
        `${urls.deleteOrder}/${order.orderId}`
      );
      if (saveOrderResponse && !saveOrderResponse.data.success)
        throw new Error();

      toast(
        <CustomToaster
          type="success"
          message={saveOrderResponse?.data?.message || "order deleted!"}
        />
      );
      setIsOrdersChanged(isOrdersChanged + 1);
    } catch (error) {
      console.log(error);
      const message = handleApiError(error, "Error at deleting order");
      toast(<CustomToaster message={message} type="error" />);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        {/* Filter */}
        <div className="w-full md:w-1/8">
          <FormField
            field={{
              type: "select",
              name: "Order Type",
              options: [
                { label: "All", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
                { label: "Progress", value: "progress" },
              ],
              required: true,
            }}
            value={orderType}
            onChange={(_name, value) => {
              setOrderType(value as any);
            }}
          />
        </div>

        {/* Add Button */}
        {user.role !== "user" && (
          <button
            className="px-5 py-2.5 bg-primary text-text-primary text-sm md:text-base font-medium 
                   rounded-xl shadow-sm hover:bg-primary-hover hover:shadow-md 
                   active:scale-95 transition-all duration-200"
            onClick={handleAddOrder}
          >
            + Add Order
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="rounded-2xl  border border-white/10">
        <TableGrid
          headers={orderListHeaders}
          rows={filteredOrderList}
          actions={user.role !== "user"}
          onEdit={handleEditOrder}
          onDelete={handleDeleteOrder}
          dataType={"Orders"}
        />
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        header={`Order Form`}
      >
        <AddOrder
          completed={(result: boolean) => {
            if (result) {
              setIsOrdersChanged(isOrdersChanged + 1);
              setShowModal(false);
              return;
            }
          }}
          orderData={currentOrder}
        />
      </Modal>
    </div>
  );
};

export default OrdersList;
