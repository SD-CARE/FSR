import React, { useState, useContext } from "react";
import { Context } from "../Context";
import { useNavigate } from "react-router-dom";
import Form from "./Form";
function CreateCarer() {
  const { sDData } = useContext(Context);
  // Create a carer Intance
  const [carer, setCarer] = useState({
    forename: "",
    surname: "",
    initials: "",
    NPC: "",
  });

  const navigate = useNavigate();
  // create an errors instance in state and set it to an empty array
  const [errors, setErrors] = useState([]);

  const change = (e) => {
    const { name, value } = e.target;
    setCarer((carer) => ({ ...carer, [name]: value }));
  };
  const submit = (e) => {
    e.preventDefault();
    sDData
      .createCarer(carer)
      .then((errors) => {
        if (errors.length) {
          setErrors(errors);
        } else {
          navigate("/appointments/1");
        }
      })
      .catch((err) => {
        console.log(err);
        // navigate("/");
      });
  };

  // create the cancel function
  const cancel = () => {
    navigate("/carers");
  };

  return (
    <div className="form--centered">
      <h2>Create Carer</h2>
      <Form
        cancel={cancel}
        errors={errors}
        submit={submit}
        submitButtonText="Create"
        elements={() => (
          <>
            <label htmlFor="forename">First Name</label>
            <input
              id="forename"
              name="forename"
              type="text"
              value={carer.forename}
              onChange={change}
            />

            <label htmlFor="surname">Last Name</label>
            <input
              id="surname"
              name="surname"
              type="text"
              value={carer.surname}
              onChange={change}
            />

            <label htmlFor="initials">Carer Initials</label>
            <input
              id="initials"
              name="initials"
              type="text"
              value={carer.initials}
              onChange={change}
            />

            <label htmlFor="npc">NPC</label>
            <input
              id="npc"
              name="npc"
              type="text"
              value={carer["NPC"]}
              onChange={change}
            />
          </>
        )}
      />
    </div>
  );
}
export default CreateCarer;
