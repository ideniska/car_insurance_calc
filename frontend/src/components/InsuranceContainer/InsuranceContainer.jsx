import React from "react";
import "./InsuranceContainer.css";
import { useState, useEffect } from "react";
import InsuranceSteps from "../InsuranceSteps/InsuranceSteps";
import FirstStep from "../../pages/first/FirstStep";
import SecondStep from "../../pages/second/SecondStep";
import NextButton from "../InsuranceStepsNextButton";
import PrevButton from "../InsuranceStepsPrevButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

export default function InsuranceContainer() {
  const apiBaseUrl = window.location.href + "api/";
  // const apiBaseUrl = "http://127.0.0.1:8000/api/";
  const [currentStep, setCurrentStep] = useState(0);
  const [carInfo, setCarInfo] = useState({
    model: null,
    year: null,
    trim: null,
  });

  const [nextButtonDisabled, setNextButtonDisabled] = useState("disabled");

  const [userData, setUserData] = useState({
    name: null,
    phone: null,
    birthDate: "1987/12/01",
    driverLicence: null,
    yearIssued: null,
  });

  let currentStepComponent = (
    <FirstStep
      setCarInfo={setCarInfo}
      carInfo={carInfo}
      setUserData={setUserData}
      userData={userData}
      nextButtonDisabled={nextButtonDisabled}
      setNextButtonDisabled={setNextButtonDisabled}
      apiBaseUrl={apiBaseUrl}
    />
  );
  let currentButtonGroup = (
    <div className="button-group">
      <p>
        <FontAwesomeIcon icon={faLock} /> Your information is secure
      </p>
      <NextButton
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
        nextButtonDisabled={nextButtonDisabled}
        setNextButtonDisabled={setNextButtonDisabled}
      />
    </div>
  );

  if (currentStep === 1) {
    currentStepComponent = (
      <SecondStep
        setCarInfo={setCarInfo}
        carInfo={carInfo}
        setUserData={setUserData}
        userData={userData}
        apiBaseUrl={apiBaseUrl}
      />
    );
    currentButtonGroup = (
      <div className="button-group">
        <PrevButton setCurrentStep={setCurrentStep} currentStep={currentStep} />
        <NextButton setCurrentStep={setCurrentStep} currentStep={currentStep} />
      </div>
    );
  }

  return (
    <div>
      <div className="page">
        <div className="calc__container">
          <InsuranceSteps currentStep={currentStep} />
          {currentStepComponent}
          {currentButtonGroup}
        </div>
      </div>
    </div>
  );
}
