import { useEffect, useState } from "react";
import Modal from "../Helpers/Modal";
import TableGrid from "../Helpers/TableGrid";
import { apigateway } from "../../config/axios.config";
import { urls } from "../../helpers/urls";
import { customerListHeaders } from "../../helpers/tableHeaders";
import AddEditCustomer from "./AddEditCustomer";
import { useAppSelector } from "../../store/customStoreHook";
import { toast } from "react-toastify";
import CustomToaster from "../Helpers/CustomToaster";

type Props = {};

const Customers = (_props: Props) => {
  const [customersList, setCustomerList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [dataUpdated, setDataUpdated] = useState(0);
  const { user } = useAppSelector((state) => state.auth);

  const setCustomers = async () => {
    try {
      const { data } = await apigateway.get(urls.getAllCustomers);
      if (data.success) {
        setCustomerList(data.data);
      }
    } catch (error) {
      console.log("error at fetching customers", error);
    }
  };

  useEffect(() => {
    setCustomers();
  }, [dataUpdated]);

  const handleAddCustomer = () => {
    setCustomerData({
      c_name: "",
      c_email: "",
      c_mobile_number: "",
      c_place: "",
      c_dob: "",
    });
    setShowModal(true);
  };

  const handleEditCustomer = (row: any) => {
    setShowModal(true);
    setCustomerData(row);
  };

  const handleDeleteCustomer = async (row: any) => {
    try {
      const { data } = await apigateway.put(urls.deleteCustomer + `/${row.id}`);
      if (data.success) {
        toast(<CustomToaster type="success" message={data.message} />);
        setDataUpdated(dataUpdated + 1);
        return;
      }
    } catch (error) {
      console.log(error);
      toast(<CustomToaster type="error" message={"try again!"} />);
    }
  };

  return (
    <div className="px-4 py-2">
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-end md:items-center gap-4">
          {user && user.role !== "user" && (
            <button
              className="px-5 py-2.5 bg-primary text-text-primary text-sm md:text-base font-medium 
                   rounded-xl shadow-sm hover:bg-primary-hover hover:shadow-md 
                   active:scale-95 transition-all duration-200"
              onClick={handleAddCustomer}
            >
              + Add Customer
            </button>
          )}
        </div>

        {/* Table Section */}
        <div className="rounded-2xl  border border-white/10">
          <TableGrid
            headers={customerListHeaders}
            rows={customersList}
            actions={user.role !== "user"}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            dataType={"Orders"}
          />
        </div>

        {/* Modal */}
        <Modal
          show={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          header={`Customer Form`}
        >
          <AddEditCustomer
            data={customerData || {}}
            dataUpdated={() => {
              setShowModal(false);
              setDataUpdated(dataUpdated + 1);
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Customers;
