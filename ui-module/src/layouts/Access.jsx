import React from "react";
import { Route, Switch } from "react-router-dom";
// import Footer from "components/Footer/Footer.jsx";
import {access_routes} from "routes.js";
import PerfectScrollbar from "perfect-scrollbar";
import fire from '../fire.js';


var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.mainPanel = React.createRef();

    // this.state = ({
    //   user: null,
    // });
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }
 
  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {

        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;
        user.getIdToken().then(function(accessToken) {
          // console.log(displayName,emailVerified,email,uid,phoneNumber,providerData); 
          // console.log(accessToken);
          localStorage.setItem('token', accessToken);
        });

      } else {
        // this.setState({ user: null });
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('photoURL');
        localStorage.removeItem('token');
        console.log('not logged');
      }
    });
  }

  render() {
    return (
      <div className="wrapper">

         <div  ref={this.mainPanel}>

          <Switch>
            {access_routes.map((prop, key) => {
              return (
                <Route
                  path={prop.layout + prop.path}
                  component={prop.component}
                  key={key}
                />
              );
            })}
          </Switch>
           {/* <Footer fluid /> */}
        </div>
        </div>

 
    );
  }
}

export default Dashboard;
