import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/custom/Header";
import CreateTripsPage from "./create-trip/index.jsx";
import Viewtrip from "./view-trip/[tripId]";
import LandingPage from "./components/custom/LandingPage";
import DeleteAllComponent from "./view-trip/components/deletex";
import ScrollToTop from "./components/custom/ScrollToTop";
import Footer from "./components/custom/Footer";

// ✅ Define a root layout component
const RootLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer/>
    <ScrollToTop /> {/* ✅ Moved inside RootLayout so it works on all pages */}
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout><LandingPage /></RootLayout>,
  },
  {
    path: "/create-trip",
    element: <RootLayout><CreateTripsPage /></RootLayout>,
  },
  {
    path: "/view-trip/:tripId",
    element: <RootLayout><Viewtrip /></RootLayout>,
  },
  {
    path: "/delete",
    element: <RootLayout><DeleteAllComponent/></RootLayout>,
  },
]);

const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <RouterProvider router={router} />
    <Toaster />
  </GoogleOAuthProvider>
);
