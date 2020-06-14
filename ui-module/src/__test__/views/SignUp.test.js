import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from '../../views/SignUp';

it("SignUp view render correctly", () => {
    const div = document.createElement("div");
    ReactDOM.render(<SignUp></SignUp>, div);
})
 