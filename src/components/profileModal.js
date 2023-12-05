import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Box, Modal } from "@material-ui/core";
import axios from "axios";
import { useContext, useState } from "react";
import { MyContext } from "../Context";
import Loader from "./loader";
import { useParams } from "react-router-dom";
/* eslint-disable no-useless-escape */
const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Too Short")
    .max(30, "Too Long")
    .required("Required"),
  email: Yup.string()
    .email("Invalid Email")
    .required("Required")
    .matches(emailRegex, "Invalid Email"),
  phone: Yup.number().required("Required"),
});
const ProfileModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { Id } = useParams();
  const {
    open,
    setOpen,
    submit,
    setSubmit,
    isUpdate,
    initialState,
    setInitialState,
    setProfiles,
    listId,
  } = useContext(MyContext);
  const handleClose = () => {
    setOpen(false);
  };

  const CreateProfile = async (values) => {
    setIsLoading(true);
    const name = values.name;
    const email = values.email;
    const phone = values.phone;
    const body = {
      token: localStorage.getItem("jwt"),
      data: {
        type: "profile",
        attributes: {
          first_name: name,
          email: email,
          phone_number: phone,
        },
      },
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5001/profiles/",
      data: body,
    };

    try {
      const response = await axios.request(config);
      const data = await response.data;
      console.log(data);
      const profileId = data.res.data.id;
      await AddProfileToList(profileId);
      await GetProfiles();
      handleClose();
      setIsLoading(false);
    } catch (err) {
      if (!err.response.data.verified) {
        alert("Please Log in!");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      alert("Phone or Email already exists!");
    }
  };
  const AddProfileToList = async (profileId) => {
    const body = {
      token: localStorage.getItem("jwt"),
      listId: listId,
      data: {
        data: [
          {
            type: "profile",
            id: profileId,
          },
        ],
      },
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5001/lists/addProfile/",
      data: body,
    };

    await axios.request(config);
  };
  const GetProfiles = async () => {
    setIsLoading(true);
    const body = {
      token: localStorage.getItem("jwt"),
    };
    let config = {
      method: "post",
      url: `http://localhost:5001/lists/${Id}/profiles/get`,
      data: body,
    };
    try {
      const response = await axios.request(config);
      const data = response.data;
      setProfiles(data.data.data);
      setIsLoading(false);
    } catch (err) {
      if (!err.response.data.verified) {
        alert("Please Log in!");
        setIsLoading(false);
        return;
      }
      alert("Something went wrong!");
      setIsLoading(false);
    }
  };
  const clear = () => {
    setIsLoading(false);
    handleClose();
    setInitialState({
      name: "",
      email: "",
      phone: "",
    });
    setSubmit(true);
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        className="flex justify-center items-center bg-white"
      >
        <Box className="bg-green-100 rounded-lg w-auto p-5">
          <Formik
            initialValues={initialState}
            validationSchema={FormSchema}
            onSubmit={(values) => {
              if (submit) {
                CreateProfile(values);
              }
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
                  <label className="text-lg">Name</label>
                  <br />
                  <input
                    value={values.name}
                    onBlur={handleBlur}
                    name="name"
                    className="border border-gray-700 text-lg p-1 rounded-lg"
                    onChange={handleChange}
                  ></input>
                  {errors.name && touched.name ? (
                    <div style={{ color: "red" }}>{errors.name}</div>
                  ) : null}
                  <br />
                  <label className="text-lg">Email</label>
                  <br />
                  <input
                    value={values.email}
                    onBlur={handleBlur}
                    name="email"
                    className="border border-gray-700 text-lg p-1 rounded-lg"
                    onChange={handleChange}
                  ></input>
                  {errors.email && touched.email ? (
                    <div style={{ color: "red" }}>{errors.email}</div>
                  ) : null}
                  <br />
                  <label className="text-lg">Phone</label>
                  <br />
                  <input
                    value={values.phone}
                    onBlur={handleBlur}
                    name="phone"
                    className="border border-gray-700 text-lg p-1 rounded-lg"
                    onChange={handleChange}
                  ></input>
                  {errors.phone && touched.phone ? (
                    <div style={{ color: "red" }}>{errors.phone}</div>
                  ) : null}
                  <br />
                  {submit && (
                    <button
                      type="submit"
                      className="bg-green-600 ml-2 mt-2 rounded-md text-white p-2 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader /> : "Create"}
                    </button>
                  )}

                  {isUpdate && (
                    <button className="bg-yellow-400 ml-2 mt-0 rounded-md text-white p-2 hover:bg-yellow-500">
                      Update
                    </button>
                  )}
                  <button
                    className="bg-red-500 ml-2 mt-2 rounded-md text-white p-2 hover:bg-red-700"
                    onClick={clear}
                  >
                    Cancel
                  </button>
                </form>
              );
            }}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default ProfileModal;
