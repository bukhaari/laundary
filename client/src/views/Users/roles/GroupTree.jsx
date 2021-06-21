import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Typography from "@material-ui/core/Typography";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { colors, Icon, IconButton } from "@material-ui/core";

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    "&:hover > $content": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:focus > $content, &$selected > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)",
    },
    "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label": {
      backgroundColor: "transparent",
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: "inherit",
    color: "inherit",
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  return (
    <TreeItem
      // endIcon={<Icon>star</Icon>}
      // icon={<Icon>star</Icon>}
      label={
        <div className={classes.labelRoot}>
          {/* <LabelIcon color="inherit" className={classes.labelIcon} /> */}
          <Icon color="inherit" className={classes.labelIcon}>
            {LabelIcon}
          </Icon>
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor || colors.grey[200],
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    // minWidth: 1000,
    minWidth: 400,
  },
});

export default function GroupTree({ Links, ActiveLinks = {}, getValues }) {
  const classes = useStyles();

  const [checked, setChecked] = React.useState(ActiveLinks);
  const [CheckRoot, setRoot] = React.useState({});

  React.useEffect(() => {
    if (typeof getValues === "function")
      getValues(Object.keys(checked).filter((key) => checked[key]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const RootIcon = ({ child, title }) => {
    let count = 0;
    for (let index = 0; index < child.length; index++) {
      const { title: chTitle } = child[index];
      if (checked[chTitle]) count++;
    }
    if (count === 0) return "check_box_outline_blank";
    else if (count === child.length) {
      if (!CheckRoot[title]) setRoot({ ...CheckRoot, [title]: true });
      return "check_box";
    }
    return "indeterminate_check_box";
  };
  const handleIconClick = ({ title, child }, root) => (e) => {
    e.preventDefault();
    // console.log(e.target.value);
    if (child) {
      setRoot({ ...CheckRoot, [title]: !CheckRoot[title] });
      let root = !CheckRoot[title];
      setChecked({
        ...checked,
        ...child.reduce((obj, { title }) => {
          obj[title] = root;
          return obj;
        }, {}),
      });
    } else {
      if (checked[title] && root) setRoot({ ...CheckRoot, [root]: false });
      setChecked({
        ...checked,
        [title]: !checked[title],
      });
    }
    // console.log(link);
  };

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }}></div>}
    >
      {Links.map((link) => {
        if (!link.child)
          return (
            <StyledTreeItem
              nodeId={link.title}
              labelText={link.title}
              labelIcon={link.icon}
              key={link.title}
              labelInfo={
                <IconButton size="small" onClick={handleIconClick(link)}>
                  <Icon>
                    {checked[link.title]
                      ? "check_box"
                      : "check_box_outline_blank"}
                  </Icon>
                </IconButton>
              }
            />
          );
        return (
          <StyledTreeItem
            nodeId={link.title}
            labelText={link.title}
            key={link.title}
            labelIcon={link.icon}
            labelInfo={
              <IconButton size="small" onClick={handleIconClick(link)}>
                <Icon>{RootIcon(link)}</Icon>
              </IconButton>
            }
            // onLabelClick={handleIconClick(link)}
          >
            {link.child.map((child) => {
              return (
                <StyledTreeItem
                  key={child.title}
                  nodeId={child.title}
                  labelText={child.title}
                  labelIcon={child.icon}
                  labelInfo={
                    <IconButton
                      size="small"
                      onClick={handleIconClick(child, link.title)}
                    >
                      <Icon>
                        {checked[child.title]
                          ? "check_box"
                          : "check_box_outline_blank"}
                      </Icon>
                    </IconButton>
                  }
                />
              );
            })}
          </StyledTreeItem>
        );
      })}

      {/* <StyledTreeItem nodeId="1" labelText="All Mail" labelIcon={MailIcon} />
        <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon} />
        <StyledTreeItem nodeId="3" labelText="Categories" labelIcon={Label}>
          <StyledTreeItem
            nodeId="5"
            labelText="Social"
            labelIcon={SupervisorAccountIcon}
            labelInfo="90"
            color="black"
            bgColor="#e8f0fe"
          />
          <StyledTreeItem
            nodeId="6"
            labelText="Updates"
            labelIcon={InfoIcon}
            labelInfo="2,294"
            color="#e3742f"
            bgColor="#fcefe3"
          />
          <StyledTreeItem
            nodeId="7"
            labelText="Forums"
            labelIcon={ForumIcon}
            labelInfo="3,566"
            color="#a250f5"
            bgColor="#f3e8fd"
          />
          <StyledTreeItem
            nodeId="8"
            labelText="Promotions"
            labelIcon={LocalOfferIcon}
            labelInfo="733"
            color="#3c8039"
            bgColor="#e6f4ea"
          />
        </StyledTreeItem>
        <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} /> */}
    </TreeView>
  );
}
