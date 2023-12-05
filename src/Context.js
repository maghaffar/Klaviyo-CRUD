import { createContext, useState } from "react";
import React from "react";
export const MyContext = createContext("");

const Provider = ({ children }) => {
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [submit, setSubmit] = useState(true);
  const [isUpdate, setIsUpdate] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [lists, setLists] = useState([]);
  const [listId, setListId] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [verified, setVerified] = useState();
  const [initialState, setInitialState] = useState({
    name: "",
  });
  const [profileInitialState, setProfileInitialState] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [authInitialState, setAuthInitialState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const value = {
    id,
    setId,
    open,
    setOpen,
    submit,
    setSubmit,
    isUpdate,
    setIsUpdate,
    isDelete,
    setIsDelete,
    lists,
    setLists,
    initialState,
    setInitialState,
    listId,
    setListId,
    profiles,
    setProfiles,
    profileInitialState,
    setProfileInitialState,
    authInitialState,
    setAuthInitialState,
    verified,
    setVerified,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default Provider;
