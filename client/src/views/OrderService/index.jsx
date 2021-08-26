import * as Yup from "yup";
import Payment from "./payment";
import { useMemo, useState } from "react";
import PersonalData from "./personalInfo";
import { useDispatch } from "react-redux";
import { addNewOrder } from "../../store/modules/Order";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import Service from "./ServiceTable";
import PageHeader from "../../components/common/pageHeader";
import { FormikStepper } from "../../components/common/Stepper";
import { CardContent, Card, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(3),
  },
}));

function Order() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [TypePaid, setTypePaid] = useState("Cash");

  const [personalData, setPersonalData] = useState({
    number: "",
    name: "",
    balance: 0,
  });

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

  const [payment, setPayment] = useState({
    balance: 0,
    paidAmount: 0,
    totalAmount: 0,
  });
  const handleTotalAndBalance = (v) => {
    setPayment((prev) => {
      return { ...prev, balance: parseInt(v) + parseInt(personalData.balance) };
    });
    setPayment((prev) => {
      return { ...prev, totalAmount: parseInt(v) };
    });
  };

  useMemo(() => {
    if (personalData.name === "" || personalData.number === "") {
      return handleChecking("Fadlan Soo gali magaca qofka iyo numberkiisa");
    }

    if (serviceOrder.length === 0) {
      return handleChecking("Fadlan Order u samee ");
    }

    if (serviceOrder.length > 0) {
      const SumTotal = serviceOrder.reduce((accumulatar, currentValue) => {
        return accumulatar + currentValue.total;
      }, 0);
      handleTotalAndBalance(SumTotal);
      return handleChecking("");
    }
  }, [serviceOrder]);

  const onSubmit = async (values) => {
    const datas = {
      serviceOrder: serviceOrder,
      typePaid: TypePaid,
      // ...values,
      ...personalData,
      balance: payment.balance,
      paidAmount: payment.paidAmount,
      oldBalance: personalData.balance,
      totalAmount: payment.totalAmount + personalData.balance,
    };

    if (personalData.name === "" || personalData.name === "") {
      return handleChecking("Fadlan Soo gali magaca qofka iyo numberkiisa");
    }

    if (serviceOrder.length === 0) {
      return handleChecking("Fadlan Order samee u samee");
    }

    const { data: result } = await dispatch(addNewOrder(datas));
    handleChecking("");
  };

  const initialValues = {
    // typePaid: "",
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
            <FormikStepper initialValues={initialValues} onSubmit={onSubmit}>
              <PersonalData
                label="Personal Info"
                setPersonalData={setPersonalData}
                personalData={personalData}
              />
              <Service
                label="Service"
                handleservice={handleservice}
                serviceOrder={serviceOrder}
              />
              <Payment
                info={personalData}
                payment={payment}
                setPayment={setPayment}
                label="Payment"
                checking={checking}
                setTypePaid={setTypePaid}
                // validationSchema={Yup.object({
                //   typePaid: Yup.string().required("Required!"),
                // })}
              />
            </FormikStepper>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Order;
