import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Logo from "../../assets/stethoscope.png";
import styles from "../../style";
import { useNavigate } from "react-router-dom";


ChartJS.register(ArcElement, Tooltip, Legend);

const ApiFetch = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState({});
  const resapi = "https://disease.sh/v3/covid-19/all";

  const fetch = async () => {
    try {
      const res = await axios.get(resapi);
      setValue(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // Prepare data for the pie chart
  const data = {
    labels: [
      "Active Cases",
      "Recovered Cases",
      "Deaths",
      "Total Cases",
      "Critical Cases",
      "Tests Conducted",
      "Population",
    ],
    datasets: [
      {
        label: "COVID-19 Statistics",
        data: [
          value.active,
          value.recovered,
          value.deaths,
          value.cases,
          value.critical,
          value.tests,
          value.population,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Active Cases
          "rgba(54, 162, 235, 0.6)", // Recovered Cases
          "rgba(255, 99, 132, 0.6)", // Deaths
          "rgba(255, 205, 86, 0.6)", // Total Cases
          "rgba(153, 102, 255, 0.6)", // Critical Cases
          "rgba(201, 203, 207, 0.6)", // Tests Conducted
          "rgba(255, 159, 64, 0.6)", // Population
        ],
      },
    ],
  };

  return (
    <>
      <div className="w-full  shadow-md top-0 sticky z-50 bg-[#F9FAFB]">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth} z-10`}>
            {/* Navbar */}
            <div className="interfont flex items-center justify-between p-3 ">
              <div
                id="headlineLogo"
                className="rounded-full flex items-center justify-between space-x-2"
              >
                <img
                  onClick={() => {
                    navigate("/");
                  }}
                  className="w-[2.7rem] h-[2.7rem] cursor-pointer"
                  src={Logo}
                  alt="Logo"
                />
                <h1
                  onClick={() => {
                    navigate("/");
                  }}
                  className="flex items-center justify-center space-x-1 text-xl font-bold cursor-pointer"
                >
                  <span className="text-[#76c3ed]">Easy</span>
                  <span>Doc</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-5 mt-8">
        <h1 className="text-center text-2xl font-bold mb-4">
          COVID-19 Statistics
        </h1>
        <div className="w-[500px] container mx-auto">
          {value.cases ? (
            <Pie data={data} />
          ) : (
            <div className="flex h-screen w-full">
              <div className="m-auto text-center font-bold text-[1.5rem]">
                <h3 className="text-gray-600 mt-[-10rem]">Loading From API</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApiFetch;
