import React from 'react';
import ReactDOM from 'react-dom';
import ForgotPassword from '../../views/ForgotPassword';

it("ForgotPassword view render correctly", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ForgotPassword></ForgotPassword>, div);
})
 