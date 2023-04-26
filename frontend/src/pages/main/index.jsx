import React, { useState, useEffect } from "react";
import { requestPopularModels } from "../../hooks/getpopular";
import debounce from "lodash/debounce";
import start from "./start.webp";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import { format } from "date-fns";

const MainPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  const [isVisible, setIsVisible] = useState(false);
  const [popularModels, setPopularModels] = useState([]); // add state for popular models

  const [totalPercentage, setTotalPercentage] = useState(50);
  const [name, setName] = useState("");
  const [makeModelTrim, setMakeModelTrim] = useState("");
  const [phone, setPhone] = useState("");
  const [year, setYear] = useState("");

  const handlePhoneChange = (event) => {
    if (event.target.value.match(/^\(\d{3}\)\s\d{3}-\d{4}$/)) {
      setTotalPercentage(totalPercentage + 12);
    }
    setPhone(event.target.value);
  };

  // increase total percentage after user typed make + model + trim
  useEffect(() => {
    const words = makeModelTrim.split(" ");
    if (words.length === 3) {
      // Check if the input string contains 3 words
      setTotalPercentage(totalPercentage + 12); // Update the totalPercentage state
    }
  }, [makeModelTrim]);

  // increase total percentage after user typed name
  useEffect(() => {
    if (name.length > 2) {
      setTotalPercentage(totalPercentage + 12);
    }
  }, [name]);

  // increase total percentage after user typed year
  useEffect(() => {
    if (year.length > 3) {
      setTotalPercentage(totalPercentage + 12);
    }
  }, [year]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  useEffect(() => {
    // fetch popular models when component mounts
    requestPopularModels().then((models) => {
      console.log(models);
      setPopularModels(models);
    });
  }, []);

  const toggleVisibility = () => {
    console.log("toggling visibility...");
    setIsVisible(!isVisible);
  };

  return (
    <div className="main-page">
      <div className="navbar">
        <h4 id="nav--brand">PolicyMe</h4>
        <h4 id="nav--phone">Questions? +1 (866) 999-7457</h4>
      </div>
      <div className="container" id="picture-block">
        <h2 id="hello">Quote. Buy. Drive. It’s that easy! 🚀</h2>
        <h2 id="under-hello">
          Go from a car insurance quote, to buying online, to being insured and
          on the road, all in 1 hour.
        </h2>
        <img id="start-img" src={start}></img>
      </div>
      <div className="container" id="main-form">
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-md-8">
            <p>
              Fill in your vehicle details beginning with year, below. Or enter
              your VIN and we can pre-fill some of the required information.
            </p>
            <p>
              Start typing the make and model of your car to select from the
              list
            </p>
          </div>
          <div className="col-md-4">
            <p>Completed to show the exact cost:</p>
            <h3>{totalPercentage}%</h3>
            <div
              className="progress"
              style={{
                backgroundColor: "#A3ECB3",
                height: "10px",
                borderRadius: "50px",
              }}
            >
              <div
                style={{
                  width: `50%`,
                  backgroundColor: "#39B54A",
                  height: "100%",
                  borderRadius: "50px",
                }}
              ></div>
            </div>

            <p>+50% for the 1st step</p>
          </div>
          <div className="col-md-7" style={{ position: "relative" }}>
            {/* Add `position: relative` to the parent element */}
            <label htmlFor="inputMake" className="form-label">
              Make
            </label>
            <div className="dropdown">
              <input
                type="text"
                value={makeModelTrim}
                onChange={(e) => setMakeModelTrim(e.target.value)}
                className="form-control"
                id="inputMake"
                placeholder="e.g. Toyota"
                onFocus={toggleVisibility}
                onBlur={toggleVisibility}
              />
              <span class="badge badge-custom position-absolute top-0 start-100 translate-middle p-2 rounded-pill">
                +12%
              </span>
              {isVisible &&
                popularModels.length > 0 && ( // render dropdown if list of models is not empty
                  <ul
                    className="dropdown-menu"
                    style={{
                      display: isVisible ? "block" : "none",
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      zIndex: 1,
                    }}
                  >
                    {popularModels.map((model) => {
                      const modelString = `${model.make.make} ${model.model}`; // concatenate make and model into a single string
                      return <li key={model.id}>{modelString}</li>;
                    })}
                  </ul>
                )}
            </div>
          </div>
          <div class="col-md-7">
            <label for="inputYear" class="form-label">
              Year
            </label>
            <div class="position-relative">
              <input
                type="text"
                class="form-control"
                id="inputYear"
                placeholder="2022"
                value={name}
                onChange={handleNameChange}
              />
              {isVisible && (
                <span className="badge badge-custom position-absolute top-0 start-100 translate-middle p-2 rounded-pill">
                  +4%
                </span>
              )}{" "}
            </div>
          </div>

          <div className="col-md-7">
            <p>Drive details</p>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                id="inputName"
                placeholder="Full Name"
                value={name}
                onChange={handleNameChange}
              />
              {/* <span className="badge badge-custom position-absolute top-0 start-100 translate-middle p-2 rounded-pill">+12%</span> */}
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="position-relative">
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: true }} // Add validation rules
                  render={({ field }) => (
                    <InputMask
                      mask="(999) 999-9999"
                      className="form-control"
                      id="inputPhone"
                      placeholder="Contact Phone"
                      onChange={handlePhoneChange} // Add onChange event listener
                      {...field} // Pass the field props to the InputMask component
                    />
                  )}
                />
                {errors.phone && (
                  <span className="error-message">Phone is required</span>
                )}{" "}
                {/* Display an error message */}
                {/* <span class="badge badge-custom position-absolute top-0 start-100 translate-middle p-2 rounded-pill">+12%</span> */}
              </div>
            </div>

            <div className="col-md-3">
              <div className="position-relative">
                <div className="position-relative">
                  <Controller
                    name="birth"
                    control={control}
                    rules={{ required: true }} // Add validation rules
                    render={({ field }) => (
                      <input
                        type="date"
                        className="form-control"
                        id="inputBirth"
                        placeholder="Date of Birth"
                        onChange={(event) =>
                          field.onChange(
                            format(new Date(event.target.value), "MM/dd/yyyy")
                          )
                        } // Convert the date to the required format
                        value={field.value || ""} // Convert the date to the required format and pass the default value as an empty string
                      />
                    )}
                  />
                  {errors.birth && (
                    <span className="error-message">
                      Birth date is required
                    </span>
                  )}{" "}
                  {/* Display an error message */}
                </div>
                {/* <span class="badge badge-custom position-absolute top-0 start-100 translate-middle p-2 rounded-pill">+12%</span> */}
              </div>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MainPage;
