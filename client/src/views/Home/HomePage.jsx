import { useSelector } from "react-redux";
import { getUser } from "../../store/modules/auth";

const { default: SupperHome } = require("./SupperHome");

function HomePage(props) {
  let { UserType } = useSelector(getUser);
  // console.log(UserType);
  return <>{UserType === "HQ-Admin" ? <SupperHome /> : null}</>;
}

export default HomePage;
