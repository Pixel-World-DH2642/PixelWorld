import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import { WelcomePage } from "./pages/WelcomePage";
import { Login } from "./containers/Login";
import { World } from "./containers/World";
import { Profile } from "./containers/Profile";
import { Museum } from "./containers/Museum";
import { Detail } from "./containers/Detail";
import { Provider } from "react-redux";
import configureReduxStore from "./app/store";

const store = configureReduxStore();

export function makeRouter() {
  return createHashRouter([
    {
      path: "/welcome",
      element: <WelcomePage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/world",
      element: <World />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/museum",
      element: <Museum />,
    },
    {
      path: "/details",
      element: <Detail />,
    },
    {
      path: "/",
      element: <Navigate to="/welcome" />,
    },
  ]);
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={makeRouter()} />
  </Provider>,
);
