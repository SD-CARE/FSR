import React, { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../Context";

function UserSignOut() {
  // pull in the signOut method from the context
  const { signOut } = useContext(Context);

  // when the component mounts
  // bring in the signOut functionality
  useEffect(() => signOut());

  return <Navigate to="/" />;
}

export default UserSignOut;
