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
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SearchIcon from '@material-ui/icons/Search';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import fire from '../fire.js';
import Pdf from "react-to-pdf";
require('colors');
var Diff = require('diff');
var stringSimilarity = require('string-similarity');
const ref = React.createRef();

class Dashboard extends React.Component {

  signout() {
    fire.auth().signOut().then((u) => {
    }).then((u) => {
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
    this.onChangeSource1 = this.onChangeSource1.bind(this);
    this.onChangeSource2 = this.onChangeSource2.bind(this);
    this.checkResult = this.checkResult.bind(this);
    this.checkSRC = this.checkSRC.bind(this);
    this.readFile = this.readFile.bind(this);
    this.remove = this.remove.bind(this);
    this.handleTextArea = this.handleTextArea.bind(this);
    this.checkLimit = this.checkLimit.bind(this);
    this.getContent = this.getContent.bind(this);
    this.setURL = this.setURL.bind(this);
    this.handleSnackbarOpen = this.handleSnackbarOpen.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);

    this.state = {
      file: null,
      validWebState:false,
      txt1: '',
      txt2: '',
      src1: '',
      src2: '',
      op: 'not yet',
      opMap: [],
      text: '',
      validType: 'valid',
      count: 0,
      outpt: '',
      urlList:''
    }
  }

  getContent() {
    fetch('https://en.wikipedia.org/wiki/Apple_Inc.')
      .then(response => response.json())
      .then(findresponse => fetch(findresponse.url, { mode: 'no-cors' })) // re-fetch
      .then(textResp => textResp.text()) // assuming this is a text
      .then(data => {
        this.setState({ data });
      });
    console.log(this.state.data);
  }

  onSubmit(e) {
    if(this.state.text.length!=0){
      const header = {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      };

      const file = this.state.file;
      const data1 = new FormData();
      data1.append('file', file);

      var list=[];
      if(this.state.urlList!=""){
        list=(this.state.urlList).split("\n");
      }

      const data2 = {
        "userId":localStorage.getItem('userId'),
        "text":this.state.text,
        "urlList":list
      }; 

      console.log(list);
      axios.post("http://localhost:5000/upload", data1)
        .then((res) => {
          console.log(res.data);
          if ((res.status) == 200) {
            console.log("File Uploaded");
          } else {
            console.log("File not Uploaded");
          }
        })

      axios.post("http://localhost:5000/checkplagiarism/text", data2, header)
        .then((res) => {
          if ((res.status) == 200) {
            this.props.history.push({
              pathname: '/user/result',
              state: {
                length: res.data.length,
              }
            });
          } else {

          }
          console.log(res);

        })

    }else{
      
      this.handleSnackbarOpen('Insert document!');
    }
    
  }

  readFile(file, fileType) {

    const data = new FormData();
    data.append('file', file);
    data.append('filetype', fileType);

    axios.post("http://localhost:5000/readfile", data)
      .then((res) => {
        if ((res.status) == 200) {

          const Count = res.data.text === "" ? 0 : res.data.text.split(" ").length;
          this.setState({
            count: Count,
            text: res.data.text
          });
          this.checkLimit();

        } else {

        }
        console.log(res.data.text);

      })

  }
  // compare two paragraphs
  checkResult(e) {
    const txt1 = this.state.txt1;
    const txt2 = this.state.txt2;
    var sentencesArray1 = txt1.split(/(\S.+?[.!?])(?=\s+|$)/);
    var sentencesArray2 = txt2.split(/(\S.+?[.!?])(?=\s+|$)/);
    var totalSimilarityPercentage = 0.00;
    var resultArray = [];
    sentencesArray2.forEach((sentence2) => {
      var sentenceSimilarityPercentage = 0.0;
      var resultSentence = [];
      if (sentence2.trim() !== '') {
        sentencesArray1.forEach((sentence1) => {
          var totalWords = 0;
          var redWords = 0;
          var sentenceArray = [];
          if (sentence1.trim() !== '') {
            var diff = Diff.diffSentences(sentence1.trim(), sentence2.trim(), { ignoreCase: true });
            console.log(sentence2);
            console.log(sentence1);
            diff.forEach(function (part) {
              // green for additions, gray for deletions
              // red for common parts
              console.log(part);
              totalWords = totalWords + 1;
              var color = part.added ? 'green' :
                part.removed ? 'grey' : 'red';

              if (!part.removed && !part.added) {
                redWords = redWords + 1;
              }

              sentenceArray.push(
                <span style={{ color: color, fontSize: 16, fontWeight: 500 }}>
                  {part.value[color]}
                </span>
              );
            });
            if (sentenceSimilarityPercentage < ((redWords / totalWords) * 100).toFixed(2)) {
              sentenceSimilarityPercentage = ((redWords / totalWords) * 100).toFixed(2);
              resultSentence = sentenceArray;
              console.log(resultSentence);
            } else if (((redWords / totalWords) * 100).toFixed(2) == 0.0 && sentenceSimilarityPercentage == 0.0) {
              console.log('in');
              resultSentence = [<span>{sentence2}</span>]
            }
            console.log(sentenceArray);
            console.log(sentenceSimilarityPercentage);
            console.log(((redWords / totalWords)));
            console.log(((redWords / totalWords) * 100).toFixed(2));
          }
        });
      }
      resultArray = resultArray.concat(resultSentence);
      console.log(resultSentence);
    });
    console.log(stringSimilarity.compareTwoStrings(txt1, txt2));

    // var diff = Diff.diffWords(txt1, txt2,{ignoreCase : true});
    // var op = '';
    // var colorText = []
    // var totalSentences = 0;
    // var redSenetences = 0;
    // diff.forEach(function(part){
    //   // green for additions, gray for deletions
    //   // red for common parts
    //   totalSentences = totalSentences + 1; 
    //   var color = part.added ? 'green' :
    //     part.removed ? 'grey' : 'red';

    //   if(!part.removed && !part.added) {
    //     redSenetences = redSenetences + 1;
    //   }

    //   console.log(part.value[color]);
    //   op = op + part.value[color];

    //   colorText.push(
    //       <span key={colorText.length} style={{ color: color ,fontSize:16,fontWeight:500}}>
    //           {part.value[color]}
    //       </span>
    //   );
    // });
    // var similarity = ((redSenetences / totalSentences)*100).toFixed(2);
    // console.log(colorText.length);
    if (txt1 !== '' && txt2 !== '') {
      resultArray.push(
        <div style={{ fontSize: 16 }}>Similarity percentage {(stringSimilarity.compareTwoStrings(txt1, txt2) * 100).toFixed(2)} %</div>
      );
    }
    // } else {
    //   colorText.push(
    //     <div style={{fontSize:16}}> Enter your texts to compare</div>
    //   );
    // }



    this.setState({
      // op: op,
      opMap: resultArray
    })
  }

  checkSRC() {
    const src1 = this.state.src1;
    const src2 = this.state.src2;
    const srcs = {
      "src1": src1,
      "src2": src2
    };

    axios.post("http://localhost:5000/srcPlagiarism", srcs)
      .then((res) => {
        this.setState({ outpt: res.data.outpt });
        console.log("Done");
      })
  }

  onChangeText1(e) {
    this.setState({
      txt1: e.target.value
    })
  }

  onChangeText2(e) {
    this.setState({
      txt2: e.target.value
    })
  }

  onChangeSource1(e) {
    this.setState({
      src1: e.target.value
    })

  }

  onChangeSource2(e) {
    this.setState({
      src2: e.target.value
    })
  }

  getFileExtension(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
  }

  onChangeFile(e) {
    this.setState({
      file: e.target.files[0],
      validType: 'valid'
    })

    console.log(e.target.value);

    var fileType = this.getFileExtension(e.target.files[0].name);
    if (fileType == 'doc' || fileType == 'docx' || fileType == 'pdf' || fileType == 'txt') {
      this.readFile(e.target.files[0], fileType);
    } else {
      this.handleSnackbarOpen('Invalid Input!');
    }

    console.log(fileType);
  }

  remove() {
    this.setState({
      file: null,
      validType: 'valid',
      text: ''
    })
    const Count = 0;
    this.setState({ count: 0 });
  }

  handleTextArea(e) {
    const Count = e.target.value === "" ? 0 : e.target.value.split(" ").length;
    this.checkLimit();
    this.setState({
      count: Count,
      text: e.target.value
    });

  }

  setURL(e) {
    this.setState({
      urlList: e.target.value
    });
    
  }
  checkLimit() {
    if(this.state.count < 1000){
      this.setState({ validType: 'valid' });
    }else{
      this.handleSnackbarOpen('Exceed Word Limit!');
    }  
  }

  loadFile() {
    document.getElementById('file').click();
  }

  view() {
    return this.state.opMap.map(el => el)
  }

  handleSnackbarOpen(message) {
    this.setState({
      validWebState: true,
      validType: message
    })
  }

  handleSnackbarClose() {
    this.setState({
      validWebState: false,
      // validType: 'valid'
    })
  }


  render() {

    const classes = {
      textArea: {
        width: '92%',
        height: '20rem',
        fontFamily: "Arial",
        fontSize: '16px'
      },
      upload: {
        margin: '-1rem 0 1rem 7%',
        outline: 'none',
        color: '#45A5EE',
        textTransform: 'none',
        fontSize: '20px'
      },
      warning: {
        fontSize: '18px',
        // margin:'0rem 0 0.5rem 0', 
        color: 'red',
        fontWeight: '600',
        display: this.state.validType != 'valid' ? '' : 'none'
      },
      deleteBtn: {
        marginTop: '-5rem',
        color: this.state.count != 0 ? 'red' : '#D9DCDE'
      }


    };

    return (
      <div className="content" style={{ marginTop: '9rem' }}>

        <Row>
          <Col lg="4" md="7" sm="7">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="3" xs="4">
                    <div className="icon-big text-center icon-warning">
                      <img height="35" width="35" src={require("assets/img/search.jpg")} style={{ margin: '0 0 1.5rem 4.5rem' }} />
                    </div>
                  </Col>
                  <Col md="9" xs="8">
                    <Typography style={{ fontSize: '25px', margin: '0.2rem 0 0 2rem' }}>
                      Deep Search
                      </Typography>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <div style={{ fontSize: '15px', textAlign: 'center', fontFamily: "Arial", color: '#6E6D6D' }}>
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
                      <img height="35" width="35" src={require("assets/img/flash.png")} style={{ margin: '0 0 1.5rem 4.5rem' }} />
                    </div>
                  </Col>
                  <Col md="9" xs="8">
                    <Typography style={{ fontSize: '25px', margin: '0.2rem 0 0 2rem' }}>
                      Light Speed
                      </Typography>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <div style={{ fontSize: '15px', textAlign: 'center', fontFamily: "Arial", color: '#6E6D6D' }}>
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
                      <img height="40" width="40" src={require("assets/img/privacy.png")} style={{ margin: '0 0 1.5rem 3rem' }} />
                    </div>
                  </Col>
                  <Col md="9" xs="8">
                    <Typography style={{ fontSize: '25px', margin: '0.2rem 0 0 1rem' }}>
                      Privacy standard
                      </Typography>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <div style={{ fontSize: '15px', textAlign: 'center', fontFamily: "Arial", color: '#6E6D6D' }}>
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
                <CardTitle style={{ textAlign: 'center' }}>
                  <Typography style={{ fontSize: '30px', fontWeight: '600' }}>
                    Plagiarism Checker
                    </Typography>
                </CardTitle>
              </CardHeader>
              <CardBody >
                <Typography style={{ fontSize: '16px', margin: '-1rem 1rem 1.5rem 1rem' }}>
                  To use this Plagiarism Checker, please copy and paste text in the input box below or select a file to upload, and then click on the Check Plagiarism button.
                </Typography>

                <Row style={{ textAlign: 'center' }} >
                  <Col>
                    <input id="file" name="file" type="file" onChange={this.onChangeFile} accept=".pdf,.docx,.doc,.txt" hidden />
                    <TextareaAutosize id="result" onChange={this.handleTextArea} style={classes.textArea} rowsMax={1} rowsMin={1} value={this.state.text} aria-label="empty textarea" placeholder={"\n" + "\n" + " Enter Your Text Here"} />
                  </Col>
                </Row>
                <Row style={{ textAlign: 'right', width: '97.5%' }} >
                  <Col>
                    <IconButton aria-label="delete" style={classes.deleteBtn} disabled={this.state.count != 0 ? false : true} onClick={() => { this.remove(); }}>
                      <DeleteIcon />
                    </IconButton>
                  </Col>
                </Row>

                <Row >
                  <Col md="6" xs="12" style={{ textAlign: 'left'}}>
                    <MIButton onClick={() => { this.loadFile(); }} startIcon={<CloudUploadIcon />} style={classes.upload} size="large">
                      Upload File&nbsp; <div style={{ fontSize: '16px'}}>(doc, docx, txt, pdf) </div>
                    </MIButton>
                  </Col>
                  <Col md="6" xs="12" style={{ textAlign: 'right'}}>
                    <div className="stats" style={{ marginRight: '2.5rem' }} >
                      <i className="fas fa-pen-nib" /> Word Count : {this.state.count}/1000
                    </div>
                  </Col>
                </Row>
                <Row >

                  <Col md="6" xs="12" style={{ textAlign: 'left'}}>
                    <div  style={{ marginLeft: '3rem' }} >
                      <Typography style={{ fontSize: '16px', margin: '0rem 0 0.6rem 0', fontWeight:'bold', color:'#424B4C' }}>
                        Check Plagiarism via Webpage URL (optional)
                      </Typography>

                      <TextField
                        variant="outlined"
                        multiline
                        fullWidth
                        onChange={this.setURL}
                      />
                    </div>
                  </Col>
                </Row>
                <Row style={{ textAlign: 'center', marginTop:'2rem' }} >
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
              <CardFooter style={{ marginTop: '-1.2rem' }}>
                <br />
              </CardFooter>
            </Card>
          </Col>
          <Snackbar open={this.state.validWebState} style={{marginLeft:'5rem'}} anchorOrigin={{vertical:'bottom', horizontal:'right' }} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
            <Alert variant="filled" onClose={this.handleSnackbarClose} severity="error">
              {this.state.validType}
            </Alert>
          </Snackbar>
          {/* <Snackbar
            // anchorOrigin={ 'top', 'center' }
            // key={`${vertical},${horizontal}`}
            
            open={this.state.validWebState}
            onClose={this.handleSnackbarClose}
            message="I love snacks"
          /> */}

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
                <Pdf targetRef={ref} filename="result.pdf">
                  {({ toPdf }) => <Button onClick={toPdf} color="primary">Download Result PDF</Button>}
                </Pdf>
                <div ref={ref}>
                  <div style={{ padding: 20, }}>
                    <span>{this.state.opMap.map(el => el)}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* --------------------Compare Source---------------------- */}

          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Compare Source Code</CardTitle>
              </CardHeader>



              <CardBody>
                <FormGroup>
                  <label>First Source</label>
                  <Input
                    type="textarea"
                    value={this.state.src1}
                    onChange={this.onChangeSource1}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Second Source</label>
                  <Input
                    type="textarea"
                    value={this.state.src2}
                    onChange={this.onChangeSource2}
                  />
                </FormGroup>
                <Button id="btnCompare" onClick={this.checkSRC} color="primary">Compare</Button>
                <div>
                  <p id="inpsrc">{this.state.outpt}</p>
                </div>
              </CardBody>
            </Card>
          </Col>

        </Row>

        {/* --------------------Using document reference---------------------- */}

        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Check Plagiarism Using Document url</CardTitle>
              </CardHeader>
              <CardBody>
                <label>
                  Enter url here :
                  </label>
                <Input type="text"></Input>
                <Button color="primary" onClick={this.getContent}>Check</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
