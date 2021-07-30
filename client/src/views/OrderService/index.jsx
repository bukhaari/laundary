import { FormikStepper } from "../../components/common/Stepper";
import { CardContent, Card, makeStyles } from "@material-ui/core";
import PageHeader from "../../components/common/pageHeader";
import { addNewOrder } from "../../store/modules/newOrder";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import { useDispatch } from "react-redux";
import PersonalData from "./personalInfo";
import { memo, useMemo, useState } from "react";
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

  const [service, setService] = useState([]);
  const handleservice = (value) => {
    setService((prev) => {
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
    if (service.length === 0) {
      return handleChecking("Fadlan Order samee");
    }

    if (service.length > 0) {
      const total = service.reduce((accumulatar, currentValue) => {
        return accumulatar + currentValue.amount;
      }, 0);
      console.log("total", total);
      handleTotalAmount(total);
      return handleChecking("");
    }
  }, [service]);

  const onSubmit = async (values) => {
    const data = {
      service: service,
      ...values,
      totalAmount: totalAmount,
    };

    if (service.length === 0) {
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
        title="Service"
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
                service={service}
              />
              <Payment
                personal={info}
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

export default memo(Order);
