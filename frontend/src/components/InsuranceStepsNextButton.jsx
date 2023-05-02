import React from "react";

export default function NextButton({ setCurrentStep, currentStep }) {
  return (
    <button
      type="submit"
      className="btn btn-primary right-button"
      onClick={() => {
        setCurrentStep(currentStep + 1);
      }}
    >
      Next
    </button>
  );
}
