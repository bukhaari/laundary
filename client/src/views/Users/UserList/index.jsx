import React, { memo } from "react";
import {
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import PassReset from "./PassReset";
import { useDispatch } from "react-redux";
import { USER_REQUEST } from "../../../store/modules/Users";
import BaseTable from "../../../components/controls/BaseTable";
import AddUser from "./AddUser";

function UserList() {
  const [UserList, setList] = React.useState([]);
  let Header = [
    { field: "_id", headerName: "USERNAME" },
    { field: "FullName", headerName: "FULL NAME" },
    { field: "UserType", headerName: "USER TYPE" },
    { field: "edit", headerName: "Edit" },
    { field: "reset", headerName: "PASS RESET" },
  ];
  const LoadData = () => {
    dispatch(USER_REQUEST())
      .then((val) => {
        setList(val.data);
      })
      .catch(console.log);
  };

  let dispatch = useDispatch();
  
  React.useEffect(() => {
    LoadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Container maxWidth="lg">
      <Card>
        <CardHeader
          title={<Typography variant="h5">USER LISTS</Typography>}
          action={<AddUser onFinish={LoadData}></AddUser>}
        />
        <CardContent>
          <BaseTable
            header={Header}
            items={UserList.map((row) => ({
              ...row,
              reset: <PassReset UserName={row._id}></PassReset>,
              edit: (
                <AddUser
                  UserName={row._id}
                  method="put"
                  editeUser={row}
                  onFinish={LoadData}
                />
              ),
            }))}
          />
        </CardContent>
      </Card>
    </Container>
  );
}

export default memo(UserList);
