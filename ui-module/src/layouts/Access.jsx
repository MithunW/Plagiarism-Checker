import React from "react";
import { Route, Switch } from "react-router-dom";
// import Footer from "components/Footer/Footer.jsx";
import routes from "routes.js";





class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.mainPanel = React.createRef();
  }

  render() {
    return (
      <div >

        <div  ref={this.mainPanel}>

          <Switch>
            {routes.map((prop, key) => {
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
