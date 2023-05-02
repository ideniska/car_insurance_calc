import React from "react";

export default function PrevButton( {
    setCurrentStep, currentStep
  }

) {
  return (<button type="submit"
    className="btn btn-primary left-button"

    onClick= {
      ()=> {
        setCurrentStep(currentStep - 1);
      }
    }

    > Previous </button>);
}