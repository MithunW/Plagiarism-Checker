import Login from "views/Login.jsx";
import SignUp from "views/SignUp.jsx";
import ForgotPassword from "views/ForgotPassword.jsx";


import Dashboard from "views/Dashboard.jsx";
import Notifications from "views/Notifications.jsx";
import Typography from "views/Typography.jsx";
import TableList from "views/Tables.jsx";
import Maps from "views/Map.jsx";
import UserPage from "views/User.jsx";
import UpgradeToPro from "views/Upgrade.jsx";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/user"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/user"
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: UserPage,
    layout: "/user"
  },
  {
    path: "/tables",
    name: "Table List",
    icon: "nc-icon nc-tile-56",
    component: TableList,
    layout: "/user"
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-caps-small",
    component: Typography,
    layout: "/user"
  },
  {
    pro: true,
    path: "/upgrade",
    name: "Upgrade to PRO",
    icon: "nc-icon nc-spaceship",
    component: UpgradeToPro,
    layout: "/user"
  }
];

var access_routes = [
  {
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-diamond",
    component: Login,
    layout: "/access"
  },
  {
    path: "/signup",
    name: "SignUp",
    icon: "nc-icon nc-diamond",
    component: SignUp,
    layout: "/access"
  },
  {
    path: "/reset",
    name: "ForgotPassword",
    icon: "nc-icon nc-diamond",
    component: ForgotPassword,
    layout: "/access"
  }
];
export default routes;
export {access_routes};
