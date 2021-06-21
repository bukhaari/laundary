import LinkWithChild from "./LinkWithChild";
import FlatLink from "./LinkWithFlat";
import { useState } from "react";
function EachLink({ link }) {
  const [open, setOpen] = useState(false);
  const handleClick = (val) => {
    if (val === false) {
      setOpen(val);
      return;
    }
    setOpen(!open);
  };
  return link.child && link.child.length ? (
    <LinkWithChild link={link} handleClick={handleClick} open={open} />
  ) : (
    <FlatLink link={link} />
  );
}

export default EachLink;
