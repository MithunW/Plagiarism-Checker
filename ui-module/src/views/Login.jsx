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

class Login extends React.Component {

  constructor(props) {
    super(props);

    
  }

  

  render() {

  const classes  ={

      main:{
        // backgroundColor:'red',
        top:'0', bottom:'0', left:'0', right:'0', position: 'absolute'

      },

      paper: {
        padding:'0.1rem 0 14.3rem 0',
        textAlign:'center',
        backgroundColor:'#F0F3F0'
      },
      
      form: {
        margin:'4rem 0 0 0',
        textAlign:'center',
        display:'block'
        // right:'0',
      },
      button: {
        textAlign:'center',
        margin:'2rem 0 0 0'
      },

      img:{
        
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

          <Grid alignItems='center' alignContent='center' item xs={12} sm={6}>

          <div style={classes.paper}>
            <Container maxWidth='xs' >

              <Typography component="h1" variant="h4" style={{marginTop: '5rem'}}>
                Login
              </Typography>

              <form style={classes.form}  noValidate>

                <Grid container alignItems='center' alignContent='center' spacing={4} style={{textAlign:'center'}}>

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
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} style={{textAlign:'right'}}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      style={{margin:'2rem 0 0 0', padding:'0.3rem 1.5rem', fontSize:'20px',}}
                    >
                      Cancle
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={6} style={{textAlign:'left'}}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"        
                      style={{margin:'2rem 0 0 0', padding:'0.3rem 1.5rem', fontSize:'20px'}}
                    >
                      Login
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
