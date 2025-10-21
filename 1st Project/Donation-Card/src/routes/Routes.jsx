import { createBrowserRouter } from "react-router-dom";
import DonationCard from "../Components/DonationCard/DonationCard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DonationCard/>,
  },
]);