import React from "react";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "./loader";
import { useNavigate } from "react-router-dom";
/* eslint eqeqeq: 0 */
const Table = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  let { Id } = useParams();
  const {
    setOpen,
    setIsUpdate,
    setProfiles,
    profiles,
    isDelete,
    setIsDelete,
    id,
    setId,
    listId,
    setListId,
  } = useContext(MyContext);

  const handleOpen = () => {
    setOpen(true);
    setIsUpdate(false);
  };

  const Delete = async (profileId) => {
    setIsLoadingButton(true);
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
      method: "DELETE",
      url: "http://localhost:5001/lists/removeProfile",
      data: body,
    };

    try {
      await axios.request(config);
      await GetProfiles();
      setIsLoadingButton(false);
    } catch (err) {
      if (!err.response.data.verified) {
        alert("Please Log in!");
        setIsLoadingButton(false);
        return;
      }
      alert("Something went wrong");
      setIsLoadingButton(false);
    }
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
  useEffect(() => {
    setListId(Id);
    GetProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col justify-center ml-3 mt-4 w-3/4">
      <div>
        <button
          onClick={handleOpen}
          className="bg-green-500 p-2 text-white rounded-md ml-2 hover:bg-green-700"
        >
          Create Profile
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-green-500 p-2 ml-24 text-white rounded-md hover:bg-green-700"
        >
          {`<< Back `}
        </button>
      </div>
      <div>
        <table className="table-auto m-2 w-3/4">
          <thead>
            <tr className="bg-gray-500 text-left">
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          {isLoading ? (
            <div className="flex items-center justify-center m-40">
              <Loader />
            </div>
          ) : (
            <tbody>
              {profiles.map((profile) => {
                return (
                  <tr key={profile.id} className="bg-gray-300">
                    <td>{profile.attributes.first_name}</td>
                    <td>{profile.attributes.email}</td>
                    <td>{profile.attributes.phone_number}</td>

                    <td>
                      {isDelete && profile.id == id ? (
                        <div>
                          <button
                            className="p-2 text-white rounded-md bg-red-500 w-16 hover:bg-red-600"
                            disabled={isLoading}
                            onClick={() => Delete(profile.id)}
                          >
                            {isLoadingButton && profile.id == id ? (
                              <Loader />
                            ) : (
                              "OK"
                            )}
                          </button>
                          <button
                            className="p-2 text-white rounded-md bg-yellow-500 ml-2 hover:bg-yellow-600"
                            onClick={() => setIsDelete(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="p-2 text-white rounded-md bg-red-500  hover:bg-red-700"
                          onClick={() => {
                            setIsDelete(true);
                            setId(profile.id);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Table;
