// Renders a "Sign In" page for existing users
// Renders a "Sign In" button
// Renders a "Cancel" button that redirects to '/'

import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from "./Form";
import { Context } from "../Context";

function UserSignIn() {
  // create a user object in state
  const [user, setUser] = useState({ emailAddress: "", password: "" });
  // create an errors instance in state and set it to an empty array
  const [errors, setErrors] = useState([]);
  // pull in the signIn method from context
  const { signIn } = useContext(Context);
  // store the useNavigate method in a constant
  const navigate = useNavigate();
  // store the useLocation method in a constant
  const location = useLocation();

  // create the change function
  const change = (e) => {
    // create a name and value constant to hold the events on the input targets
    const name = e.target.name;
    const value = e.target.value;

    // set the user to value of the inputs as key value pairs
    setUser((user) => ({ ...user, [name]: value }));
  };

  // create the submit function
  const submit = () => {
    // destructure the user
    const { emailAddress, password } = user;
    // pass the emailAdress and password to the sigIn method then
    signIn(emailAddress, password)
      .then(() => {
        // if the emailAddress or password are empty
        if (emailAddress === "" || password === "") {
          // set the errors to a custom message
          setErrors(["Invalid password or Email"]);
          // else if there is a location other than the default
        } else {
          if (location.state?.from) {
            // navigate back to that location
            navigate(location.state.from);
            // else navigate to the root /
          } else {
            navigate("/");
          }
        }
      })
      // catch any errors throw by the api and console log them
      .catch((err) => {
        console.log(err);
        // then navigate to /error
        navigate("/error");
      });
  };

  // create the cancel function
  const cancel = () => {
    navigate("/");
  };
  return (
    <div className="form--centered">
      <h2>Sign In</h2>
      <Form
        cancel={cancel}
        errors={errors}
        submit={submit}
        submitButtonText="Sign In"
        elements={() => (
          <>
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
    </div>
  );
}

export default UserSignIn;
