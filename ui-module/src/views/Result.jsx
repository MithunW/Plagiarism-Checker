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
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from "variables/charts.jsx";
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
import Pdf from "react-to-pdf";
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

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.gerResult = this.gerResult.bind(this);
    // this.getHighlightedText = this.getHighlightedText.bind(this);

    this.state = {
      result: [],
      progress: 0,
      plagiarism: 0,
      unique: 0,
      value: 0,
      length: this.props.location.state.length,
    };
  }

  // componentDidMount() {
  //   this.gerResult();
  // }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
    this.timerProcessID = setInterval(() => this.process(), 1000);
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
      this.gerResult();
    }
  }

  gerResult() {
    axios
      .get("http://localhost:5000/checkplagiarism/result", "")
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
          this.setState({
            result: res.data.result,
            plagiarism: res.data.plagiarism,
            unique: 100 - res.data.plagiarism,
          });
        }
      })
      .catch((err) => console.log("Error: " + err));
    console.log(this.state.result.length, " ", this.state.length);
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue });
  }

  // Highlighted(text, highlight) {
  //     // Split on highlight term and include term into parts, ignore case

  // }

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
      <div className="content" style={{ marginTop: "9rem" }}>
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
                  <Grid container style={{ margin: "3rem" }}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      style={{ margin: "0.8rem 0 0.8rem 0" }}
                    >
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

                    <Grid
                      item
                      xs={12}
                      sm={4}
                      style={{ margin: "0.8rem 0 0.8rem 0" }}
                    >
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

                    <Grid
                      item
                      xs={12}
                      sm={4}
                      style={{ margin: "0.8rem 0 0.8rem 0" }}
                    >
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
                      {this.state.result.map((data, key) => (
                        <div key={key}>
                          <Grid container>
                            <Grid
                              item
                              xs={3}
                              sm={2}
                              style={{ margin: "0.3rem 0 0.3rem 0" }}
                            >
                              <Typography
                                style={{
                                  backgroundColor:
                                    data[1] < 0.8 ? "#D5F5E3" : "#FADBD8",
                                  color: data[1] < 0.8 ? "#1D8348" : "#943126",
                                  fontsize: "20px",
                                  fontWeight: 600,
                                  textAlign: "center",
                                  padding: "0.9rem 0 0.9rem 0",
                                }}
                              >
                                {data[1] < 0.8 ? "UNIQUE" : "PLAGIARIZED"}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={7}
                              sm={9}
                              style={{ margin: "0.3rem 0 0.3rem 0" }}
                            >
                              <Typography
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#F4F6F6",
                                  fontsize: "18px",
                                  padding: "0.9rem 3rem 0.9rem 1rem",
                                }}
                              >
                                {data[0]}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={2}
                              sm={1}
                              style={{ margin: "0.3rem 0 0.3rem -3rem" }}
                            >
                              <a href={data[2]} target="_blank">
                                <Button
                                  style={{
                                    color: "#943126",
                                    display: data[1] < 0.8 ? "none" : "",
                                  }}
                                  startIcon={
                                    <ForwardIcon style={{ fontSize: "40px" }} />
                                  }
                                >
                                  compare
                                </Button>
                              </a>
                            </Grid>
                          </Grid>
                        </div>
                      ))}
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                      <Grid container>
                        <Grid
                          item
                          xs={8}
                          sm={8}
                          style={{
                            margin: "0.3rem 0 0.3rem 0",
                            textAlign: "left",
                          }}
                        >
                          <Typography
                            style={{
                              backgroundColor: "#AED6F1",
                              textAlign: "left",
                              color: "#154360",
                              fontSize: "22px",
                              fontWeight: 600,
                              textAlign: "center",
                              padding: "0.9rem 0 0.9rem 0",
                            }}
                          >
                            Source
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sm={4}
                          style={{ margin: "0.3rem 0 0.3rem 0" }}
                        >
                          <Typography
                            style={{
                              backgroundColor: "#AED6F1",
                              color: "#154360",
                              fontSize: "22px",
                              fontWeight: 600,
                              padding: "0.9rem 3rem 0.9rem 1rem",
                            }}
                          >
                            Similarity
                          </Typography>
                        </Grid>
                      </Grid>
                      {this.state.result.map((data, key) => (
                        <div key={key}>
                          <Grid
                            container
                            style={{ display: data[1] < 0.8 ? "none" : "" }}
                          >
                            <Grid
                              item
                              xs={8}
                              sm={8}
                              style={{
                                margin: "0.3rem 0 0.3rem 0",
                                textAlign: "left",
                              }}
                            >
                              <Typography
                                style={{
                                  backgroundColor: "#F2F3F4",
                                  textAlign: "left",
                                  fontSize: "20px",
                                  fontWeight: 600,
                                  textAlign: "center",
                                  padding: "0.9rem 0 0.9rem 0",
                                }}
                              >
                                <a
                                  style={{ color: "#2C3E50" }}
                                  href={data[2]}
                                  target="_blank"
                                >
                                  {data[2]}
                                </a>
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              sm={4}
                              style={{ margin: "0.3rem 0 0.3rem 0" }}
                            >
                              <Typography
                                style={{
                                  backgroundColor: "#F2F3F4",
                                  color: "#B03A2E",
                                  fontSize: "20px",
                                  fontWeight: 600,
                                  padding: "0.9rem 3rem 0.9rem 1rem",
                                }}
                              >
                                {data[1] * 100}%
                              </Typography>
                            </Grid>
                          </Grid>
                        </div>
                      ))}
                    </TabPanel>
                    <TabPanel value={this.state.value} index={2}>
                      {this.state.result.map((data, key) => (
                        <span
                          key={key}
                          style={{
                            backgroundColor:
                              data[1] < 0.8 ? "#FDFEFE " : "#FADBD8",
                            color: data[1] < 0.8 ? "#17202A" : "#943126",
                            fontsize: "20px",
                            fontWeight: data[1] < 0.8 ? 500 : 600,
                            padding: data[1] < 0.8 ? "0" : "5px",
                          }}
                        >
                          {data[0] + ". "}
                        </span>
                      ))}
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
                          // onClick={this.onSubmit}
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
                          // onClick={this.onSubmit}
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
                      // onClick={this.onSubmit}
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

export default Dashboard;
