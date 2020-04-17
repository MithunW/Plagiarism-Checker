import React from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input
} from "reactstrap";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import routes from "routes.js";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

var firebase = require('firebase');

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dropdownOpen: false,
      color: "transparent",
      auth:true,
      anchorEl:null,
      open :false
    };
    this.toggle = this.toggle.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.sidebarToggle = React.createRef();
  }

  toggle() {
    if (this.state.isOpen) {
      this.setState({
        color: "transparent"
      });
    } else {
      this.setState({
        color: "dark"
      });
    }
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  dropdownToggle(e) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  getBrand() {
    let brandName = "Default Brand";
    routes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    return brandName;
  }
  openSidebar() {
    document.documentElement.classList.toggle("nav-open");
    this.sidebarToggle.current.classList.toggle("toggled");
  }
  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  updateColor() {
    if (window.innerWidth < 993 && this.state.isOpen) {
      this.setState({
        color: "dark"
      });
    } else {
      this.setState({
        color: "transparent"
      });
    }
  }

  handleMenu = e => {   
    this.setState({anchorEl:e.currentTarget});

  }

  handleClose  (){   
    this.setState({anchorEl:null});
  }

  signout(){
    this.handleClose();
      firebase.auth().signOut().then((u)=>{
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

  componentDidMount() {
    window.addEventListener("resize", this.updateColor.bind(this));
  }
  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      this.sidebarToggle.current.classList.toggle("toggled");
    }
  }
  render() {

    const Styles = {
      bar: {
        backgroundColor: '#E0DFDF',
        color: 'white',
        padding: '1rem 0 1rem 0',
        width:'100%',
      }
    };
    return (

      <AppBar position="fixed" style={Styles.bar}>

        <Toolbar disableGutters={false} style={{justifyContent: 'space-between'}}>


          <div style={{ width: '100%' }}>
            <a href={"/admin/dashboard"}>
              <Typography variant="h3" style={{color: '#0F0E0E', fontSize: '3rem', fontWeight: '800', display: 'inline-block' }}>UNIQUE</Typography>

            </a>
            <br />
            <Typography variant="subtitle2" style={{ color: '#4C4B4B', fontWeight: '600', letterSpacing: '0.20rem', display: 'inline-block', flexGrow: 10 }} gutterBottom>
              Plagiarism Checker
            </Typography>
              

          </div>
          <div style={{textAlign:'center'}}>
          <IconButton aria-haspopup="true" onClick={(e) => {this.handleMenu(e);}} aria-label="account of current user" aria-controls="menu-appbar" style={{textAlign:'right',outline: 'none'}}>
                <AccountCircle fontSize='large'/>
          </IconButton> 
          <Typography style={{marginTop:'-0.5rem', color:'black'}}>User</Typography>
          <Menu
                id="menu-appbar"
                anchorEl={this.state.anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(this.state.anchorEl)}
                onClose={() => {this.handleClose();} }
                style={{margin:'3rem 1rem'}}
              >
                <MenuItem style={{ padding:'0.5rem 2rem 0.5rem 1rem'}} onClick={() => {this.handleClose();} }>Profile</MenuItem>
                <MenuItem style={{ padding:'0.5rem 2rem 0.5rem 1rem'}} onClick={() => {this.signout();} }>Log out</MenuItem>
              </Menu>

          </div>
          

        </Toolbar>
      </AppBar>



      // add or remove classes depending if we are on full-screen-maps page or not
      // <Navbar
      //   color={
      //     this.props.location.pathname.indexOf("full-screen-maps") !== -1
      //       ? "dark"
      //       : this.state.color
      //   }
      //   expand="lg"
      //   className={
      //     this.props.location.pathname.indexOf("full-screen-maps") !== -1
      //       ? "navbar-absolute fixed-top"
      //       : "navbar-absolute fixed-top " +
      //         (this.state.color === "transparent" ? "navbar-transparent " : "")
      //   }
      // >
      //   <Container fluid>
      //     <div className="navbar-wrapper">
      //       <div className="navbar-toggle">
      //         <button
      //           type="button"
      //           ref={this.sidebarToggle}
      //           className="navbar-toggler"
      //           onClick={() => this.openSidebar()}
      //         >
      //           <span className="navbar-toggler-bar bar1" />
      //           <span className="navbar-toggler-bar bar2" />
      //           <span className="navbar-toggler-bar bar3" />
      //         </button>
      //       </div>
      //       <NavbarBrand href="/">{this.getBrand()}</NavbarBrand>
      //     </div>
      //     <NavbarToggler onClick={this.toggle}>
      //       <span className="navbar-toggler-bar navbar-kebab" />
      //       <span className="navbar-toggler-bar navbar-kebab" />
      //       <span className="navbar-toggler-bar navbar-kebab" />
      //     </NavbarToggler>
      //     <Collapse
      //       isOpen={this.state.isOpen}
      //       navbar
      //       className="justify-content-end"
      //     >
      //       <form>
      //         <InputGroup className="no-border">
      //           <Input placeholder="Search..." />
      //           <InputGroupAddon addonType="append">
      //             <InputGroupText>
      //               <i className="nc-icon nc-zoom-split" />
      //             </InputGroupText>
      //           </InputGroupAddon>
      //         </InputGroup>
      //       </form>
      //       <Nav navbar>
      //         <NavItem>
      //           <Link to="#pablo" className="nav-link btn-magnify">
      //             <i className="nc-icon nc-layout-11" />
      //             <p>
      //               <span className="d-lg-none d-md-block">Stats</span>
      //             </p>
      //           </Link>
      //         </NavItem>
      //         <Dropdown
      //           nav
      //           isOpen={this.state.dropdownOpen}
      //           toggle={e => this.dropdownToggle(e)}
      //         >
      //           <DropdownToggle caret nav>
      //             <i className="nc-icon nc-bell-55" />
      //             <p>
      //               <span className="d-lg-none d-md-block">Some Actions</span>
      //             </p>
      //           </DropdownToggle>
      //           <DropdownMenu right>
      //             <DropdownItem tag="a">Action</DropdownItem>
      //             <DropdownItem tag="a">Another Action</DropdownItem>
      //             <DropdownItem tag="a">Something else here</DropdownItem>
      //           </DropdownMenu>
      //         </Dropdown>
      //         <NavItem>
      //           <Link to="#pablo" className="nav-link btn-rotate">
      //             <i className="nc-icon nc-settings-gear-65" />
      //             <p>
      //               <span className="d-lg-none d-md-block">Account</span>
      //             </p>
      //           </Link>
      //         </NavItem>
      //       </Nav>
      //     </Collapse>
      //   </Container>
      // </Navbar>
    );
  }
}

export default Header;
