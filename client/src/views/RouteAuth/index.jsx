import React, { memo } from "react";
import { isAuthenticated, getLinks } from "../../store/modules/auth";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const RouteAuthentication = ({ children, ...rest }) => {
  let auth = useSelector(isAuthenticated);
  const links = useSelector(getLinks).reduce((allLinks, link) => {
    if (link.to) allLinks.push(link);
    else allLinks = [...allLinks, ...link.child];
    return allLinks;
  }, []);
  // console.log(links);
  const canAccess = (current) => {
    // console.log(current);
    let hasAccess = links.find(({ to }) => to === current.pathname);
    // console.log(hasAccess);
    if (hasAccess || current.pathname === "/newbranch") return children;
    return (
      <Redirect
        to={{
          pathname: "/404",
          state: { from: current },
        }}
      />
    );
  };

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          canAccess(location)
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default memo(RouteAuthentication);
