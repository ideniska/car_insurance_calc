import "./index.css";
import { AutoComplete, DatePicker, Input, Select } from "antd";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/semantic-ui.css";

export default function First() {
  const _ = require("lodash");
  // const currentDomain = window.location.host;
  const apiBaseUrl = "http://localhost:8000/api/";
  // const apiBaseUrl = window.location.host + "/api/";
  const [carMakeInput, setCarMakeInput] = useState("");
  const [options, setOptions] = useState([]);
  const [trimOptions, setTrimOptions] = useState(null);
  const [popularModels, setPopularModels] = useState([]);
  const [carDropdownFocus, setCarDropdownFocus] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [carWithYearOptions, setCarWithYearOptions] = useState(null);
  const [trimOptionsOpen, setTrimOptionsOpen] = useState(false); // trim dropdown disabled before user choose model + year
  const [selectedTrim, setSelectedTrim] = useState(""); // user selected trim
  const [name, setName] = useState("");
  const prevName = useRef();
  const [phone, setPhone] = useState("");
  const [userBirthDate, setUserBirthDate] = useState("");

  const [carInfo, setCarInfo] = useState({
    model: null,
    year: null,
  });

  // Perecentage parameters for totalPercentage update
  const percentageParams = {
    modelYear: 10,
    trim: 4,
    name: 12,
    phone: 12,
    birthDate: 12,
  };

  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY/MM/DD";
  const [totalPercentage, setTotalPercentage] = useState(50);

  useEffect(() => {
    if (!prevName.current && name) {
      setTotalPercentage(totalPercentage + percentageParams.name);
    }
    if (prevName.current && !name) {
      setTotalPercentage(totalPercentage - percentageParams.name);
    }
    prevName.current = name;
  }, [name]);

  useEffect(() => {
    setIsMounted(true);
    axios.get(apiBaseUrl + "popular/").then((response) => {
      const mappedResponse = response.data.map((item) => {
        return {
          value: `${item.make.make} ${item.model}`,
          id: item.id,
          label: `${item.make.make} ${item.model}`,
        };
      });
      setPopularModels(mappedResponse);
      setOptions(mappedResponse);
    });
  }, []);

  useEffect(() => {
    if (!carInfo.year) return;

    getTrims(); // call API to get all trims for selected model year
    setCarDropdownFocus(false);
    setTrimOptionsOpen(true); // open trims dropdown
  }, [carInfo.year]);

  const onChangeFocus = (value) => {
    if (isMounted) {
      setCarDropdownFocus(value);
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    if (!carMakeInput.length) {
      setOptions(popularModels || []);
    }
    const hasYear = carInfo.year;
    const hasModel = carInfo.model;

    if (!hasYear && !hasModel) {
      debauncedSearchModels(carMakeInput);
    }

    const inputIncludesYear = carMakeInput.includes(carInfo.year?.value);
    const inputIncludesModel = carMakeInput.includes(carInfo.model?.value);

    if (hasYear && !inputIncludesYear) {
      setCarInfo({
        model: carInfo.model,
        year: null,
      });

      setOptions(carWithYearOptions);
      setTotalPercentage(totalPercentage - percentageParams.modelYear);
    }

    if (hasModel && !inputIncludesModel) {
      setCarInfo({
        model: null,
        year: carInfo.year,
      });

      debauncedSearchModels(carMakeInput);
    }
    // setTrimOptionsOpen(false);
    // setCarDropdownFocus(true);
  }, [carMakeInput]);

  // Increase totalPercentage when model year is selected
  useEffect(() => {
    if (carInfo.model && carInfo.year) {
      setTotalPercentage(totalPercentage + percentageParams.modelYear);
    }
  }, [carInfo.model, carInfo.year]);

  // Increase totalPercentage when trim is selected
  useEffect(() => {
    if (selectedTrim) {
      setTotalPercentage(totalPercentage + percentageParams.trim);
    }
  }, [selectedTrim]);

  // Increase totalPercentage when name is filled
  // useEffect(() => {
  //   if (name) {
  //     setTotalPercentage(totalPercentage + percentageParams.name);
  //   }
  // }, [name]);

  // Increase totalPercentage when phone is filled
  useEffect(() => {
    if (phone) {
      setTotalPercentage(totalPercentage + percentageParams.phone);
    }
  }, [phone]);

  // Increase totalPercentage when userBirthDate is filled
  useEffect(() => {
    if (userBirthDate) {
      setTotalPercentage(totalPercentage + percentageParams.birthDate);
    }
  }, [userBirthDate]);

  const onSelect = (value, option) => {
    setCarMakeInput(value);

    if (!carInfo.model) {
      setCarInfo({
        model: option,
        year: carInfo.year,
      });

      getModelYears(option);
      return;
    }

    setCarInfo({
      model: carInfo.model,
      year: option,
    });
  };

  const trimOnSelect = (value, option) => {
    setTrimOptionsOpen(false);
    setSelectedTrim(value);
  };

  const onNameInput = (value, option) => {
    setName(value);
  };

  const onDateInput = (date, dateString) => {
    setUserBirthDate(dateString);
  };

  const getTrims = () => {
    if (!carInfo.year || !carInfo.model) return;

    const yearId = carInfo.year.id;
    const modelId = carInfo.model.id;
    axios
      .get(apiBaseUrl + `trims/?year=${yearId}&model=${modelId}`)
      .then(function ({ data }) {
        const mappedResponse = data.map((item) => {
          return {
            id: item.trim__id,
            label: item.trim__trim,
            value: item.trim__trim,
          };
        });

        setTrimOptions(mappedResponse);
      });
  };

  const getModelYears = (option) => {
    axios.get(apiBaseUrl + `model/${option.id}/year`).then(function ({ data }) {
      const mappedResponse = data.map((item) => {
        return {
          id: item.id,
          label: `${option.label} ${item.year}`,
          value: `${option.label}, ${item.year}`,
        };
      });
      setOptions(mappedResponse);
      setCarWithYearOptions(mappedResponse);
    });
  };

  const searchModels = (text) => {
    if (text) {
      axios
        .get(apiBaseUrl + "search-models/?search=" + text)
        .then(function (response) {
          const mappedResponse = response.data.map((item) => {
            return {
              value: `${item.make__make} ${item.model}`,
              id: item.id,
              label: `${item.make__make} ${item.model}`,
            };
          });
          setOptions(mappedResponse);
        });
    }
  };

  const debauncedSearchModels = _.debounce((text) => {
    searchModels(text);
  }, 1000);

  return (
    <div className="page">
      <div className="calc__container">
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
        <div className="calc__body">
          <div className="calc__form">
            <form>
              <h3>Fill in vehicle information</h3>
              <p>
                Start typing the make and model of your car to select from the
                list
              </p>
              <AutoComplete
                id="make-model-year"
                options={options}
                style={{ width: 345, marginBottom: 20 }}
                open={carDropdownFocus}
                onSelect={onSelect}
                // onDropdownVisibleChange={(visible) =>
                //   setCarDropdownFocus(visible)
                // }
                onFocus={() => {
                  onChangeFocus(true);
                  // setTrimOptionsOpen(false);
                }}
                onBlur={() => {
                  onChangeFocus(false);
                }}
                onSearch={(text) => {
                  setCarMakeInput(text);
                }}
                placeholder="Make, model, year"
                renderOption={(option) => {
                  return (
                    <>
                      <div>{`${option.label}`}</div>
                    </>
                  );
                }}
              />

              <Select
                id="trim-select"
                options={trimOptions}
                open={trimOptionsOpen}
                onDropdownVisibleChange={(visible) =>
                  setTrimOptionsOpen(visible)
                }
                // onSelect={() => {
                //   setTrimOptionsOpen(false);
                // }}
                onSelect={trimOnSelect}
                onFocus={() => {
                  setTrimOptionsOpen(true);
                }}
                onBlur={() => {
                  setTrimOptionsOpen(false);
                }}
                style={{ width: 345, marginBottom: 20 }}
                placeholder="Trim"
              />
              <h4>Driver details</h4>
              <Input
                name="nameInput"
                style={{ marginBottom: 20 }}
                placeholder="John Smith"
                onChange={(e) => setName(e.target.value)}
              />

              <PhoneInput
                className="phone-input-container"
                inputClass="phone-input"
                country={"ca"}
                onChange={(phone) => setPhone(phone)}
              />

              <DatePicker
                name="birthDateInput"
                defaultValue={dayjs("1987/12/01", dateFormat)}
                format={dateFormat}
                style={{ width: 345, marginBottom: 20 }}
                onChange={onDateInput}
              />
            </form>
            <div className="button-group">
              <p>
                <FontAwesomeIcon icon={faLock} /> Your information is secure
              </p>
              <button type="submit" className="btn btn-primary">
                Next
              </button>
            </div>
          </div>
          <div className="calc__progress">
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
        </div>
      </div>
    </div>
  );
}

// TODO Phone Input width and border radius are not changing
// TODO Percentage increase too often
// TODO Code refactoring
// TODO 2 page
