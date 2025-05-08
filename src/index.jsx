import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import { Welcome } from "./containers/Welcome";
import { Login } from "./containers/Login";
import { World } from "./containers/World";
import { Profile } from "./containers/Profile";
import { Museum } from "./containers/Museum";
import { Detail } from "./containers/Detail";
import { Provider } from "react-redux";
import configureReduxStore from "./app/store";
import { connectToPersistance } from "./app/firebase";
import { uploadPaintings } from "./utils/uploadPaintings"; // Import the upload function

const store = configureReduxStore();
connectToPersistance(store);

export function makeRouter() {
  return createHashRouter([
    {
      path: "/welcome",
      element: <Welcome />,
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
