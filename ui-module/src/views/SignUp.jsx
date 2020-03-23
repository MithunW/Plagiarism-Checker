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
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

class SignUp extends React.Component {

  constructor(props) {
    super(props);

    

  }

  

  render() {

    
  // const classes = useStyles;
  const classes  ={
      paper: {
        marginTop: '8rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: '1px',
        padding:'2rem',
        borderRadius:'1rem'
      },
      
      form: {
        marginTop:'2rem',
        width: '100%', // Fix IE 11 issue.
        // marginTop: theme.spacing(3),
      },
      button: {
        textAlign:'center',
        margin:'2.5rem 0 1.5rem 0'
      },
    };
    

    return(

    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={classes.paper}>

        <Typography component="h1" variant="h4">
          Sign Up
        </Typography>

        <form style={classes.form}  noValidate>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
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
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
          </Grid>

          <div style={classes.button}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              style={{margin:'0 1rem 0 0'}}
            >
              Cancle
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"        
              style={{margin:'0 0 0 1rem'}}
            >
              Sign Up
            </Button>
          </div>

          <Grid container justify='center'>
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      
    </Container>
    );
  }
}

export default SignUp;
