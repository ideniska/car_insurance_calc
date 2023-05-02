import React from "react";

export default function NextButton({
  setCurrentStep,
  currentStep,
  nextButtonDisabled,
  setNextButtonDisabled,
}) {
  return (
    <button
      type="submit"
      className={`btn btn-primary right-button ${nextButtonDisabled}`}
      onClick={() => {
        setCurrentStep(currentStep + 1);
        setNextButtonDisabled("disabled");
      }}
    >
      Next
    </button>
  );
}
