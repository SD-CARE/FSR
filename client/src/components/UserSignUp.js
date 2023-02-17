// Renders a "Sign Up" page for new users
/**
 * Renders a "Sign Up" button that POST
 * to /api/users and signs in the user
 **/
// Renders a "Canel" button that redirects to '/'

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "./Form";
import { Context } from "../Context";

function UserSignUp() {
  // pull in the data and signIn methods from the context
  const { noAuth, signIn } = useContext(Context);
  // create a user instence in the component state and set it to an object
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  });

  // create the errors instence in state and set it to an empty array
  const [errors, setErrors] = useState([]);
  // store the useNavigate method to a constant
  const navigate = useNavigate();

  // create the change function
  const change = (e) => {
    // create the name and value constants to store events from the inputs
    const { name, value } = e.target;
    // set the user to take the data from the inputs as key value pairs
    // spreading the already exiting contents
    setUser((user) => ({ ...user, [name]: value }));
  };

  // create the submit function
  const submit = () => {
    //  get the createUser method from context and pass the user object as a param
    noAuth
      .createUser(user)
      //  then if there is any errors
      .then((errors) => {
        if (errors.length) {
          // set the errors array to display them
          setErrors(errors);
          // else signIn with user emailAddress and password
        } else {
          signIn(user.emailAddress, user.password)
            // then navigate to root /
            .then(() => navigate("/"));
        }
      })
      // catch any errors thrown by the api and log them to the console
      .catch((err) => {
        console.log(err);
        // navigate to the /error
        navigate("/error");
      });
  };

  // create the cancel function
  const cancel = () => {
    navigate("/");
  };
  return (
    <div className="form--centered">
      <h2>Sign Up</h2>
      <Form
        cancel={cancel}
        errors={errors}
        submit={submit}
        submitButtonText="Sign Up"
        elements={() => (
          <>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={user.firstName}
              onChange={change}
            />

            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={user.lastName}
              onChange={change}
            />

            <label htmlFor="emailAddress">Email Address</label>
            <input
              id="emailAddress"
              name="emailAddress"
              type="email"
              value={user.emailAddress}
              onChange={change}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={user.password}
              onChange={change}
            />
          </>
        )}
      />
      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
}

export default UserSignUp;
