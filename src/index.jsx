import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import { Welcome } from "./containers/Welcome";
import { Login } from "./containers/Login";
import { World } from "./containers/World";
import { Profile } from "./containers/Profile";
import { Museum } from "./containers/Museum";
import { Detail } from "./containers/Detail";
import { Provider } from "react-redux";
import configureReduxStore from "./app/store";
import { connectToPersistance } from "./app/firebase";
import { Layout } from "./components/Layout";
import { WorldLayout } from "./components/WorldLayout";
import muiTheme from "./styles/muiTheme";

const store = configureReduxStore();
connectToPersistance(store);

export function makeRouter() {
  return createHashRouter([
    {
      path: "/welcome",
      element: (
        <Layout>
          <Welcome />
        </Layout>
      ),
    },
    {
      path: "/login",
      element: (
        <Layout>
          <Login />
        </Layout>
      ),
    },
    {
      path: "/world",
      element: (
        <WorldLayout>
          <World />
        </WorldLayout>
      ),
    },
    {
      path: "/profile",
      element: (
        <Layout>
          <Profile />
        </Layout>
      ),
    },
    {
      path: "/museum",
      element: (
        <Layout>
          <Museum />
        </Layout>
      ),
    },
    {
      path: "/details",
      element: (
        <Layout>
          <Detail />
        </Layout>
      ),
    },
    {
      path: "/",
      element: <Navigate to="/welcome" />,
    },
  ]);
}

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={muiTheme}>
    <Provider store={store}>
      <RouterProvider router={makeRouter()} />
    </Provider>
  </ThemeProvider>,
);
