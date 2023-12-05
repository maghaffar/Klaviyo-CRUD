import React, { useContext, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Loader from "./loader";
import { MyContext } from "../Context";
import { Input } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
/* eslint-disable no-useless-escape */
const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
const FormSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid Email")
    .required("Required")
    .matches(emailRegex, "Invalid Email"),
  password: Yup.string().required("Required"),
});
const LogIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { authInitialState } = useContext(MyContext);

  const logIn = async (values) => {
    setIsLoading(true);
    const data = {
      email: values.email,
      password: values.password,
      token: localStorage.getItem("jwt"),
    };

    const config = {
      method: "POST",
      url: "http://localhost:5001/user/logIn",
      data: data,
    };
    try {
      const response = await axios.request(config);
      /* eslint eqeqeq: 0 */
      if (response.data.res == 1) {
        localStorage.setItem("jwt", response.data.token);
        localStorage.setItem("verified", true);
        navigate("/");
      } else {
        alert("Email or Password is Incorrect!");
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      alert(err);
    }
  };

  return (
    <div>
      <div className="container mx-auto mt-32 flex flex-col justify-center items-center">
        <div className="font-bold font-sans mt-5 text-lg">
          Welcome to Klaviyo!
        </div>
        <div className=" mt-5 bg-green-100 w-1/3 p-10 rounded-lg ">
          <Formik
            initialValues={authInitialState}
            validationSchema={FormSchema}
            onSubmit={(values) => {
              logIn(values);
            }}
          >
            {({
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              values,
            }) => {
              return (
                <form className="ml-2" onSubmit={handleSubmit}>
                  <label className="text-lg">Email</label>
                  <br />
                  <Input
                    value={values.email}
                    onBlur={handleBlur}
                    name="email"
                    className="border border-gray-700 text-lg p-1 rounded-lg"
                    onChange={handleChange}
                  />
                  {errors.email && touched.email ? (
                    <div style={{ color: "red" }}>{errors.email}</div>
                  ) : null}
                  <br />
                  <label className="text-lg">Password</label>
                  <br />
                  <Input.Password
                    value={values.password}
                    onBlur={handleBlur}
                    name="password"
                    className="border border-gray-700 text-lg p-1 rounded-lg"
                    onChange={handleChange}
                  />
                  {errors.password && touched.password ? (
                    <div className="w-48" style={{ color: "red" }}>
                      {errors.password}
                    </div>
                  ) : null}
                  <br />
                  <button
                    type="submit"
                    className="bg-green-600  mt-5 w-full rounded-md text-white p-2 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader /> : "Login"}
                  </button>
                  <div className="mt-2 flex gap-1 ">
                    <p className="text-sm">Don't have an account?</p>
                    <Link
                      to="/signup"
                      className="text-sm text-purple-500 hover:underline"
                    >
                      Register
                    </Link>
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
