import React from "react";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    FormGroup,
    Form,
    Input,
    Row,
    Col
} from "reactstrap";

class User extends React.Component {
    render() {
        return ( <
            >
            <
            div className = "content" >
            <
            Row >



            <
            Col md = "8" >
            <
            Card className = "card-user" >
            <
            CardHeader >
            <
            CardTitle tag = "h5" > Edit Profile < /CardTitle> <
            /CardHeader> <
            CardBody >
            <
            Form >
            <
            Row >
            <
            Col className = "pr-1"
            md = "5" >
            <
            FormGroup >
            <
            label > Company(disabled) < /label> <
            Input defaultValue = "Creative Code Inc."
            disabled placeholder = "Company"
            type = "text" /
            >
            <
            /FormGroup> <
            /Col> <
            Col className = "px-1"
            md = "3" >
            <
            FormGroup >
            <
            label > Username < /label> <
            Input defaultValue = "michael23"
            placeholder = "Username"
            type = "text" /
            >
            <
            /FormGroup> <
            /Col> <
            Col className = "pl-1"
            md = "4" >
            <
            FormGroup >
            <
            label htmlFor = "exampleInputEmail1" >
            Email address <
            /label> <
            Input placeholder = "Email"
            type = "email" / >
            <
            /FormGroup> <
            /Col> <
            /Row> <
            Row >
            <
            Col className = "pr-1"
            md = "6" >
            <
            FormGroup >
            <
            label > First Name < /label> <
            Input defaultValue = "Chet"
            placeholder = "Company"
            type = "text" /
            >
            <
            /FormGroup> <
            /Col> <
            Col className = "pl-1"
            md = "6" >
            <
            FormGroup >
            <
            label > Last Name < /label> <
            Input defaultValue = "Faker"
            placeholder = "Last Name"
            type = "text" /
            >
            <
            /FormGroup> <
            /Col> <
            /Row> <
            Row >
            <
            Col md = "12" >
            <
            FormGroup >
            <
            label > Address < /label> <
            Input defaultValue = "Melbourne, Australia"
            placeholder = "Home Address"
            type = "text" /
            >
            <
            /FormGroup> <
            /Col> <
            /Row> <
            Row >
            <
            Col className = "pr-1"
            md = "4" >
            <
            FormGroup >
            <
            label > City < /label> <
            Input defaultValue = "Melbourne"
            placeholder = "City"
            type = "text" /
            >
            <
            /FormGroup> <
            /Col> <
            Col className = "px-1"
            md = "4" >
            <
            FormGroup >
            <
            label > Country < /label> <
            Input defaultValue = "Australia"
            placeholder = "Country"
            type = "text" /
            >
            <
            /FormGroup> <
            /Col> <
            Col className = "pl-1"
            md = "4" >
            <
            FormGroup >
            <
            label > Postal Code < /label> <
            Input placeholder = "ZIP Code"
            type = "number" / >
            <
            /FormGroup> <
            /Col> <
            /Row> <
            Row >
            <
            Col md = "12" >
            <
            FormGroup >
            <
            label > About Me < /label> <
            Input type = "textarea"
            defaultValue = "Oh so, your weak rhyme You doubt I'll bother, reading into it" /
            >
            <
            /FormGroup> <
            /Col> <
            /Row> <
            Row >
            <
            div className = "update ml-auto mr-auto" >
            <
            Button className = "btn-round"
            color = "primary"
            type = "submit" >
            Update Profile <
            /Button> <
            /div> <
            /Row> <
            /Form> <
            /CardBody> <
            /Card> <
            /Col> <
            /Row> <
            /div> <
            />
        );
    }
}

export default User;