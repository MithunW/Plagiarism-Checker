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
  CardTitle,
  FormGroup,
  Form,
  Input,
} from "reactstrap";
// core components

import { Link } from "react-router-dom";
import "../assets/css/custom.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DescriptionIcon from '@material-ui/icons/Description';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ThumbDown from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import ForwardIcon from '@material-ui/icons/Forward';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import GetAppIcon from '@material-ui/icons/GetApp';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pdf from "react-to-pdf";
import { saveAs } from 'file-saver';

const ref = React.createRef();


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

var result_header="";
var result_tab_1="";
var result_tab_2_1="";
var result_tab_2_2="";
var result_tab_3="";
var pdfBlob="";
var result_pdf=`<br><span style="color: #2A2B2B; font-size: 40px; font-weight: 500;">Report</span><br><br>`;

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.getResult = this.getResult.bind(this);
    this.saveResult = this.saveResult.bind(this);
    this.createResult = this.createResult.bind(this);
    // this.getProgress = this.getProgress.bind(this);
    // this.getHighlightedText = this.getHighlightedText.bind(this);

    this.state = {
      result: [],
      progress: 0,
      plagiarism: 0,
      unique: 0,
      value: 0,
      save:true,
      length: this.props.location.state.length,
      text:this.props.location.state.text
    };
  }

  // componentDidMount() {
  //   this.getResult();
  // }

  componentDidMount() {
    console.log(this.props.location.state);
    result_header="";
    result_tab_1="";
    result_tab_2_1="";
    result_tab_2_2="";
    result_tab_3="";
    pdfBlob="";
    result_pdf=`<br><span style="color: #2A2B2B; font-size: 40px; font-weight: 500;">Report</span><br><br>`;

    this.timerID = setInterval(() => this.tick(), 1000);
    this.timerProcessID = setInterval(() => this.process(), 10);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    clearInterval(this.timerProcessID);
  }

  process() {
    this.setState({
      progress: (this.state.result.length / this.state.length) * 100,
    });
  }

  tick() {
    if (this.state.result.length < this.state.length) {
      console.log("getting result..");
      this.getResult();
    }
    if (this.state.result.length == this.state.length && this.state.save) {
      this.createResult();
      this.setState({ save: false});
    }
  }

  getResult() {
    const data = {
      "userId":localStorage.getItem('userId')
    }; 
    const header = {
        Authorization: localStorage.getItem("token")
    };

    axios({ method: "get", url: "http://localhost:5000/checkplagiarism/result", data: data, headers:header})
    .then((res) => {
        // console.log(res);
        if (res.status == 200) {
          this.setState({
            result: res.data.result,
            plagiarism: res.data.plagiarism.toFixed(0)<100?res.data.plagiarism.toFixed(0):100,
            unique: 100 - (res.data.plagiarism.toFixed(0)<100?res.data.plagiarism.toFixed(0):100),
          });
        }
      })
      .catch((err) => console.log("Error: " + err));
    console.log(this.state.result.length, " ", this.state.length);
  }

  createResult() {

    var today = new Date().toLocaleString();
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();

    // today = mm + '-' + dd + '-' + yyyy;

    result_header=(
      <Grid container style={{ margin: "3rem" }}>
        <Grid item xs={12} sm={4} style={{ margin: "0.8rem 0 0.8rem 0" }} >
          <Grid container>
            <Grid item xs={3} sm={1}>
              <div style={{ width: "5.5rem" }}>
                <CircularProgressbar
                  value={this.state.progress}
                  text={`${this.state.progress}%`}
                  styles={buildStyles({
                  rotation: 0,
                  strokeLinecap: "butt",
                  textSize: "20px",
                  pathTransitionDuration: 0.5,
                  pathColor: `rgba(62, 152, 199, ${
                    this.state.progress / 100
                    })`,
                    textColor: "#0281EE ",
                    trailColor: "#d6d6d6",
                    backgroundColor: "#3e98c7",
                  })}
                />
              </div>
            </Grid>

            <Grid item xs={9} sm={8}>
              <Typography
                style={{
                  fontSize: "23px",
                  fontWeight: "600",
                  margin: "1.8rem 0 0 0",
                }}
              >
                {this.state.progress}% Checked
              </Typography>
            </Grid>
          </Grid>
        </Grid>

          <Grid item xs={12} sm={4} style={{ margin: "0.8rem 0 0.8rem 0" }} >
            <Grid container>
              <Grid item xs={3} sm={1}>
                <div style={{ width: "5.5rem" }}>
                  <CircularProgressbar
                    value={this.state.plagiarism}
                    text={`${this.state.plagiarism}%`}
                    styles={buildStyles({
                    rotation: 0,
                    strokeLinecap: "butt",
                    textSize: "20px",
                    pathTransitionDuration: 0.5,
                    pathColor: `#D30B1D `,
                    textColor: "#D30B1D",
                    trailColor: "#d6d6d6",
                    backgroundColor: "#3e98c7",
                    })}
                  />
                </div>
              </Grid>
              <Grid item xs={9} sm={8}>
                <Typography
                  style={{
                    fontSize: "23px",
                    fontWeight: "600",
                    margin: "1.8rem 0 0 0",
                  }}
                >
                  {this.state.plagiarism}% Plagiarism
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={4} style={{ margin: "0.8rem 0 0.8rem 0" }} >
            <Grid container>
              <Grid item xs={3} sm={1}>
                <div style={{ width: "5.5rem" }}>
                  <CircularProgressbar
                    value={this.state.unique}
                    text={`${this.state.unique}%`}
                    styles={buildStyles({
                      rotation: 0,
                      strokeLinecap: "butt",
                      textSize: "20px",
                      pathTransitionDuration: 0.5,
                      pathColor: `#027439`,
                      textColor: "#027439",
                      trailColor: "#d6d6d6",
                      backgroundColor: "#3e98c7",
                    })}
                  />
                </div>
              </Grid>
            <Grid item xs={9} sm={7}>
              <Typography
                style={{
                  fontSize: "23px",
                  fontWeight: "600",
                  margin: "1.8rem 0 0 0",
                }}
              >
                {this.state.unique}% Unique
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );

    result_tab_1=(
      this.state.result.map((data, key) => (
        <div key={key}>
          <Grid container>  

            <Grid item xs={3} sm={2} style={{ margin: "0.3rem 0 0.3rem 0" }}>
              <Typography style={{ backgroundColor:data[1] < 0.8 ? "#D5F5E3" : "#FADBD8", color: data[1] < 0.8 ? "#1D8348" : "#943126", fontsize: "20px", fontWeight: 600, textAlign: "center", padding: "0.9rem 0 0.9rem 0" }} >
                  {data[1] < 0.8 ? "UNIQUE" : "PLAGIARIZED"}
              </Typography>
            </Grid>

            <Grid item xs={7} sm={9} style={{ margin: "0.3rem 0 0.3rem 0" }} >
              <Typography style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", backgroundColor: "#F4F6F6", fontsize: "18px", padding: "0.9rem 3rem 0.9rem 1rem"}}>
                {data[0]}
              </Typography>
            </Grid>

            <Grid item xs={2} sm={1} style={{ margin: "0.3rem 0 0.3rem -3rem" }} >
              <a href={data[2]} target="_blank">
                <Button style={{ color: "#943126", display: data[1] < 0.8 ? "none" : ""}} startIcon={ <ForwardIcon style={{ fontSize: "40px" }} />}>
                  compare
                </Button>
              </a>
            </Grid>
          </Grid>
        </div>
      ))
    );

    result_tab_2_1=(
      <Grid container>
        <Grid item xs={6} sm={6} style={{ margin: "0.3rem 0 0.3rem 0", textAlign: "left" }}>
          <Typography style={{ backgroundColor: "#AED6F1", textAlign: "left", color: "#154360", fontSize: "22px", fontWeight: 600, textAlign: "center", padding: "0.9rem 0 0.9rem 0"}} >
            Sentence
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} style={{ margin: "0.3rem 0 0.3rem 0", textAlign: "left" }}>
          <Typography style={{ backgroundColor: "#AED6F1", textAlign: "left", color: "#154360", fontSize: "22px", fontWeight: 600, textAlign: "center", padding: "0.9rem 0 0.9rem 0"}} >
            Source
          </Typography>
        </Grid>
        <Grid item xs={2} sm={2} style={{ margin: "0.3rem 0 0.3rem 0" }} >
          <Typography style={{ backgroundColor: "#AED6F1", color: "#154360", fontSize: "22px", fontWeight: 600, padding: "0.9rem 3rem 0.9rem 1rem"}}>
            Similarity
          </Typography>
        </Grid>
      </Grid>
      );

      result_tab_2_2= (
        this.state.result.map((data, key) => (
          <div key={key}>
            <Grid container style={{ display: data[1] < 0.8 ? "none" : "" }} >
              <Grid item xs={6} sm={6} style={{ margin: "0.3rem 0 0.3rem 0", textAlign: "left"}}>
                <Typography style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", backgroundColor: "#F4F6F6", fontsize: "18px", padding: "1.5rem 3rem 1.5rem 1rem"}}>
                {data[0]}
              </Typography>
              </Grid>

              <Grid item xs={4} sm={4} style={{ margin: "0.3rem 0 0.3rem 0", textAlign: "left"}}>
                <Typography style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", backgroundColor: "#F2F3F4", color: "#154360", fontSize: "15px", textAlign: "center", fontWeight: 600, padding: "1.5rem 3rem 1.5rem 1rem"}}>
                  <a style={{ color: "#2C3E50" }} href={data[2]} target="_blank" >
                    {data[2]}
                  </a>
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} style={{ margin: "0.3rem 0 0.2rem 0"}}>
                <Typography style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", backgroundColor: "#F2F3F4", color: "#B03A2E", fontSize: "15px", fontWeight: 600, padding: "1.5rem 3rem 1.5rem 1rem"}}>
                  {(data[1] * 100).toFixed(0)}%
                </Typography>
              </Grid>
            </Grid>
          </div>
        ))
      );
    
      result_tab_3=(
        this.state.result.map((data, key) => (
          <span key={key} style={{ backgroundColor: data[1] < 0.8 ? "#FDFEFE " : "#FADBD8", color: data[1] < 0.8 ? "#17202A" : "#943126", fontsize: "20px", fontWeight: data[1] < 0.8 ? 500 : 600, padding: data[1] < 0.8 ? "0" : "5px"}} >
            <a style={{ color: "#2C3E50" }} href={ data[1] < 0.8 ? null : data[2] } target="_blank" >
              {data[0] + ". "}
            </a>
          </span>
        ))

      );
      

    result_pdf+=`<span style=" color: #17202A; font-size: 23px; font-weight: 500; padding: 5px;" >` + today + `</span><br><br>`;
    result_pdf+=`<table>
                  <tr>
                    <th style="border: 1px solid #dddddd"> <span style=" color: #922B21 ; font-size: 30px; padding: 10px;"> `+ this.state.plagiarism +`% Plagiarism </span></th>
                    <th style="border: 1px solid #dddddd"> <span style=" color: #196F3D; font-size: 30px; padding: 10px;"> `+this.state.unique+`% Unique </span></th>
                    <th style="border: 1px solid #dddddd"> <span style=" color: #1F618D; font-size: 30px; padding: 10px;"> `+this.props.location.state.count+` Words </span></th>
                  </tr>
                </table><br><br>`;
    
    result_pdf+=`<table style="width: 1000px;">
                  <tr>
                    <th width="430" style=" display:inline-block; border: 1px solid #dddddd"> <span style="backgroundColor: #AED6F1; textAlign: left; color: #154360; fontSize: 26px; fontWeight: 600; textAlign:center; padding: 8px;">  Sentence </span></th>
                    <th width="320" style=" display:inline-block; border: 1px solid #dddddd"> <span style="backgroundColor: #AED6F1; textAlign: left; color: #154360; fontSize: 26px; fontWeight: 600; textAlign:center; padding: 8px;">  Source </span></th>
                    <th width="120" style=" display:inline-block; border: 1px solid #dddddd"> <span style="backgroundColor: #AED6F1; textAlign: left; color: #154360; fontSize: 26px; fontWeight: 600; textAlign:center; padding: 8px;">  Similarity </span></th>
                  </tr>`;

    this.state.result.forEach((data) => {
      
      if(data[1] >= 0.8){
        result_pdf+=`<tr>
                      <td width="430" style=" display:inline-block; border: 1px solid #dddddd;"><div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; textAlign: left; color: #154360; fontSize: 16px; fontWeight: 600;">`+ data[0] +` </div></td>
                      <td width="320" style=" display:inline-block; border: 1px solid #dddddd;"><div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; textAlign: left; color: #154360; fontSize: 16px; fontWeight: 600;"><a style=" color:#7B241C" target="_blank" href="`+data[2]+`" >` + data[2] + `</a> </div></td>
                      <td width="120" style=" display:inline-block; border: 1px solid #dddddd;"><div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; textAlign: left; color: #154360; fontSize: 14px; fontWeight: 600;">`+ (data[1] * 100).toFixed(0)+`% </div></td>
                    </tr>`;
      }
    });
    result_pdf+='</table><br><br>';

    this.state.result.forEach((data) => {
      
      if(data[1] < 0.8){
        result_pdf+=`<span style="background-color: #FDFEFE; color: #17202A; font-size: 20px; font-weight: 500; padding: 0px;" >` + data[0] + '.' + `</span>`;
      }else{
        result_pdf+=`<span style="background-color: #FADBD8; color: #943126; font-size: 20px; font-weight: 600; padding: 5px"; ><a style=" color:#7B241C" target="_blank" href="`+data[2]+`" >` + data[0] + '.' + `</a></span>`;
      }
    });

     

    this.saveResult();
  } 

  saveResult() {
    var sourceFilename = this.props.location.state.sourceFilename;
    axios.post('http://localhost:5000/create-pdf', { body:result_pdf})
      .then(() => axios.get('http://localhost:5000/fetch-pdf', { responseType: 'blob' }))
        .then((res) => {
          console.log('create result pdf');
          pdfBlob = new Blob([res.data], { type: 'application/pdf' });
          console.log(pdfBlob);
          const data = new FormData();
          data.append('file', pdfBlob, 'file.pdf');
          axios.post("http://localhost:5000/upload", data).then((res)=>{
            var resultFilename = res.data.file.filename;
            console.log(res.data.file.filename);
            axios.post('http://localhost:5000/results/add', {userID:localStorage.getItem('userId'), files: [sourceFilename, resultFilename], checktype: 'web.plagiarism',similarity:this.state.plagiarism})
              .then((res) => {
                if(res.status == 200) {
                  console.log(res);
                  console.log('db updated');
                }else {
                  console.log('something went wrong');
                }
              })
            });
            // saveAs(pdfBlob, 'newPdf.pdf');
        });
  }

  downloadResult() {
    saveAs(pdfBlob, 'newPdf.pdf');
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue });
  }

  newSearch() {
    this.props.history.push({
      pathname: '/user/dashboard'
    });
  }

  reSearch() {
    this.props.history.push({
      pathname: '/user/dashboard',
      state: {
        text: this.state.text
      }
    });
  }


  render() {
    const Highlighted = ({ text = "", highlight = "" }) => {
      const parts = text.split(new RegExp(`(${highlight})`, "gi"));
      return (
        <span style={{ fontSize: "20px" }}>
          {" "}
          {parts.map((part, i) => (
            <span
              key={i}
              style={
                part.toLowerCase() === highlight.toLowerCase()
                  ? {
                      fontWeight: "bold",
                      backgroundColor: "#FADBD8",
                      color: "#943126",
                    }
                  : {}
              }
            >
              {part}
            </span>
          ))}{" "}
        </span>
      );
    };

    const classes = {
      textArea: {
        width: "85%",
        height: "20rem",
        fontFamily: "Arial",
        fontSize: "16px",
      },
      upload: {
        margin: "-0.5rem 0 1rem 7%",
        outline: "none",
        color: "#45A5EE",
        textTransform: "none",
        fontSize: "20px",
      },
      warning: {
        fontSize: "18px",
        // margin:'0rem 0 0.5rem 0',
        color: "red",
        fontWeight: "600",
        display: this.state.validType != "valid" ? "" : "none",
      },
      deleteBtn: {
        marginTop: "-5rem",
        color: this.state.count != 0 ? "red" : "#D9DCDE",
      },
    };

    return (
      <div ref={ref} className="content" style={{ marginTop: "9rem" }}>
        <Backdrop open={this.state.save} style={{ zIndex: 5000 }}>
          <CircularProgress color="inherit" style={{textAlign:'center'}}/>
        </Backdrop>
        
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle style={{ textAlign: "center" }}>
                  <Typography style={{ fontSize: "35px", fontWeight: "600" }}>
                    Result
                  </Typography>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Row style={{ textAlign: "right" }}>
                  {result_header}
                </Row>

                <Row style={{ width: "100%", marginBottom: "2rem" }}>
                  <Col>
                    <AppBar position="static" color="default">
                      <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                      >
                        <Tab
                          label="Sentence Wise Result"
                          icon={
                            <DescriptionIcon style={{ fontSize: "50px" }} />
                          }
                          {...a11yProps(0)}
                        />
                        <Tab
                          label="Match Sources"
                          icon={<FileCopyIcon style={{ fontSize: "50px" }} />}
                          {...a11yProps(1)}
                        />
                        <Tab
                          label="Document View"
                          icon={<FindInPageIcon style={{ fontSize: "50px" }} />}
                          {...a11yProps(2)}
                        />
                      </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.value} index={0}>
                      {result_tab_1}
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                      {result_tab_2_1}
                      {result_tab_2_2}
                    </TabPanel>
                    <TabPanel value={this.state.value} index={2}>
                      {result_tab_3}
                    </TabPanel>
                  </Col>
                </Row>

                <Row style={{ textAlign: "center" }}>
                  <Container style={{ maxWidth: 800 }}>
                    <Grid container>
                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          startIcon={<CreateIcon />}
                          style={{ backgroundColor: "#1D8348" }}
                          onClick={() => { this.reSearch() }}
                        >
                          Rewrite Content
                        </Button>
                      </Grid>

                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          startIcon={<SearchIcon />}
                          style={{
                            backgroundColor: "#1F618D",
                            padding: "0.5rem 3rem 0.5rem 3rem",
                          }}
                          onClick={() => { this.newSearch() }}
                        >
                          New Search
                        </Button>
                      </Grid>

                      <Grid item xs={4}>
                        <Pdf targetRef={ref} filename="result.pdf">
                          {({ toPdf }) => 
                            <Button
                            onClick={toPdf}
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<GetAppIcon />}
                            style={{backgroundColor:'#922B21'}}
                            onClick={this.downloadResult}
                            >
                              Download Report
                          </Button> 
                            }
                        </Pdf>
                      </Grid>
                    </Grid>
                  </Container>
                </Row>
              </CardBody>
              <CardFooter style={{ marginTop: "-1.2rem" }}>
                <br />
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Result;
