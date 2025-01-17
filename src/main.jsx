import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  HomePage,
  MyReservationPage,
  MyPage,
  RulesPage,
  FormPage,
  LoginPage,
  FormSubmitPage,
  JoinPage,
  AdminPage,
} from "./pages";
import { AppFrame, PrivateRouter } from "./layouts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppFrame />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/reservation", element: <MyReservationPage /> },
      { path: "/mypage", element: <MyPage /> },
      { path: "/rules", element: <RulesPage /> },
    ],
  },
  { path: "/form", element: <FormPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/join", element: <JoinPage /> },
  { path: "/complete", element: <FormSubmitPage /> },
  {
    element: <PrivateRouter />,
    children: [{ path: "/admin", element: <AdminPage /> }],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
