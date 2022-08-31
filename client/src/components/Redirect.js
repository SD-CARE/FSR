import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context";
import { Outlet, Navigate, useParams, useNavigate } from "react-router-dom";

function RedirectRoute() {
  // call the authenticated user and data from context
  const { authenticatedUser, data } = useContext(Context);
  // create course instance in state and set it to null
  const [course, setCourse] = useState(null);
  //   create a change instance in state and set it to false
  const [change, setChange] = useState(false);
  //   create loading instance in state and set it to true
  const [Loading, setLoading] = useState(true);
  //   get the id from router using useParams
  const { id } = useParams();
  //   store the useNavigate() in a constant
  const navigate = useNavigate();

  //   when the component mounts
  useEffect(() => {
    //   get "courseDetail" from the data and pass the id as a param
    data
      .courseDetail(id)
      // If the response is there setCourse state
      //else navigate to not found
      .then((res) => (res ? setCourse(res) : navigate("/notfound")))
      //   catch any errors from the api and console log them
      .catch((err) => console.log(err));
  }, []);

  //   when the component mounts
  useEffect(() => {
    // if there is a course and an authenticated user
    if (course && authenticatedUser) {
      // setloading to false
      setLoading(false);
      //   if course.user.id is === authenticatedUser.id
      course.userId === authenticatedUser.id
        ? //   setChange to true
          setChange(true)
        : // else setchange to false
          setChange(false);
    } else {
      // else setLoading to true
      setLoading(true);
    }
  }, [course, authenticatedUser]);

  return (
    <>{Loading ? <></> : change ? <Outlet /> : <Navigate to="forbidden" />}</>
  );
}

export default RedirectRoute;
