import React, { useContext, useState } from "react";
import Form from "./Form";
import { Context } from "../Context";
import { useNavigate } from "react-router-dom";

function Evaluate() {
  const { sDData, currentCarer, signIn } = useContext(Context);
  // create a user instence in the component state and set it to an object
  const [user] = useState({
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
  // const change = (e) => {
  //   // create the name and value constants to store events from the inputs
  //   const { name, value } = e.target;
  //   // set the user to take the data from the inputs as key value pairs
  //   // spreading the already exiting contents
  //   setUser((user) => ({ ...user, [name]: value }));
  // };

  // create the submit function
  const submit = () => {
    //  get the createUser method from context and pass the user object as a param
    sDData
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
    navigate("/carers/1");
  };
  return (
    <div className="form--centered">
      <h2>Assess {currentCarer.forename}</h2>
      <Form
        cancel={cancel}
        errors={errors}
        submit={submit}
        submitButtonText="Save"
        elements={() => (
          <>
            <div>
              <p>
                <span>1:</span>
              </p>
            </div>
            <div>
              <p>
                <span>2:</span>
              </p>
            </div>
            <div>
              <p>
                <span>3:</span>
              </p>
            </div>
            <div>
              <p>
                <span>4:</span>
              </p>
            </div>
            <div>
              <p>
                <span>5:</span>
              </p>
            </div>
            <div>
              <p>
                <span>6:</span>
              </p>
            </div>
            <div>
              <p>
                <span>7:</span>
              </p>
            </div>
            <div>
              <p>
                <span>8:</span>
              </p>
            </div>
            <div>
              <p>
                <span>9:</span>
              </p>
            </div>
            <div>
              <p>
                <span>10:</span>
              </p>
            </div>
            <div>
              <p>
                <span>11:</span>
              </p>
            </div>
            <div>
              <p>
                <span>12:</span>
              </p>
            </div>
          </>
        )}
      />
    </div>
  );
}

export default Evaluate;
