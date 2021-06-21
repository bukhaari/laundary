import { ListItem, ListItemIcon, ListItemText, Icon } from "@material-ui/core";
import { useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSettings } from "../../../store/modules/auth";
function FlateLink({ link, ...rest }) {
  const location = useLocation();
  const history = useHistory();
  let { textColor } = useSelector(getSettings);
  // console.log(location.pathname === link.to);
  return (
    <ListItem
      onClick={() => history.push(link.to)}
      selected={link.to === location.pathname}
      button
      key={link.title}
      {...rest}
    >
      <ListItemIcon style={{ color: textColor }}>
        <Icon>{link.icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={link.title} />
    </ListItem>
  );
}

export default FlateLink;
