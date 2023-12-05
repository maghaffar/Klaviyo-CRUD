import React from "react";
import Main from "./pages/main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfileMain from "./pages/profileMain";
import Provider from "./Context";
import SignUp from "./components/signup";
import LogIn from "./components/login";
import PrivateRoutes from "./utils/PrivateRoutes";
const App = () => {
  const verified = JSON.parse(localStorage.getItem("verified"));

  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Main />} path="/"></Route>
            <Route element={<ProfileMain />} path="/lists/:Id/profiles"></Route>
          </Route>
          <Route
            element={verified ? <Main /> : <LogIn />}
            path="/login"
          ></Route>
          <Route
            element={verified ? <Main /> : <SignUp />}
            path="/signup"
          ></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
