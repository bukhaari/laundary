import { FormikStepper } from "../../components/common/Stepper";
import { CardContent, Card, makeStyles } from "@material-ui/core";
import PageHeader from "../../components/common/pageHeader";
import { addNewOrder } from "../../store/modules/newOrder";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import { useDispatch } from "react-redux";
import PersonalData from "./personalInfo";
import { memo, useState } from "react";
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

  console.log("service:", service);
  // console.log("typeService:", typeService);

  const onSubmit = async (values) => {
    // const result = await dispatch(addNewOrder(values));
    console.log(values);
  };

  const initialValues = {
    number: "",
    name: "",
    paidAmount: "",
    balance: "",
    typePaid: [],
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
              <Payment label="Payment" personal={info} />
            </FormikStepper>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default memo(Order);
