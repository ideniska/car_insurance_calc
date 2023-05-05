import React from "react";
import "./InsuranceContainer.css";
import { useState, useEffect, useRef } from "react";
import InsuranceSteps from "../InsuranceSteps/InsuranceSteps";
import FirstStep from "../../pages/first/FirstStep";
import SecondStep from "../../pages/second/SecondStep";
import NextButton from "../InsuranceStepsNextButton";
import PrevButton from "../InsuranceStepsPrevButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

export default function InsuranceContainer() {
  // const apiBaseUrl = window.location.href + "api/";
  const apiBaseUrl = "http://127.0.0.1:8000/api/";
  const [currentStep, setCurrentStep] = useState(0);
  const [carInfo, setCarInfo] = useState({
    model: null,
    year: null,
    trim: null,
  });

  const prevBirthDate = useRef();
  const prevName = useRef();
  const prevPhone = useRef();
  const prevTrim = useRef();
  const prevYear = useRef();

  const [nextButtonDisabled, setNextButtonDisabled] = useState("disabled");

  const [userData, setUserData] = useState({
    name: null,
    phone: null,
    birthDate: null,
    driverLicence: null,
    yearIssued: null,
  });

  const [totalPercentage, setTotalPercentage] = useState(50);

  // let currentStepComponent = (
  //   <FirstStep
  //     setCarInfo={setCarInfo}
  //     carInfo={carInfo}
  //     setUserData={setUserData}
  //     userData={userData}
  //     nextButtonDisabled={nextButtonDisabled}
  //     setNextButtonDisabled={setNextButtonDisabled}
  //     apiBaseUrl={apiBaseUrl}
  //     totalPercentage={totalPercentage}
  //     setTotalPercentage={setTotalPercentage}
  //   />
  // );

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
    // currentStepComponent = (
    //   <SecondStep
    //     setCarInfo={setCarInfo}
    //     carInfo={carInfo}
    //     setUserData={setUserData}
    //     userData={userData}
    //     apiBaseUrl={apiBaseUrl}
    //   />
    // );

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
          {currentStep === 0 && (
            <FirstStep
              setCarInfo={setCarInfo}
              carInfo={carInfo}
              setUserData={setUserData}
              userData={userData}
              nextButtonDisabled={nextButtonDisabled}
              setNextButtonDisabled={setNextButtonDisabled}
              apiBaseUrl={apiBaseUrl}
              totalPercentage={totalPercentage}
              setTotalPercentage={setTotalPercentage}
              prevBirthDate={prevBirthDate}
              prevName={prevName}
              prevPhone={prevPhone}
              prevTrim={prevTrim}
              prevYear={prevYear}
            />
          )}

          {currentStep === 1 && (
            <SecondStep
              setCarInfo={setCarInfo}
              carInfo={carInfo}
              setUserData={setUserData}
              userData={userData}
              apiBaseUrl={apiBaseUrl}
            />
          )}

          {currentButtonGroup}
        </div>
      </div>
    </div>
  );
}
