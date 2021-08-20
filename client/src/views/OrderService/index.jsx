import { FormikStepper } from "../../components/common/Stepper";
import { CardContent, Card, makeStyles } from "@material-ui/core";
import PageHeader from "../../components/common/pageHeader";
import { addNewOrder } from "../../store/modules/newOrder";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import { useDispatch } from "react-redux";
import PersonalData from "./personalInfo";
import { memo, useMemo, useState, useEffect } from "react";
import Service from "./services";
import Payment from "./payment";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(3),
  },
}));

function Order() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [info, setInfo] = useState({});
  const getInfo = (values) => {
    setInfo(values);
  };

  const [serviceOrder, setServiceOrder] = useState([]);
  const handleservice = (value) => {
    setServiceOrder((prev) => {
      return value;
    });
  };

  const [checking, setChecking] = useState("");
  const handleChecking = (values) => {
    setChecking(values);
  };

  const [totalAmount, setTotalAmount] = useState(0);
  const handleTotalAmount = (values) => {
    setTotalAmount(values);
  };

  useMemo(() => {
    if (serviceOrder.length === 0) {
      return handleChecking("Fadlan Order samee");
    }

    if (serviceOrder.length > 0) {
      const SumTotal = serviceOrder.reduce((accumulatar, currentValue) => {
        return accumulatar + currentValue.total;
      }, 0);
      console.log("SumTotal", SumTotal);
      handleTotalAmount(SumTotal);
      return handleChecking("");
    }
  }, [serviceOrder]);

  const onSubmit = async (values) => {
    const data = {
      serviceOrder: serviceOrder,
      ...values,
      totalAmount: totalAmount,
    };

    if (serviceOrder.length === 0) {
      return handleChecking("Fadlan Order samee");
    }

    // const result = await dispatch(addNewOrder(values));
    console.log("data submit", data);
    handleChecking("");
  };

  const initialValues = {
    number: "",
    name: "",
    paidAmount: 0,
    typePaid: "",
  };

  return (
    <div>
      <PageHeader
        title="ServiceOrder"
        subTitle="Services Order"
        Icon={<LocalMallIcon />}
      />
      <div className={classes.pageContent}>
        <Card>
          <CardContent>
            <FormikStepper
              initialValues={initialValues}
              onSubmit={onSubmit}
              getInfo={getInfo}
            >
              <PersonalData
                label="Personal Info"
                validationSchema={Yup.object({
                  name: Yup.string().required("Required!"),
                  number: Yup.string().required("Required!"),
                })}
              />
              <Service
                label="Service"
                handleservice={handleservice}
                serviceOrder={serviceOrder}
              />
              <Payment
                info={info}
                totalAmount={totalAmount}
                label="Payment"
                checking={checking}
                validationSchema={Yup.object({
                  typePaid: Yup.string().required("Required!"),
                  paidAmount: Yup.number().required("Required!"),
                })}
              />
            </FormikStepper>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Order;
