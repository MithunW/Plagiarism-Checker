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

import '../assets/css/custom.css';

import { makeStyles, createStyles } from "@material-ui/core/styles";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MIButton from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SearchIcon from '@material-ui/icons/Search';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
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
    this.readFile = this.readFile.bind(this);
    this.remove = this.remove.bind(this);
    this.handleTextArea = this.handleTextArea.bind(this);
    this.checkLimit = this.checkLimit.bind(this);

    this.state = {
      file : null,
      txt1 : '',
      txt2 : '',
      op:'not yet',
      opMap :[],
      text:'',
      validType:'valid',
      count:0
    }
  }

  onSubmit(e) {

    const file = this.state.file;
    const data1 = new FormData();
    data1.append('file', file);

    const data2 = {
      "userId":'0001',
      "text":this.state.text
    }; 

    axios.post("http://localhost:5000/upload", data1)
      .then((res) => {
        console.log(res.data);
        if ((res.status) == 200) {
          console.log("File Uploaded");
        } else {
          console.log("File not Uploaded");
        }
    })

    axios.post("http://localhost:5000/checkplagiarism/text", data2)
      .then((res) => {
        if ((res.status) == 200) {
          this.props.history.push({
            pathname: '/user/result',
            state: {
              text:this.state.text,
              result:res.data.result,
              plagiarism:res.data.plagiarism
            }        
          });
        } else {
        
        }
        console.log(res);

    })


  }

  readFile(file,fileType) {

    const data = new FormData();
    data.append('file', file);
    data.append('filetype', fileType);

    axios.post("http://localhost:5000/readfile", data)
      .then((res) => {
        if ((res.status) == 200) {
  
          const Count = res.data.text === "" ? 0 :res.data.text.split(" ").length;
          this.setState({
            count: Count,
            text:res.data.text
          });
          this.checkLimit();

        } else {
        
        }
        console.log(res.data.text);

    })

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

  getFileExtension(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
  }

  onChangeFile(e) {
    this.setState({
      file: e.target.files[0],
      validType:'valid'
    })

    console.log(e.target.value);

    var fileType=this.getFileExtension(e.target.files[0].name);
    if(fileType=='doc' || fileType=='docx'|| fileType=='pdf' || fileType=='txt'){
      this.readFile(e.target.files[0],fileType);
    }else{
      this.setState({ validType:'Invalid Input!'})
    }

    console.log(fileType);
  }

  remove(){
    this.setState({
      file: null,
      validType:'valid',
      text:''
    })
    const Count = 0;
    this.setState({count: 0});
  }

  handleTextArea(e){
      const Count = e.target.value === "" ? 0 : e.target.value.split(" ").length;
      this.checkLimit();
      this.setState({
        count: Count,
        text:e.target.value
      });

  }

  checkLimit(){
    this.setState({
        validType:this.state.count<1000?'valid':'Exceed Word Limit!',
      });
  }

  loadFile(){
    document.getElementById('file').click();
  }

  view() {
    return this.state.opMap.map(el => el)
  }
  render() {

    const classes  ={
      textArea: {
        width:'85%',
        height:'20rem',
        fontFamily: "Arial",
        fontSize:'16px'
      },
      upload:{
        margin:'-0.5rem 0 1rem 7%', 
        outline: 'none', 
        color:'#45A5EE', 
        textTransform: 'none',
        fontSize:'20px'
      },
      warning:{
        fontSize:'18px', 
        // margin:'0rem 0 0.5rem 0', 
        color:'red', 
        fontWeight:'600',
        display:this.state.validType!='valid'?'':'none'
      },
      deleteBtn:{
        marginTop:'-5rem',
        color:this.state.count!=0?'red':'#D9DCDE'
      }

      
    };

    return (
        <div className="content" style={{marginTop:'9rem'}}>

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
          
            {/* --------------------Upload Files---------------------- */}
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle style={{textAlign:'center'}}>
                    <Typography style={{fontSize:'30px', fontWeight:'600'}}>
                        Plagiarism Checker
                    </Typography>
                  </CardTitle>
                </CardHeader>
                <CardBody >
                  <Typography style={{fontSize:'16px', margin:'-1rem 1rem 1.5rem 1rem'}}>
                        To use this Plagiarism Checker, please copy and paste text in the input box below or select a file to upload, and then click on the Check Plagiarism button.
                  </Typography>

                  <Row style={{textAlign:'center'}} >
                    <Col>
                      <input id="file" name="file" type="file" onChange={this.onChangeFile} accept=".pdf,.docx,.doc,.txt" hidden />
                      <TextareaAutosize id="result" onChange={this.handleTextArea} style={classes.textArea} rowsMax={1} rowsMin={1} value={this.state.text} aria-label="empty textarea" placeholder={"\n"+"\n"+" Enter Your Text Here"}/>
                    </Col>
                  </Row>
                  <Row style={{textAlign:'right',width:'93.5%'}} >
                    <Col>
                      <IconButton aria-label="delete" style={classes.deleteBtn} disabled={this.state.count!=0?false:true}  onClick={() => {this.remove();}}>
                        <DeleteIcon />
                      </IconButton>
                      <div className="stats"style={{textAlign:'right', marginRight:'-1rem'}} >
                        <i className="fas fa-pen-nib" /> Word Count : {this.state.count}
                      </div>
                    </Col>
                  </Row>
                  <Row style={{textAlign:'center'}} >
                    <Col>
                      <Typography style={classes.warning}>
                          {this.state.validType}
                      </Typography>
                    </Col>
                  </Row>
                  <Row style={{textAlign:'left'}}>
                    <Col>
                      <MIButton onClick={() => {this.loadFile();}} startIcon={<CloudUploadIcon />} style={classes.upload} size="large">
                        Upload File&nbsp; <div style={{fontSize:'16px', marginTop:'2px'}}>(doc, docx, txt, pdf) </div> 
                      </MIButton>
                    </Col>                 
                  </Row>
                  <Row style={{textAlign:'center'}} >
                    <Col>
                      <MIButton
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<SearchIcon />}
                      style={{backgroundColor:'#066294'}}
                      onClick={this.onSubmit}
                      >
                        Check Plagiarism
                    </MIButton>
                    </Col>
                  </Row>                  
                
                
                
                
                </CardBody>
                <CardFooter style={{marginTop:'-1.2rem'}}>
  
                   
                  <br/>
                </CardFooter>
              </Card>
            </Col>

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
            
          </Row>
        </div>
    );
  }
}

export default Dashboard;
