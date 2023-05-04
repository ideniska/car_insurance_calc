import "./FirstStep.css";
import { AutoComplete, DatePicker, Input, Select, Badge } from "antd";
import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import dayjs from "dayjs";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/semantic-ui.css";

export default function FirstStep({
  setCarInfo,
  carInfo,
  setUserData,
  userData,
  setNextButtonDisabled,
  apiBaseUrl,
}) {
  const _ = require("lodash");
  // const apiBaseUrl = "http://127.0.0.1:8000/api/";
  // const apiBaseUrl = window.location.href + "api/";
  console.log("apibaseurl:", apiBaseUrl);
  const [carMakeInput, setCarMakeInput] = useState("");
  const [options, setOptions] = useState([]);
  const [trimOptions, setTrimOptions] = useState(null);
  const [popularModels, setPopularModels] = useState([]);
  const [carDropdownFocus, setCarDropdownFocus] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [carWithYearOptions, setCarWithYearOptions] = useState(null);
  const [trimOptionsOpen, setTrimOptionsOpen] = useState(false); // trim dropdown disabled before user choose model + year
  // const [selectedTrim, setSelectedTrim] = useState(""); // user selected trim
  const [name, setName] = useState("");
  const prevName = useRef();
  const prevPhone = useRef();
  const prevBirthDate = useRef();
  const prevTrim = useRef();
  // const [phone, setPhone] = useState("");
  // const [userBirthDate, setUserBirthDate] = useState("");

  // useStates to control badge change from +xx% to green dot status
  const [showDotStatusModelField, setShowDotStatusModelField] = useState(false);
  const [showDotStatusTrimField, setshowDotStatusTrimField] = useState(false);
  const [showDotStatusNameField, setShowDotStatusNameField] = useState(false);
  const [showDotStatusPhoneField, setShowDotStatusPhoneField] = useState(false);
  const [showDotStatusBirthdateField, setShowDotStatusBirthdateField] =
    useState(false);

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

  if (totalPercentage === 100) {
    setNextButtonDisabled("");
  }

  // get popular models
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
    setShowDotStatusModelField(true);
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
      setShowDotStatusModelField(false);
    }

    if (hasModel && !inputIncludesModel) {
      setCarInfo({
        model: null,
        year: carInfo.year,
      });

      debauncedSearchModels(carMakeInput);
    }
  }, [carMakeInput]);

  // Increase totalPercentage when model year is selected
  useEffect(() => {
    if (carInfo.model && carInfo.year) {
      setTotalPercentage(totalPercentage + percentageParams.modelYear);
    }
  }, [carInfo.model, carInfo.year]);

  // Increase totalPercentage when trim is selected
  useEffect(() => {
    if (!prevTrim.current && carInfo.trim) {
      setTotalPercentage(totalPercentage + percentageParams.trim);
    }
    if (!carInfo.trim && prevTrim.current) {
      setTotalPercentage(totalPercentage - percentageParams.trim);
    }

    prevTrim.current = carInfo.trim;
  }, [carInfo.trim]);

  // Increase total percentage if name input is filled
  useEffect(() => {
    if (!prevName.current && name) {
      setTotalPercentage(totalPercentage + percentageParams.name);
      setShowDotStatusNameField(true);
    }
    if (prevName.current && !name) {
      setTotalPercentage(totalPercentage - percentageParams.name);
      setShowDotStatusNameField(false);
    }
    prevName.current = name;
  }, [name]);

  // Increase totalPercentage when phone is filled
  useEffect(() => {
    if (userData.phone && userData.phone.length === 11) {
      setTotalPercentage(totalPercentage + percentageParams.phone);
      setShowDotStatusPhoneField(true);
    }

    if (prevPhone.current && !userData.phone) {
      setTotalPercentage(totalPercentage - percentageParams.phone);
      setShowDotStatusPhoneField(false);
    }

    prevPhone.current = userData.phone;
  }, [userData.phone]);

  // Increase totalPercentage when userBirthDate is filled
  useEffect(() => {
    if (!prevBirthDate.current && userData.birthDate) {
      setTotalPercentage(totalPercentage + percentageParams.birthDate);
      setShowDotStatusBirthdateField(true);
    }
    if (!userData.birthDate && prevBirthDate.current) {
      setTotalPercentage(totalPercentage - percentageParams.birthDate);
      setShowDotStatusBirthdateField(false);
    }
    prevBirthDate.current = userData.birthDate;
  }, [userData.birthDate]);

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

  const onTrimSelect = (value, option) => {
    setTrimOptionsOpen(false);
    setCarInfo({
      model: carInfo.model,
      year: carInfo.year,
      trim: option,
    });
    setshowDotStatusTrimField(true);
  };

  const onNameInput = (value, option) => {
    setName(value);
    setUserData({
      name: value,
      phone: userData.phone,
      birthDate: userData.birthDate,
      driverLicence: null,
      yearIssued: null,
    });
  };

  const onDateInput = (date, dateString) => {
    setUserData({
      name: userData.name,
      phone: userData.phone,
      birthDate: dateString,
      driverLicence: null,
      yearIssued: null,
    });
  };

  const onPhoneInput = (value, option) => {
    setUserData({
      name: userData.name,
      phone: value,
      birthDate: userData.birthDate,
      driverLicence: null,
      yearIssued: null,
    });
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
    <div className="calc__body">
      <div className="calc__form">
        <form>
          <h3>Fill in vehicle information</h3>
          <p>
            Start typing the make and model of your car to select from the list
          </p>
          <Badge
            count={`${percentageParams.modelYear}%`}
            color="#A3ECB3"
            status="success"
            dot={showDotStatusModelField}
          >
            <AutoComplete
              id="make-model-year"
              options={options}
              style={{ width: 345, marginBottom: 20 }}
              open={carDropdownFocus}
              onSelect={onSelect}
              value={carInfo.year}
              onFocus={() => {
                onChangeFocus(true);
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
          </Badge>
          <Badge
            count={`${percentageParams.trim}%`}
            color="#A3ECB3"
            dot={showDotStatusTrimField}
          >
            <Select
              id="trim-select"
              options={trimOptions}
              open={trimOptionsOpen}
              onDropdownVisibleChange={(visible) => setTrimOptionsOpen(visible)}
              onSelect={onTrimSelect}
              value={carInfo.trim}
              onFocus={() => {
                setTrimOptionsOpen(true);
              }}
              onBlur={() => {
                setTrimOptionsOpen(false);
              }}
              style={{ width: 345, marginBottom: 20 }}
              placeholder="Trim"
            />
          </Badge>
          <h4>Driver details</h4>
          <Badge
            count={`${percentageParams.name}%`}
            color="#A3ECB3"
            dot={showDotStatusNameField}
          >
            <Input
              name="nameInput"
              style={{ width: 345, marginBottom: 20 }}
              placeholder="John Smith"
              onChange={(e) => onNameInput(e.target.value)}
              value={userData.name}
            />
          </Badge>
          <Badge
            count={`${percentageParams.phone}%`}
            color="#A3ECB3"
            dot={showDotStatusPhoneField}
          >
            <PhoneInput
              className="phone-input-container"
              inputClass="phone-input"
              country={"ca"}
              onChange={(value) => onPhoneInput(value)}
              value={userData.phone}
            />
          </Badge>
          <Badge
            count={`${percentageParams.birthDate}%`}
            color="#A3ECB3"
            dot={showDotStatusBirthdateField}
          >
            <DatePicker
              name="birthDateInput"
              // defaultValue={dayjs("1987/12/01", dateFormat)}
              format={dateFormat}
              style={{ width: 345, marginBottom: 20 }}
              onChange={onDateInput}
              value={dayjs(userData.birthDate, dateFormat)}
            />
          </Badge>
        </form>
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
              width: `${totalPercentage}%`,
              backgroundColor: "#39B54A",
              height: "100%",
              borderRadius: "50px",
            }}
          ></div>
        </div>

        <p>+50% for the 1st step</p>
      </div>
    </div>
  );
}
