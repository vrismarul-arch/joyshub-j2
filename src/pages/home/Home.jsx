import React from "react";
import { Helmet } from "react-helmet";
import WizardForm from "../form/WizardForm";
import Navbar from "../../components/Navbar";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Serviced Apartments & Premium Rentals | Zenova Stays Porur</title>
        <meta
          name="description"
          content="Discover serviced apartments and premium rentals at Zenova Stays Porur. Comfortable stays in Chennai with low prices, modern rooms, and easy booking."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <Navbar />
      <WizardForm style={{ marginTop: "60px" }} />
      {/* <Footer /> */}
    </>
  );
};

export default Home;
