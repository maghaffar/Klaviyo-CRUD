import React from "react";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context";
import { Link } from "react-router-dom";
import Loader from "./loader";
import axios from "axios";
/* eslint eqeqeq: 0 */
const Table = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const {
    id,
    setId,
    setOpen,
    setIsUpdate,
    isDelete,
    setIsDelete,
    lists,
    setLists,
  } = useContext(MyContext);
  const handleOpen = () => {
    setOpen(true);
    setIsUpdate(false);
  };

  const Delete = async (listID) => {
    setIsLoadingButton(true);
    const body = {
      token: localStorage.getItem("jwt"),
    };
    let config = {
      method: "DELETE",
      url: `http://localhost:5001/lists/${listID}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    };
    try {
      const response = await axios.request(config);
      console.log(response.data);
      await GetLists();
      setIsLoadingButton(false);
    } catch (err) {
      if (!err.response.data.verified) {
        alert("Please Log in!");
        setIsLoadingButton(false);
        return;
      }
      alert("Something went wrong in Deletion.");
      setIsLoadingButton(false);
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

  const logOut = () => {
    localStorage.setItem("verified", false);
    localStorage.removeItem("jwt");
    window.location.reload();
  };
  useEffect(() => {
    GetLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div className="flex flex-col justify-center ml-3 mt-4 w-2/4">
        <div>
          <button
            onClick={handleOpen}
            className="bg-green-500 p-2 text-white rounded-md ml-2 hover:bg-green-700"
          >
            Create List
          </button>
        </div>
        <div>
          <table className="table-auto m-2 w-2/4">
            <thead>
              <tr className="bg-gray-500 text-left">
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            {isLoading ? (
              <Loader />
            ) : (
              <tbody>
                {lists.map((list) => {
                  return (
                    <tr key={list.id} className="bg-gray-300">
                      <td>
                        <Link
                          to={`/lists/${list.id}/profiles`}
                          onClick={() => setIsLoading(true)}
                        >
                          {list.attributes.name}
                        </Link>
                      </td>
                      <td>
                        {isDelete && list.id == id ? (
                          <div>
                            <button
                              className="p-2 text-white rounded-md bg-red-500 w-16 hover:bg-red-600"
                              disabled={isLoading}
                              onClick={() => Delete(list.id)}
                            >
                              {isLoadingButton && list.id == id ? (
                                <Loader />
                              ) : (
                                "OK"
                              )}
                            </button>
                            <button
                              className="p-2 text-white rounded-md bg-yellow-500 ml-2 hover:bg-yellow-700"
                              onClick={() => setIsDelete(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setIsDelete(true);
                              setId(list.id);
                            }}
                            className="p-2 text-white rounded-md bg-red-500 hover:bg-red-700"
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
          <div>
            <button
              className="bg-red-500 p-2 text-white rounded-md ml-2 hover:bg-red-400"
              onClick={() => logOut()}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
