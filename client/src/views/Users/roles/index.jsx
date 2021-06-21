import React, { memo } from "react";
import {
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import AddGroup from "./AddGroup";
import { useDispatch } from "react-redux";
import { GROUP_REQUEST } from "../../../store/modules/Users";
import BaseTable from "../../../components/controls/BaseTable";

function UserRole(props) {
  const [GroupList, setList] = React.useState([]);
  let Header = [
    { field: "GroupName", headerName: "Group Name" },
    { field: "route", headerName: "Links" },
    { field: "edit", headerName: "Edit" },
  ];
  const LoadData = () => {
    dispatch(GROUP_REQUEST())
      .then((val) => {
        // console.log(val);
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
          title={<Typography variant="h5">Create User Roles</Typography>}
          action={<AddGroup onFinish={LoadData}></AddGroup>}
        />
        <CardContent>
          <BaseTable
            header={Header}
            items={GroupList.map((row) => ({
              ...row,
              route: row.route.length,
              edit: (
                <AddGroup
                  GroupName={row.GroupName}
                  method="put"
                  editLinks={row.route}
                  onFinish={LoadData}
                ></AddGroup>
              ),
            }))}
          />
        </CardContent>
      </Card>
    </Container>
  );
}

export default memo(UserRole);
