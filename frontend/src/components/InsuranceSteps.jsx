import React from "react";

export default function InsuranceSteps({ currentStep }) {
  let activeStep = (
    <div className="calc__steps">
      <div className="calc__steps__step">
        <div className="circle-active">1</div>
        <p>Vehicle</p>
      </div>
      <div className="calc__steps__step">
        <div className="circle">2</div>
        <p className="not-active-text">Calculator</p>
      </div>
      <div className="calc__steps__step">
        <div className="circle">3</div>
        <p className="not-active-text">Documents</p>
      </div>
    </div>
  );

  if (currentStep === 1) {
    activeStep = (
      <div className="calc__steps">
        <div className="calc__steps__step">
          <div className="circle">1</div>
          <p>Vehicle</p>
        </div>
        <div className="calc__steps__step">
          <div className="circle-active">2</div>
          <p className="not-active-text">Calculator</p>
        </div>
        <div className="calc__steps__step">
          <div className="circle">3</div>
          <p className="not-active-text">Documents</p>
        </div>
      </div>
    );
  } else if (currentStep === 2) {
    activeStep = (
      <div className="calc__steps">
        <div className="calc__steps__step">
          <div className="circle">1</div>
          <p>Vehicle</p>
        </div>
        <div className="calc__steps__step">
          <div className="circle">2</div>
          <p className="not-active-text">Calculator</p>
        </div>
        <div className="calc__steps__step">
          <div className="circle-active">3</div>
          <p className="not-active-text">Documents</p>
        </div>
      </div>
    );
  }

  return <div>{activeStep}</div>;
}
