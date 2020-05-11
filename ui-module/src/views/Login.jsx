import React from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios";
import fire from '../fire.js';

var firebase = require('firebase');

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.addUser = this.addUser.bind(this);
    this.authListener = this.authListener.bind(this);

    this.state = { 
      email: null,
      password: null,
      status:'success',    
    };
    
  }

  handleInputChange = e => {
    this.setState({[e.target.name]:e.target.value});
    this.setState({status:'success'});
  }

  login(){
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
      }).then((u)=>{
        console.log(u);
        console.log("login");
        this.props.history.push({
          pathname: '/user/dashboard'        
        });
      })
      .catch((error) => {
          this.setState({status:error.message});
          console.log("Invalid email or password");
      })        
  };

  signupWithGoogle(props){
    // e.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');        
    provider.addScope('email');    

    fire.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      props.history.push({
        pathname: '/user/dashboard'         
      });

  
      console.log("google sign succefully");

    }).catch(function(error) {
      console.log("google sign error");
      console.log(error);
      // this.setState({status:error.message});
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });

  };

  authListener(next) {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {

        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userName', user.displayName);
        localStorage.setItem('photoURL', user.photoURL);
        localStorage.setItem('email', user.email);

        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;
        var lastSignInTime = user.metadata.lastSignInTime;
        var creationTime = user.metadata.creationTime;
        user.getIdToken().then(function(accessToken) {
          if(lastSignInTime==creationTime){
            next.addUser(uid,displayName,email);
            console.log("New User Added From Google Signup");    
          }else{
            console.log("User Already Exits From Google Signup");
            next.props.history.push({
              pathname: '/user/dashboard'        
            });    
          }
        });

      } else {

        console.log('not logged');
      }
    });
  }

  addUser(uid,displayName,email){

    const data = {
      "userId":uid,
      "username":displayName,
      "email":email
    };

    axios.post("http://localhost:5000/users/add", data)
      .then((res) => {
      if ((res.status) == 200) {
            
        this.props.history.push({
          pathname: '/user/dashboard'        
        });

      } else {
        this.setState({status:1});      
      }
      console.log(res);

    })
  }

  componentDidMount() {
    this.authListener(this);
  }

  

  render() {

  const classes  ={

      main:{
        // backgroundColor:'red',
        top:'0', bottom:'0', left:'0', right:'0', position: 'absolute'

      },

      paper: {
        padding:'0.1rem 0 10.2rem 0',
        textAlign:'center',
        backgroundColor:'#F0F3F0'
      },
      
      form: {
        margin:'3rem 0 0 0',
        textAlign:'center',
        display:'block'
        // right:'0',
      },
      button: {
        textAlign:'center',
        margin:'2rem 0 0 0'
      },
      divider:{
        width: '100%',
        textAlign: 'center',
        borderBottom: '1.2px solid #BEBEBE ',
        lineHeight: '0.1em'
      },
      text:{
        backgroundColor:'#F0F3F0',
        color:'#8C8E8F ',
        fontSize:'14px',
        fontFamily: 'Arial',
        padding:' 0 10px'
      }
    };
    

    return(
      // <Card  style={classes.root} variant="outlined" >
      // <CardContent>
        <div className="main" style={classes.main}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <a href={"javascript:void(0)"}>
              <Typography variant="h3" style={{ fontSize: '2.5rem', fontWeight: '500', fontFamily:'Arial', color:'black', position: 'absolute',margin:'1rem' }}>UNIQUE</Typography>
            </a>

            <img style={classes.img} src={require("../assets/img/unique.jpg")} height='100%' width='100%'/>

          </Grid>

          <Grid item xs={12} sm={6}>

          <div style={classes.paper}>
            <Container maxWidth='xs' >

              <Typography component="h1" variant="h4" style={{marginTop: '5rem'}}>
                Login
              </Typography>

              <form style={classes.form}  noValidate>

                <Grid container spacing={2} style={{textAlign:'center'}}>

                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoFocus
                      autoComplete="email"
                      onChange={e => {this.handleInputChange(e)}}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={e => {this.handleInputChange(e)}}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12} style={{textAlign:'right',marginTop:'-0.5rem'}}>                                   
                      <Link   href="reset" variant="body2">
                        Forgot Password?
                      </Link>
                  </Grid>

                  <Grid item xs={12} style={{display:this.state.status!='success'?'':'none'}}>
                    <span style={{color:'red'}}>

                      <b>{this.state.status}</b>
                    </span>
                  </Grid>

                  <Grid item xs={12} sm={12} style={{textAlign:'center'}}>
                    <Button

                      variant="contained"
                      color="primary"        
                      style={{margin:'1rem 0 0.5rem 0',width:'80%' , fontSize:'20px',backgroundColor:'#066294 '}}
                      onClick={() => {this.login();}}
                    >
                      Login
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                  
                  <div style={classes.divider}><span style={classes.text}>OR</span></div>

                    <Button

                      variant="contained"       
                      style={{marginTop:'1.5rem',width:'80%', fontSize:'20px',textTransform: 'none', backgroundColor:'white'}}
                      onClick={() => {this.signupWithGoogle(this.props);}}
                    >
                    <div>
                        <img width="25px" style={{marginBottom:'4px', marginRight:'30px'}} alt="Google sign-in" 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                            Sign In With Google
                    </div>
                      
                    </Button>
                  </Grid>

                </Grid>

                <Grid container justify='center'>
                  <Grid item style={{margin:'2rem 0 0 0'}}>
                    <Link href="signup" variant="body2">
                      Don't have an account? Sign Up
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </Container>

          </div>
          
          </Grid>
        </Grid>



      </div>
    );
  }
}

export default Login;
