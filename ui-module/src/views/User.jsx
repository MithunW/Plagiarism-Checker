import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Input,
  Row,
  Col,
} from "reactstrap";
import { Formik, Form } from "formik";
import * as yup from "yup";
import fire from '../fire.js';
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

var firebase = require('firebase');

let ProfileSchema = yup.object().shape({
  firstName: yup.string().required("Required!"),
  lastName: yup.string().required("Required!"),
});

let ChangePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required("Required"),
  newPassword: yup.string().required("Required").min(5, 'Password is too short - should be 5 chars minimum.'),
  confirmPassword: yup.string().required("Required").min(5, 'Password is too short - should be 5 chars minimum.').oneOf([yup.ref('newPassword'), null], 'New Password must match'),

});

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profileLog:'success',
            profileSubmit:false,
            passwordLog:'success',
            passwordSubmit:false,
            loading: false,
            userName:'User',
            email:'User@gmail.com',
            photoURL:'https://www.kindpng.com/picc/m/105-1055656_account-user-profile-avatar-avatar-user-profile-icon.png'
        };

        this.getUserDetail = this.getUserDetail.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.reauthenticate = this.reauthenticate.bind(this);
        this.changepassword = this.changepassword.bind(this);
    }

    getUserDetail(){
        var userName = localStorage.getItem('userName');
        var photoURL = localStorage.getItem('photoURL');
        var email = localStorage.getItem('email');
        if (userName != 'null' && userName != undefined) {
            this.setState({
                userName: localStorage.getItem('userName')
            });
        }

        if (photoURL != 'null' && photoURL != undefined) {
            this.setState({
                photoURL: localStorage.getItem('photoURL')
            });
        }

        if (email != 'null' && email != undefined) {
            this.setState({
                email: localStorage.getItem('email')
            });
        }
    }

    updateProfile(displayName){
        fire.auth().onAuthStateChanged((user) => {
          if (user) {
            user.updateProfile({
                displayName: displayName,
            })
            .then(
                console.log("update profile"),
                this.setState({
                    profileSubmit: true,
                    loading: false
                }),
                localStorage.setItem("userName", displayName)

            )
            .catch((error) => {
                this.setState({
                    profileLog: error.message,
                    profileSubmit:true,
                    loading: false
                });
                console.log(error);
            });
          } else {
            // No user is signed in.
            console.log("User not signed");
            this.setState({
                profileLog: "invalid login",
                profileSubmit:true,
                loading: false
            });
        }
        });
    }

    reauthenticate(email, currentPassword, newPassword){
        var that = this;
        fire.auth().onAuthStateChanged(function(user) {
        if (user) {
            var credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
            // Prompt the user to re-provide their sign-in credentials

            user.reauthenticateWithCredential(credential).then(function() {
                // User re-authenticated.
                console.log("User reauthenticate");
                that.changepassword(newPassword);
            }).catch(function(error) {
                console.log("User not reauthenticate");
                that.setState({
                    passwordLog: error.message,
                    passwordSubmit:true,
                    loading: false
                });
                // An error happened.
            });

        } else {
            // No user is signed in.
            console.log("User not signed");
            that.setState({
                passwordLog: 'Invalid authenticate',
                passwordSubmit:true,
                loading: false
            });
        }
        });      
    };

    changepassword(newPassword){
        var that = this;
        fire.auth().onAuthStateChanged(function(user) {
        if (user) {
            user.updatePassword(newPassword).then(function() {
                // Update successful.
                console.log("User password updated successfully");
                that.setState({
                    passwordLog: 'success',
                    passwordSubmit:true,
                    loading: false
                });

            }).catch(function(error) {
                that.setState({
                    passwordLog: error.message,
                    passwordSubmit:true,
                    loading: false
                });
                console.log("User password not updated");
            });
        } else {
            // No user is signed in.
            console.log("User not signed");
            that.setState({
                passwordLog: 'Invalid authenticate',
                passwordSubmit:true,
                loading: false
            });
        }
        });      
    };

    componentDidMount() {   
        this.timerID = setInterval(() =>{     
            this.getUserDetail();
        }, 10);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }




    render() {
        const classes  ={
            header: {
                backgroundColor:'#808B96 ',
                height:'8rem'
            },
            title: {
                textAlign:'center',
                marginTop:'-5rem'
            },
            avatar: {
                width:'7rem',
                height:'7rem',
                marginLeft: 'auto',
                marginRight: 'auto',
            },
            label: {
                fontSize:'20px',
                marginTop:'0.8rem',
                textAlign:'center'
            },
            divider:{
                width: '100%',
                textAlign: 'center',
                borderBottom: '1.2px solid #BEBEBE ',
                lineHeight: '0.1em',
                marginTop:'3rem'
            },
            button:{
                backgroundColor:'#2471A3', 
                textTransform: 'none',
                fontSize:'18px'
            }
        };
        return (
        <>
            <div className="content">
            <Row style={{margin:'9rem 0 2rem 0'}}>
                <Col>
                <Card className="card-user" >

                    <CardHeader style={classes.header}>

                    </CardHeader>

                    <CardBody>
                        <div style={classes.title}>
                            <Avatar alt="profile" sizes="40px" src={this.state.photoURL} style={classes.avatar}/>

                            <Typography style={{fontSize:'30px', fontWeight:'600'}}>
                                {this.state.userName}
                            </Typography>
                            <Typography style={{fontSize:'18px'}}>
                                {this.state.email}
                            </Typography>
                        </div> 

                        <div>
                        
                        <div style={classes.divider}></div>
                        
                            <Container style={{maxWidth:600}} >
                                <Typography style={{color:'#515A5A', fontSize:'26px', fontWeight:'600', textAlign:'center', margin:'2rem 0 0 0'}}>
                                    Update Profile
                                </Typography>
                                <Formik
                                    initialValues={{
                                        firstName: "",
                                        lastName: ""
                                    }}

                                    validationSchema={ProfileSchema}

                                    onSubmit={(values) => {
                                        this.setState({
                                            loading: true
                                        });
                                        this.updateProfile(values.firstName+' '+values.lastName);
                                    }}

                                >
                                    {({ errors, handleChange, touched, values, onSubmit }) => (
                                    <Form>

                                        <Grid container spacing={3} style={{width:'100%', margin:'2rem 0 1rem 0'}}>
                                            <Grid item xs={12} md={6}>
                                                <Typography style={classes.label}>
                                                    First Name
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    id="firstName"
                                                    name="firstName" 
                                                    variant="outlined"
                                                    fullWidth
                                                    value={values.firstName}  
                                                    onChange={handleChange}
                                                    error={errors.firstName && touched.firstName}
                                                    helperText={
                                                    errors.firstName && touched.firstName
                                                        ? errors.firstName
                                                        : null
                                                    } 
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Typography style={classes.label}>
                                                    Last Name
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    id="lastName"
                                                    name="lastName" 
                                                    variant="outlined"
                                                    fullWidth
                                                    value={values.lastName}  
                                                    onChange={handleChange}
                                                    error={errors.lastName && touched.lastName}
                                                    helperText={
                                                    errors.lastName && touched.lastName
                                                        ? errors.lastName
                                                        : null
                                                    } 
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={12} lg={12} style={{margin:'2rem 0 0 0', display:this.state.profileSubmit?'':'none', textAlign:'center'}}>                                   
                                                <span style={{color:this.state.profileLog!='success'?'red':'green'}}>
                                                    <b>{this.state.profileLog!='success'?this.state.profileLog:'Profile Updated Successfully'}</b>
                                                </span>
                                            </Grid>

                                            <Grid item xs={12} md={12} style={{textAlign:'center', margin:'0.5rem 0 1rem 0'}}>
                                                <Button variant="contained" type="submit" style={classes.button}>
                                                    Update Profile
                                                </Button>
                                            </Grid>
                                        </Grid>

                                    </Form>
                                    )}
                                </Formik>
                            </Container>

                            <div style={classes.divider}></div>

                            <Container style={{maxWidth:600}} >

                                <Typography style={{color:'#515A5A', fontSize:'26px', fontWeight:'600', textAlign:'center', margin:'2rem 0 0 0'}}>
                                    Change Password
                                </Typography>

                                <Formik
                                    initialValues={{
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword:''
                                    }}

                                    validationSchema={ChangePasswordSchema}

                                    onSubmit={values => {
                                        this.setState({
                                            loading: true
                                        });
                                        this.reauthenticate(this.state.email, values.currentPassword, values.newPassword);
                                        // reauthenticate(values.email, values.currentPassword, values.newPassword);
                                    }}
                                >

                                    {({errors, handleChange, touched, values, onSubmit}) => (
                                        <Form >
                                            <Grid container spacing={3} style={{width:'100%', margin:'2rem 0 1rem 0'}}>                               

                                                <Grid item xs={12} md={6}>
                                                    <Typography style={classes.label} >
                                                        Current Password
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField 
                                                        id="currentPassword"
                                                        name="currentPassword"
                                                        type="password"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={values.currentPassword}  
                                                        onChange={handleChange}
                                                        error={errors.currentPassword && touched.currentPassword}
                                                        helperText={
                                                        errors.currentPassword && touched.currentPassword
                                                            ? errors.currentPassword
                                                            : null
                                                        }
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <Typography style={classes.label}>
                                                        New Password
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField 
                                                        id="newPassword"
                                                        name="newPassword"
                                                        type="password"
                                                        variant="outlined"
                                                        fullWidth 
                                                        value={values.newPassword}  
                                                        onChange={handleChange}
                                                        error={errors.newPassword && touched.newPassword}
                                                        helperText={
                                                        errors.newPassword && touched.newPassword
                                                            ? errors.newPassword
                                                            : null
                                                        }
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <Typography style={classes.label}>
                                                        Confirm Password
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField 
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        type="password"
                                                        variant="outlined"
                                                        fullWidth 
                                                        value={values.confirmPassword}  
                                                        onChange={handleChange}
                                                        error={errors.confirmPassword && touched.confirmPassword}
                                                        helperText={
                                                        errors.confirmPassword && touched.confirmPassword
                                                            ? errors.confirmPassword
                                                            : null
                                                        }
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={12} md={12} lg={12} style={{margin:'2rem 0 0 0', display:this.state.passwordSubmit?'':'none', textAlign:'center'}}>                                   
                                                    <span style={{color:this.state.passwordLog!='success'?'red':'green'}}>
                                                        <b>{this.state.passwordLog!='success'?this.state.passwordLog:'Password Updated Successfully'}</b>
                                                    </span>
                                                </Grid>

                                                <Grid item xs={12} md={12} style={{textAlign:'center', margin:'0.5rem 0 1rem 0'}}>
                                                    <Button variant="contained" type="submit" style={classes.button}  disabled={this.state.passwordLog=='success' && this.state.passwordSubmit}>
                                                        Change Password
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Form>
                                    )}
                                </Formik>
                            </Container>
                        </div>
                    
                    </CardBody>
                </Card>
                </Col>
            </Row>
            <Backdrop open={this.state.loading} style={{ zIndex: 5000 }}>
                <CircularProgress color="inherit" style={{textAlign:'center'}}/>
            </Backdrop>
            </div>
        </>
        );
    }
}

export default User;
