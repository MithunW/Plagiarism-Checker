/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
import axios from "axios";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button,
  CardTitle,
  FormGroup,
  Form,
  Input,
} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart
} from "variables/charts.jsx";
import fire from '../fire.js';


require('colors');
var Diff = require('diff');


class Dashboard extends React.Component {


  signout(){
      fire.auth().signOut().then((u)=>{
        }).then((u)=>{
          console.log(u);
          this.props.history.push({
            pathname: '/access/login'        
          });
        })
        .catch((error) => {
            console.log("Error");
        })        
  }


  constructor(props) {
    super(props);

    this.onChangeFile = this.onChangeFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText1 = this.onChangeText1.bind(this);
    this.onChangeText2 = this.onChangeText2.bind(this);
    this.checkResult = this.checkResult.bind(this);

    this.state = {
      file : null,
      txt1 : '',
      txt2 : '',
      op:'not yet',
      opMap :[],
    }
  }
  onSubmit(e) {

    const file = this.state.file;
    const data = new FormData()
   data.append('file', file)

    axios.post('http://localhost:5000/upload', data)
      .this(res => console.log(res.data));
  }

  checkResult(e) {
    const txt1 = this.state.txt1;
    const txt2 = this.state.txt2;
    console.log(txt1);
    console.log(txt2);
    var diff = Diff.diffWords(txt1, txt2);
    var op = '';
    var colorText = []
    diff.forEach(function(part){
      // green for additions, red for deletions
      // grey for common parts
      var color = part.added ? 'green' :
        part.removed ? 'red' : 'grey';
      console.log(part.value[color]);
      op = op + part.value[color];
  
      colorText.push(
          <span style={{ color: color ,fontSize:25,fontWeight:700}}>
              {part.value[color]}
          </span>
      );
    });
    this.setState({
      op: op,
      opMap: colorText
    })
  }

  onChangeText1(e) {
    this.setState({
      txt1:e.target.value
    })
  }

  onChangeText2(e) {
    this.setState({
      txt2:e.target.value
    })
  }

  onChangeFile(e) {
    this.setState({
      file: e.target.files[0]
    })
    console.log(e.target.value);
  }

  view() {
    return this.state.opMap.map(el => el)
  }
  render() {
    return (
      <>
        <div className="content">
        <button onClick={()=>{this.signout()}} >Sign out</button>

        <Row>
            {/* --------------------Compare Text---------------------- */}
            <Col md="12">
              <Card>
                <CardHeader>
                    <CardTitle tag="h5">Compare Text</CardTitle>
                </CardHeader>
                <CardBody>
                  <FormGroup>
                      <label>First Text</label>
                      <Input
                        type="textarea"
                        value={this.state.txt1}
                        onChange={this.onChangeText1}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Second Text</label>
                      <Input
                        type="textarea"
                        value={this.state.txt2} 
                        onChange={this.onChangeText2}
                      />
                    </FormGroup>
                    <Button id="btnCompare" onClick={this.checkResult} color="primary">Compare</Button>
                    <div>
                      <p>{this.state.opMap.map(el => el)}</p>
                    </div>
                </CardBody>
              </Card>
            </Col>
            {/* --------------------Upload Files---------------------- */}
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Upload Files</CardTitle>
                </CardHeader>
                <CardBody>
                  <form onSubmit={this.onSubmit} >
                    <div className="custom-file mb-3">
                      <input type="file" name="file" id="file" className="custom-file-input" onChange={this.onChangeFile}/>
                      <label type="file" className="custom-file-label">Choose File</label>
                    </div>
                    <input type="submit" value="Submit" className="btn btn-primary btn-block"/>
                  </form>
                  
                </CardBody>
                <CardFooter>
                  {/* <hr />
                  <div className="stats">
                    <i className="fa fa-history" /> Updated 3 minutes ago
                  </div> */}
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Email Statistics</CardTitle>
                  <p className="card-category">Last Campaign Performance</p>
                </CardHeader>
                <CardBody>
                  <Pie
                    data={dashboardEmailStatisticsChart.data}
                    options={dashboardEmailStatisticsChart.options}
                  />
                </CardBody>
                <CardFooter>
                  <div className="legend">
                    <i className="fa fa-circle text-primary" /> Opened{" "}
                    <i className="fa fa-circle text-warning" /> Read{" "}
                    <i className="fa fa-circle text-danger" /> Deleted{" "}
                    <i className="fa fa-circle text-gray" /> Unopened
                  </div>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-calendar" /> Number of emails sent
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col md="8">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h5">NASDAQ: AAPL</CardTitle>
                  <p className="card-category">Line Chart with Points</p>
                </CardHeader>
                <CardBody>
                  <Line
                    data={dashboardNASDAQChart.data}
                    options={dashboardNASDAQChart.options}
                    width={400}
                    height={100}
                  />
                </CardBody>
                <CardFooter>
                  <div className="chart-legend">
                    <i className="fa fa-circle text-info" /> Tesla Model S{" "}
                    <i className="fa fa-circle text-warning" /> BMW 5 Series
                  </div>
                  <hr />
                  <div className="card-stats">
                    <i className="fa fa-check" /> Data information certified
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row> */}
        </div>
      </>
    );
  }
}

export default Dashboard;
