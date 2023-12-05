import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Box, Modal } from "@material-ui/core";
import axios from "axios";
import { useContext } from "react";
import Loader from "./loader";
import { MyContext } from "../Context";
const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Too Short")
    .max(30, "Too Long")
    .required("Required"),
});
const ListModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    open,
    setOpen,
    submit,
    setSubmit,
    setLists,
    initialState,
    setInitialState,
  } = useContext(MyContext);
  const handleClose = () => {
    setOpen(false);
  };

  const CreateList = async (values) => {
    setIsLoading(true);
    const name = values.name;
    const data = {
      token: localStorage.getItem("jwt"),
      data: {
        type: "list",
        attributes: {
          name: name,
        },
      },
    };

    let config = {
      method: "post",
      url: "http://localhost:5001/lists/",
      data,
    };
    try {
      const response = await axios.request(config);
      console.log("Create List Response", response.data);
      handleClose();
      await GetLists();
      setIsLoading(false);
    } catch (err) {
      /* eslint eqeqeq: 0 */
      console.log(err.response.data.verified);
      if (err.response.data.verified == true) {
        alert("Please Log in!");
        setIsLoading(false);
        return;
      }
      alert("List not created! Try again");
      setIsLoading(false);
    }
  };

  const GetLists = async () => {
    setIsLoading(true);
    const body = {
      token: localStorage.getItem("jwt"),
    };

    let config = {
      method: "post",
      url: "http://localhost:5001/lists/get",
      data: body,
    };
    try {
      const response = await axios.request(config);
      const res = await response.data;
      setLists(res.data.data);
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
        <Box className="flex justify-center bg-green-100 rounded-lg w-auto p-10">
          <Formik
            initialValues={initialState}
            validationSchema={FormSchema}
            onSubmit={(values) => {
              if (submit) {
                CreateList(values);
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
                  {submit && (
                    <button
                      type="submit"
                      className="bg-green-500 ml-2 mt-2 rounded-md text-white p-2 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader /> : "Create"}
                    </button>
                  )}
                  <button
                    className="bg-red-500 ml-2 mt-2 rounded-md text-white p-2 hover:bg-red-600"
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

export default ListModal;
