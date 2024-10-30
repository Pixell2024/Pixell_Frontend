import React, { useEffect, useState } from "react";

import img1 from "../../shared/assets/icons/image 22.png";
import img2 from "../../shared/assets/icons/image 22.png";
import img3 from "../../shared/assets/icons/image 23.png";
import img4 from "../../shared/assets/icons/image 23 (1).png";
import img6 from "../../shared/assets/icons/image 24.png";
import img5 from "../../shared/assets/icons/image 25.png";
import { FaWeight } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import CustomButton from "../../shared/utils/Button";

const productTour = [
  {
    main: "Introduction",
    title: "Overview",
    img: img1,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tristique ipsum vel est egestas tempor. Nunc in dolor eu sapien mollis convallis eu sit amet libero. Etiam aliquet orci vel auctor sollicitudin.",
  },
  {
    main: "Introduction",
    title: "Service",
    img: img1,
    content:
      "Our Services feature offers a comprehensive range of solutions tailored to meet your specific business needs. From strategic planning to execution, we provide expert support to optimize your processes and enhance your outcomes. ",
  },
  {
    main: "Features",
    title: "Generate RFPs",
    img: img1,
    content:
      "Generate RFPsfeature streamlines the creation of Request for Proposals, saving you time and effort. It provides customizable templates and guided workflows to ensure your RFPs are professional, clear, and comprehensive.",
  },
  {
    main: "Features",
    title: "Personal Account Manager",
    img: img2,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tristique ipsum vel est egestas tempor. Nunc in dolor eu sapien mollis convallis eu sit amet libero. Etiam aliquet orci vel auctor sollicitudin.",
  },
  {
    main: "Features",
    title: "Track Campaigns",
    img: img3,

    content:
      "Personal Account Manage feature provides dedicated support to help you manage your account efficiently. Your manager offers personalized guidance, answers questions, and assists with strategy to ensure you get the most out of our services",
  },
  {
    main: "Features",
    title: "Collab with your team",
    img: img4,
    content:
      "The  feature allows you to monitor your marketing campaigns in real time, providing insights into performance metrics and audience engagement. It helps you optimize strategies by visualizing key data points, such as conversion rates and ROI.",
  },
  {
    main: "Features",
    title: "Download campaign reports",
    img: img6,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tristique ipsum vel est egestas tempor. Nunc in dolor eu sapien mollis convallis eu sit amet libero. Etiam aliquet orci vel auctor sollicitudin.",
  },
];

const ProductTourCard = ({ isModalOpen, setIsModalOpen }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < productTour.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const modalClose = () => {
    setIsModalOpen(false);
  };
  const SubmitDone = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={`flex h-full w-full justify-center items-center ${
        isModalOpen ? `` : `hidden`
      } `}
    >
      <div
        className=" rounded-lg shadow-2xl relative top-15 p-2 bg-white  z-50 "
        style={{ height: "500px", width: "410px" }}
      >
        <div
          className="flex justify-center items-center mb-3 ml-20 "
          style={{ width: "250px", height: "250px" }}
        >
          <img
            src={productTour[currentIndex].img}
            alt=""
            className=" max-w-full
            max-h-full
            object-contain"
          />
        </div>
        <div className="p-2  ">
          <div className="mb-2">
            <div
              style={{
                width: "90px",
                height: "27px",
                color: "var(--primary-color)",
                background: "var(--bg-color)",
                fontWeight: "500",
                borderRadius: "20px",
                fontSize: "12px",
              }}
              className="flex justify-center item-center p-1"
            >
              {productTour[currentIndex].main}
            </div>
            <div className=" h-32 w-full mt-3">
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "var(--heading-color)",
                  margin: "1rem 0 0.3rem 0",
                }}
              >
                {productTour[currentIndex].title}
              </p>
              <p>{productTour[currentIndex].content}</p>
            </div>
          </div>
          <div className="button mt-0 ">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                {productTour.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      height: index === currentIndex ? "10px" : "8px",
                      width: index === currentIndex ? "10px" : "8px",
                      backgroundColor:
                        index === currentIndex ? "#418cff" : "lightblue",
                      borderRadius: "50%",
                    }}
                    className="shadow-md"
                  ></div>
                ))}
              </div>
              <div className="save">
                {currentIndex === productTour.length - 1 ? (
                  <CustomButton
                    text={"Done"}
                    color="primary"
                    onClick={SubmitDone}
                  />
                ) : (
                  // Render Next and Skip buttons normally
                  <div className="flex  ">
                    <div onClick={modalClose} className="mt-1 mr-5">
                      <Link
                        to="/user/dashboard"
                        className="h-5 w-7"
                        style={{
                          fontWeight: "400",
                          color: "var(--para-color)",
                          fontSize: "14px",
                        }}
                      >
                        Skip
                      </Link>
                    </div>
                    <CustomButton
                      onClick={handleNext}
                      text={"Next"}
                      color="primary"
                    ></CustomButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTourCard;
