import { useState } from "react";
import Products from "./Products";

type Props = {};

const Stock = (_props: Props) => {
  const [type,setType]  = useState<"frames"| "lens">("frames");

  const onChangeProductType = (type:"frames" | "lens")=>{
    setType(type);
  }
  return (
    <div className="py-4 px-2">
      <div>
        <Products type={type} onChange={onChangeProductType}/>
      </div>
    </div>
  );
};

export default Stock;