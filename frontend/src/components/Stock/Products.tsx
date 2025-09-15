import { useEffect, useState } from "react";
import { frameProductHeaders } from "../../helpers/tableHeaders";
import TableGrid from "../Helpers/TableGrid";
import { apigateway, handleApiError } from "../../config/axios.config";
import { urls } from "../../helpers/urls";
import { toast } from "react-toastify";
import CustomToaster from "../Helpers/CustomToaster";
import { useAppSelector } from "../../store/customStoreHook";
import Modal from "../Helpers/Modal";
import AddProduct from "./AddProduct";
import FormField from "../Helpers/FormField";

type Props = {
  type: "frames" | "lens";
  onChange: (value: "frames" | "lens") => any;
};

const frameProductDetailsTemplate = {
  f_name: "",
  f_company: "",
  f_size: "",
  f_material: "",
  f_qty: "",
  f_model: "",
  f_price: "",
  f_discount: "",
};

const Products = (props: Props) => {
  const { type, onChange } = props;
  const [data, setData] = useState<Record<string, any>[]>([]);
  const { user } = useAppSelector((state) => state.auth);
  const [showModel, setShowModel] = useState(false);
  const [productDetails, setProductDetails] = useState(
    frameProductDetailsTemplate
  );
  const [productType, setProductType] = useState(type);
  const [productsChanged, setProductsChanged] = useState<number>(0);

  const fetchFramesData = async () => {
    try {
      const { data }: any = await apigateway.get(urls.getAllFramesInfo);
      if (data.success) {
        setData(data.data);
        return;
      }
      setData([]);
    } catch (error) {
      const message = handleApiError(error);
      toast(<CustomToaster type="error" message={message} />);
    }
  };

  useEffect(() => {
    if (type === "frames") {
      fetchFramesData();
    } else {
      setData([]);
    }
  }, [type, productsChanged]);

  const handleDelete = async (product: any) => {
    try {
      const { data }: any = await apigateway.patch(
        `${urls.removeFrame}/${product.id}`
      );
      if (data.success) {
        setProductsChanged(productsChanged + 1);
        toast(<CustomToaster message={data.message} type="success" />);
        return;
      }
      toast(<CustomToaster type="error" message={"Try again!"} />);
    } catch (error) {
      const message = handleApiError(error);
      toast(<CustomToaster type="error" message={message} />);
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
              name: "Product Type",
              options: [
                { label: "Frames", value: "frames" },
                { label: "Lens", value: "lens" },
              ],
              required: true,
            }}
            value={productType}
            onChange={(_name, value) => {
              setProductType(value as "frames" | "lens");
              onChange(value as "frames" | "lens");
            }}
          />
        </div>

        {/* Add Button */}
        <button
          className="px-5 py-2 bg-primary text-text-primary text-sm md:text-base font-medium 
                   rounded-xl shadow-sm hover:bg-primary-hover hover:shadow-md 
                   active:scale-95 transition-all duration-200"
          onClick={() => {
            setProductDetails(frameProductDetailsTemplate);
            setShowModel(true);
          }}
        >
          + Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      </div>

      {/* Table Section */}
      <div className=" rounded-2xl  border border-white/10">
        <TableGrid
          headers={frameProductHeaders}
          rows={data || []}
          actions={user.role !== "user"}
          onEdit={(productDetails) => {
            setProductDetails(productDetails as any);
            setShowModel(true);
          }}
          onDelete={handleDelete}
          dataType={type}
        />
      </div>

      {/* Modal */}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        header={`${type.charAt(0).toUpperCase() + type.slice(1)} Form`}
      >
        <AddProduct
          productType={type}
          productDetails={productDetails}
          onSuccess={() => {
            setProductsChanged(productsChanged + 1);
            setShowModel(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Products;
