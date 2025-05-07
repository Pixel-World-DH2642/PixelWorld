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

// Initialize Firestore data
async function initializeFirestoreData() {
  try {
    console.log('Checking and uploading paintings data to Firestore if needed...');
    await uploadPaintings();
    console.log('Firestore data initialization complete');
  } catch (error) {
    console.error('Error initializing Firestore data:', error);
  }
}

// Call the initialization function
initializeFirestoreData();

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