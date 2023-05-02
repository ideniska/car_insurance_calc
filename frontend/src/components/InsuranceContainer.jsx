import React from "react";
import { useState, useEffect } from "react";
import InsuranceSteps from "./InsuranceSteps";
import FirstStep from "../pages/first/FirstStep";
import SecondStep from "../pages/second/SecondStep";
import NextButton from "./InsuranceStepsNextButton";
import PrevButton from "./InsuranceStepsPrevButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

export default function InsuranceContainer() {
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
    birthDate: null,
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

  //   useEffect(() => {
  //     if (currentStep === 1) {
  //       currentStepComponent = (
  //         // <SecondStep setCarInfo={setCarInfo} carInfo={carInfo} />
  //         <div>Second Step</div>
  //       );
  //     }
  //     // if (currentStep === 2) {
  //     //   currentStepComponent = (
  //     //     <ThirdStep setCarInfo={setCarInfo} carInfo={carInfo} />
  //     //   );
  //     // }
  //     // if (currentStep === 3) {
  //     //   currentStepComponent = <FourthStep />;
  //     // }
  //     currentStepComponent = (
  //       <FirstStep setCarInfo={setCarInfo} carInfo={carInfo} />
  //     );
  //   }, [currentStep]);

  if (currentStep === 1) {
    currentStepComponent = (
      <SecondStep
        setCarInfo={setCarInfo}
        carInfo={carInfo}
        setUserData={setUserData}
        userData={userData}
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
