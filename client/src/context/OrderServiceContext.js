import React, { createContext, useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllService, loadServices } from "../store/modules/service";
// import Swal from "sweetalert2";

export const OrderContext = createContext();
OrderContext.displayName = "OrderContext";

const OrderContextProvider = (props) => {
  const ServicesData = useSelector(getAllService);
  const dispatch = useDispatch();

  useEffect(async () => {
    await dispatch(loadServices());
  }, []);

  const [service, setService] = useState([]);
  const handleservice = (value) => {
    setService((prev) => {
      return value;
    });
  };

  const CreateCheckState = async () =>
    await ServicesData.map((s) => {
      return {
        Cid: s._id,
        ischeck: false,
      };
    });

  const CreatetQtyAmountState = async () =>
    await ServicesData.map((s) => {
      return {
        Cid: s._id,
        amount: 0,
        qty: 1,
      };
    });

  const [checkBoxes, seCheck] = useState([]);
  const [QtyAmountState, setQtyAmountState] = useState([]);
  useEffect(() => {
    const handleValues = async () => {
      const checkboxState = await CreateCheckState();
      const qtyAmountNewSatet = await CreatetQtyAmountState();
      setQtyAmountState(qtyAmountNewSatet);
      seCheck(checkboxState);
    };

    handleValues();
  }, [ServicesData]);

  const [typeService, setTypeService] = useState("washing");
  const onChangeTypeService = (e) => {
    //change service Type. radio Button onChange Here!.
    setTypeService(e.target.value);

    //change the value of amount in service.
    let services = QtyAmountState.filter((item) => item.amount > 0);

    let upServices = [];
    let upd = [];
    if (services.length > 0) {
      for (let item of services) {
        const typeAmount = ServicesData.find((s) => s._id === item.Cid);
        upd = [
          ...upd,
          { ...item, amount: parseInt(typeAmount[e.target.value]) },
        ];
        // console.log("upd", upd);
        upServices = QtyAmountState.filter((s) => s.amount == 0);
      }
      setQtyAmountState((prev) => {
        return [...upServices, ...upd];
      });
    }
  };

  const handleChangeCheck = (e, id, data) => {
    // change checkbox
    let checks = checkBoxes.filter((item) => item.Cid !== id);
    seCheck((prev) => {
      return [...checks, { Cid: id, ischeck: e.target.checked }];
    });

    // change amount
    let upd = {};
    let current = {};
    if (!data.check.props.checked) {
      let services = QtyAmountState.filter((item) => item.Cid !== id);
      current = QtyAmountState.find((item) => item.Cid === id);
      upd = { ...current, amount: parseInt(data[typeService]), qty: 1 };
      setQtyAmountState((prev) => {
        return [...services, upd];
      });
    }

    if (data.check.props.checked) {
      let services = QtyAmountState.filter((item) => item.Cid !== id);
      current = QtyAmountState.find((item) => item.Cid === id);
      upd = { ...current, amount: 0, qty: 1 };
      setQtyAmountState((prev) => {
        return [...services, { Cid: id, ...upd }];
      });
    }
  };

  const handleQtyAmountState = (e, id) => {
    let services = QtyAmountState.filter((item) => item.Cid !== id);
    let current = QtyAmountState.find((item) => item.Cid === id);
    const upd = { ...current, [e.target.name]: parseInt(e.target.value) };
    setQtyAmountState([...services, upd]);
  };

  const getcheckState = (id) => {
    let c = checkBoxes.find((k) => k.Cid == id);
    return c;
  };

  const getQtyAmountState = (id) => {
    let c = QtyAmountState.find((k) => k.Cid == id);
    return c;
  };

  const handleDelete = (id) => {
    //handle delete
    const filtterService = service.filter((s) => s._id !== id);
    handleservice(filtterService);

    // change checkbox
    let checks = checkBoxes.filter((item) => item.Cid !== id);
    seCheck((prev) => {
      return [...checks, { Cid: id, ischeck: false }];
    });
  };

  const orderValues = useMemo(() => {
    const qtyAmountData = QtyAmountState.filter((a) => a.amount > 0);

    let orderderArray = [];
    if (ServicesData.length > 0) {
      for (const i of ServicesData) {
        for (const j of qtyAmountData) {
          if (i._id === j.Cid) {
            orderderArray.push({
              itemName: i.item,
              qty: j.qty,
              _id: i._id,
              total: j.qty * j.amount,
              type: typeService,
              amount: j.amount,
            });
          }
        }
      }
    }

    console.log(orderderArray);
    handleservice(orderderArray);
    return orderderArray;
  }, [QtyAmountState, checkBoxes]);

  // const handleOrder = () => {
  //   handleservice(orderValues);
  // };

  return (
    <OrderContext.Provider
      value={{
        service,
        // handleOrder,
        handleDelete,
        ServicesData,
        handleservice,
        getcheckState,
        handleChangeCheck,
        getQtyAmountState,
        onChangeTypeService,
        handleQtyAmountState,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;
