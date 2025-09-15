import { DataTypes } from "sequelize";
import sequelize from "../../config/db.config";
import Customer from "../customer/customer.model";

const Order = sequelize.define("order",{
    id : {
        type : DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    c_id : {
        type :DataTypes.BIGINT,
        allowNull:false,
        references : {
            model : Customer,
            key : "id"
        }
    },
    o_status : {
        type : DataTypes.STRING,
        allowNull:false,
        defaultValue:"progress",
    },
    o_delivery_date : {
        type : DataTypes.DATEONLY,
        allowNull:false,
    },
    o_order_date : {
        type : DataTypes.DATEONLY,
        allowNull : false,
        defaultValue : new Date(),
    },
    o_notes : {
        type : DataTypes.TEXT,
        allowNull : false,
        defaultValue : ""
    },
    status : {
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue : 1
    }
},{
    timestamps:true,
});

export default Order;