import React from 'react';
import ReactDOM from 'react-dom';
import User from '../../views/User';

it("User view render correctly", () => {
    const div = document.createElement("div");
    ReactDOM.render(<User></User>, div);
})
 