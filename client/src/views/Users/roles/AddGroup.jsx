import React from "react";
import {
  IconButton,
  Icon,
  Container,
  Grid,
  Typography,
  Box,
} from "@material-ui/core";
import CustomDialog from "../../../components/CustomDialog";
import GroupTree from "./GroupTree";
import { getLinks } from "../../../store/modules/auth";
import { useSelector, useDispatch } from "react-redux";
import BaseInput from "../../../components/controls/BaseInput";
import { useRules } from "../../../Hooks/useRueles";
import BaseButton from "../../../components/controls/BaseButton";

import { GROUP_REQUEST } from "../../../store/modules/Users";

export default function AddGroup({
  GroupName = "",
  method = "post",
  editLinks = [],
  onFinish = () => null,
}) {
  const Links = useSelector(getLinks);
  const [open, setOpen] = React.useState(false);
  const [errMsg, setErrorMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { bindProps, data } = useRules({
    data: {
      GroupName,
      route: [],
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const GroupRule = (v) => {
    if (!v) return "Group name is required";
    let val = v.toUpperCase().trim();
    if (val === "ADMIN" || val === "HQ-ADMIN") return `${v} is Reserved`;
    return true;
  };

  let dispatch = useDispatch();

  const onSaveGroup = () => {
    if (data.isValid()) {
      setLoading(true);
      setErrorMsg("");
      dispatch(GROUP_REQUEST(data.values, method))
        .then(() => {
          if (typeof onFinish === "function") onFinish();
          setLoading(false);
          // console.log(result);
          handleClose();
        })
        .catch((err) => {
          console.log(err);
          setErrorMsg(err.message);
          setLoading(false);
        });
    }
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <IconButton
        size={!!GroupName ? "small" : "medium"}
        onClick={handleClickOpen}
      >
        <Icon style={{ color: "black" }} color="inherit">
          {!!GroupName ? "edit" : "add_moderator"}
        </Icon>
      </IconButton>
      <CustomDialog
        title="Add New Group"
        onClose={handleClose}
        open={open}
        dialogProp={{
          disableBackdropClick: true,
          scroll: "body",
          maxWidth: "lg",
        }}
        actions={
          <>
            {/* <Button color="primary">Subscribe</Button> */}
            <BaseButton
              loading={loading}
              label={!GroupName ? "Save Group" : "Edite"}
              onClick={onSaveGroup}
            />
          </>
        }
      >
        <Container maxWidth="md">
          <BaseInput
            disabled={!!GroupName}
            {...bindProps("GroupName")}
            rules={[GroupRule]}
            variant="outlined"
            fullWidth
            label="Group Name"
          />
          <GroupTree
            Links={Links}
            getValues={bindProps("route").onChange}
            ActiveLinks={editLinks.reduce((obj, link) => {
              obj[link] = true;
              return obj;
            }, {})}
          />
        </Container>
        <Grid container justify="center">
          <Grid item>
            <Box>
              <Typography color="error" component="h1" variant="subtitle2">
                {errMsg}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CustomDialog>
    </div>
  );
}
