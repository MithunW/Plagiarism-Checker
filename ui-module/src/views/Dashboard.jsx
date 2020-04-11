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
  CardTitle,
  Row,
  Col
} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart
} from "variables/charts.jsx";

import '../assets/css/custom.css';

import { makeStyles, createStyles } from "@material-ui/core/styles";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SearchIcon from '@material-ui/icons/Search';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import fire from '../fire.js';


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

    this.state = {
      file : '',
    }
  }
  onSubmit(e) {

    const file = this.state.file;
    const data = new FormData()
   data.append('file', file)

    axios.post('http://localhost:5000/upload', data)
      .this(res => console.log(res.data));
  }

  onChangeFile(e) {
    this.setState({
      file: e.target.files[0]
    })
    console.log(e.target.value);
  }

  loadFile(){
    document.getElementById('file').click();
  }

  render() {

    const classes  ={
      textArea: {
        width:'80%',
        height:'20rem',
        fontFamily: "Arial",
        fontSize:'16px'
      }
    };

    console.log(this.state.fileUploadState);

    return (
      <>
        <div className="content" style={{margin:'10rem 0 1rem 0'}}>
          <Row>
            <Col lg="4" md="7" sm="7">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="3" xs="4">
                      <div className="icon-big text-center icon-warning">
                        <img height="35" width="35" src={require("assets/img/search.jpg")} style={{margin:'0 0 1.5rem 4.5rem'}}/>
                      </div>
                    </Col>
                    <Col md="9" xs="8">                  
                      <Typography style={{fontSize:'25px', margin:'0.2rem 0 0 2rem'}}>
                        Deep Search
                      </Typography>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <div style={{fontSize:'15px', textAlign:'center',fontFamily: "Arial", color:'#6E6D6D' }}>
                    With contextual analysis, word placement, and our smart algorithms, checking your writing has never been easier.
                  </div>
                </CardFooter>
              </Card>
            </Col>

            <Col lg="4" md="7" sm="7">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="3" xs="4">
                      <div className="icon-big text-center icon-warning">
                        <img height="35" width="35" src={require("assets/img/flash.png")} style={{margin:'0 0 1.5rem 4.5rem'}}/>
                      </div>
                    </Col>
                    <Col md="9" xs="8">                  
                      <Typography style={{fontSize:'25px', margin:'0.2rem 0 0 2rem'}}>
                        Light Speed
                      </Typography>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <div style={{fontSize:'15px', textAlign:'center',fontFamily: "Arial", color:'#6E6D6D' }}>
                    Our software pairs speed with the accuracy.Our technology uses innovative algorithms to quickly search across billions of documents.
                  </div>
                </CardFooter>
              </Card>
            </Col>

            <Col lg="4" md="7" sm="7">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="3" xs="4">
                      <div className="icon-big text-center icon-warning">
                        <img height="40" width="40" src={require("assets/img/privacy.png")} style={{margin:'0 0 1.5rem 3rem'}}/>
                      </div>
                    </Col>
                    <Col md="9" xs="8">                  
                      <Typography style={{fontSize:'25px', margin:'0.2rem 0 0 1rem'}}>
                        Privacy standard
                      </Typography>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <div style={{fontSize:'15px', textAlign:'center',fontFamily: "Arial", color:'#6E6D6D' }}>
                    We take care of your intellectual property and never do any kind of security breach regarding your content.
                  </div>
                </CardFooter>
              </Card>
            </Col>
            
          </Row>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle style={{textAlign:'center'}}>
                    <Typography style={{fontSize:'30px', fontWeight:'600'}}>
                        Plagiarism Checker
                    </Typography>
                  </CardTitle>
                </CardHeader>
                <CardBody style={{textAlign:'center'}}>
                  <Typography style={{fontSize:'16px', margin:'-1rem 1rem 1.5rem 1rem'}}>
                        To use this Plagiarism Checker, please copy and paste text in the input box below or select a file to upload, and then click on the Check Plagiarism button.
                  </Typography>

                  <Row >
                    <Col>
                    {/* <form onSubmit={this.onSubmit} >
                  <div className="custom-file mb-3">
                    <input type="file" name="file" id="file" className="custom-file-input" onChange={this.onChangeFile}/>
                    <label type="file" className="custom-file-label">Choose File</label>
                  </div>
                  <input type="submit" value="Submit" className="btn btn-primary btn-block"/>
                </form> */}
                      <input id="file" name="file" type="file" onChange={this.onChangeFile} hidden />
                      <TextareaAutosize style={classes.textArea} aria-label="empty textarea" placeholder={"\n"+"\n"+" Enter Your Text Here"}/>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4" xs="8">
                      <Button onClick={() => {this.loadFile();}} startIcon={<CloudUploadIcon />} style={{margin:'1rem 0 1r em 1rem', outline: 'none', color:'#45A5EE'}} size="large">
                        Upload File
                      </Button>
                    </Col>                 
                  </Row>

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SearchIcon />}
                    style={{backgroundColor:'#066294'}}
                    onClick={this.onSubmit}
                  >
                    Check Plagiarism
                  </Button>
                
                    
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats"style={{textAlign:'right'}} >
                    <i className="fas fa-pen-nib" /> Word Count : 
                  </div> 
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
          </Row> 
        </div>
      </>
    );
  }
}

export default Dashboard;
