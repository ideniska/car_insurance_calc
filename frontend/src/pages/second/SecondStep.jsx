import "./SecondStep.css";

import {
  DatePicker,
  Input,
  Select,
  Dropdown,
  Slider,
  Button,
  Space,
  Switch,
} from "antd";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "react-phone-input-2/lib/semantic-ui.css";

export default function SecondStep({
  setCarInfo,
  carInfo,
  userData,
  setUserData,
}) {
  const [carPrice, setCarPrice] = useState();
  const [deductibleChoice, setDeductibleChoice] = useState();

  const initialInsuranceQuoteRate = 1;

  const [insuranceQuoteRate, setInsuranceQuoteRate] = useState(
    initialInsuranceQuoteRate
  );

  // if (tires === 0) {insuranceQuoteRate + 0.0015}
  // if (coverage === 2) {insuranceQuoteRate + 0.0015}
  // if (coverage === 1) {insuranceQuoteRate + 0.003}
  // if (deductible === 0) {insuranceQuoteRate + 0.003}
  // if (deductible === 1) {insuranceQuoteRate + 0.0025}
  // if (deductible === 2) {insuranceQuoteRate + 0.0015}
  // if (businessUse === 1) {insuranceQuoteRate + 0.003}
  // if (lease === 1) {insuranceQuoteRate + 0.0025}
  // if (milage === 1) {insuranceQuoteRate + 0.0015}
  // if (milage === 2) {insuranceQuoteRate + 0.0025}
  // if (milage === 3) {insuranceQuoteRate + 0.003}

  // const paramsWeight = {
  //   coverage2: 0.0015,
  //   coverage1: 0.003,
  //   yearlyRate0: 0.0005,
  //   deductible0: 0.003,
  //   deductible1: 0.0025,
  //   deductible2: 0.0015,
  //   businessUse1: 0.003,
  //   lease1: 0.0025,
  //   milage1: 0.0015,
  //   milage2: 0.0025,
  //   milage3: 0.003,
  // };

  const [insuranceParams, setInsuranceParams] = useState({
    coverage: 2,
    licenceYear: 0,
    deductible: 3,
    milage: 0,
    tires: 0,
    isLeased: false,
    isBusinessUse: false,
    paymentType: true, // yearly
  });

  const paramsWeight = {
    coverage: [2, 1, 0],
    licenceYear: [0],
    deductible: [4, 3, 2, 0],
    milage: [0, 1, 2, 3],
    tires: [0, 1],
    isLeased: [0, 1],
    isBusinessUse: [0, 1],
    paymentType: [1, 0],
  };

  // Quote Rate Calculation based on chosen preferences
  useEffect(() => {
    let accumulator = 0;

    for (const key in insuranceParams) {
      const element = insuranceParams[key];
      if (typeof element === "boolean" && element === true) {
        accumulator += paramsWeight[key][1];
      }
      if (typeof element === "boolean" && element === false) {
        accumulator += paramsWeight[key][0];
      }

      if (typeof element === "number") {
        accumulator += paramsWeight[key][element];
      }
    }
    setInsuranceQuoteRate(initialInsuranceQuoteRate + accumulator);
  }, [
    insuranceParams.coverage,
    insuranceParams.licenceYear,
    insuranceParams.deductible,
    insuranceParams.milage,
    insuranceParams.tires,
    insuranceParams.isLeased,
    insuranceParams.isBusinessUse,
    insuranceParams.paymentType,
  ]);

  const [insuranceQuoteYearly, setInsuranceQuoteYearly] = useState(0);

  useEffect(() => {
    setInsuranceQuoteYearly(parseFloat(carPrice) * insuranceQuoteRate);
  }, [carPrice, insuranceQuoteRate]);

  const [insuranceQuoteMonthly, setInsuranceQuoteMonthly] = useState(
    ((parseFloat(carPrice) * insuranceQuoteRate) / 12) * 1.05
  );

  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY/MM/DD";
  const apiBaseUrl = "http://127.0.0.1:8000//api/";
  // const [isMounted, setIsMounted] = useState(false);

  // const apiBaseUrl = "http://localhost:8000/api/";
  useEffect(() => {
    axios
      .get(
        apiBaseUrl +
          `car/${carInfo.model.id}/${carInfo.year.id}/${carInfo.trim.id}`
      )
      .then((data) => {
        console.log(data);
        setCarPrice(data.data.car_price);
      });
  }, []);

  const onCarPriceInput = (value) => {
    setCarPrice(value);
  };

  const coverageItems = [
    {
      label: "Comprehensive + collision",
      id: "1",
      value: 0,
    },

    {
      label: "Comprehensive coverage",
      id: "2",
      value: 1,
    },

    {
      label: "Collision coverage",
      id: "3",
      value: 2,
    },
  ];

  const dropdownCoverageOptions = {
    coverageItems,
  };

  const tiresItems = [
    {
      label: "Winter tires",
      id: "1",
      value: 0,
    },

    {
      label: "All season tires",
      id: "2",
      value: 1,
    },
  ];

  const deductibleSliderMarks = {
    0: "$0",
    1: "$500",
    2: "$1000",
    3: "$1500",
  };

  const milageSliderMarks = {
    0: "10 000 km",
    1: "15 000 km",
    2: "20 000 km",
    3: "∞",
  };

  const onChangeLeaseSwitch = (value, option) => {
    setInsuranceParams({
      ...insuranceParams,
      isLeased: value,
    });
  };

  const onChangeBusinessSwitch = (value, option) => {
    setInsuranceParams({
      ...insuranceParams,
      isBusinessUse: value,
    });
  };

  const onSelectTires = (value, option) => {
    setInsuranceParams({
      ...insuranceParams,
      tires: option.value,
    });
  };

  const onSelectCoverage = (value, option) => {
    setInsuranceParams({
      ...insuranceParams,
      coverage: option.value,
    });
  };

  const onChangeDeductible = (value, option) => {
    setInsuranceParams({
      ...insuranceParams,
      deductible: value,
    });
  };

  const onChangeMilage = (value, option) => {
    setInsuranceParams({
      ...insuranceParams,
      milage: value,
    });
  };

  const onInputDriverLicence = (value, option) => {
    setUserData({
      ...insuranceParams,
      driverLicence: value,
    });
  };

  const onInputLicenceYear = (value, option) => {
    setUserData({
      ...insuranceParams,
      licenceYear: value,
    });
  };

  const onChangeInsurancePriceDisplay = (value) => {
    setInsuranceParams({
      ...insuranceParams,
      paymentType: value,
    });
  };

  return (
    <div className="calc__body">
      <div className="calc__form">
        <form>
          <h4 className="small-title">Driver details</h4>
          <div className="row driver-details">
            <div className="col">
              <Input
                name="nameInput"
                placeholder={userData.name}
                value={userData.name}
              />
            </div>
            <div className="col">
              <DatePicker
                name="birthDateInput"
                value={dayjs(userData.birthDate, dateFormat)}
                format={dateFormat}
                className="date-picker"
              />
            </div>
          </div>
          <div className="row driver-details">
            <div className="col">
              <Input
                name="driverLicenceInput"
                placeholder="Licence number"
                onChange={(e) => onInputDriverLicence(e.target.value)}
              />
            </div>
            <div className="col">
              <Input
                name="driverLicenceYearInput"
                placeholder="Year issued"
                onChange={(e) => onInputLicenceYear(e.target.value)}
              />
            </div>
          </div>
          <h4 className="small-title">Vehicle price</h4>
          <Input
            className="mb-20"
            name="priceInput"
            value={carPrice}
            onChange={(e) => onCarPriceInput(e.target.value)}
          />
          <div className="mb-20 lease-switch-group">
            Is this vehicle leased? <Switch onChange={onChangeLeaseSwitch} />
          </div>
          <div className="mb-20 lease-switch-group">
            Vehicle is used for business
            <Switch onChange={onChangeBusinessSwitch} />
          </div>
          <Select
            className="mb-20"
            name="coverageOptions"
            options={coverageItems}
            style={{
              width: 345,
            }}
            placeholder="Coverage"
            defaultValue={2}
            onSelect={onSelectCoverage}
          />
          <Select
            className="mb-20"
            name="tiresOptions"
            options={tiresItems}
            defaultValue={0}
            style={{
              width: 345,
            }}
            placeholder="Tires"
            onSelect={onSelectTires}
          />
          <h4 className="small-title">Deductible</h4>
          <Slider
            className="mb-20"
            name="deductible"
            defaultValue={3}
            step={1}
            max={3}
            marks={deductibleSliderMarks}
            tooltip={{
              formatter: null,
            }}
            onChange={onChangeDeductible}
          />
          <h4 className="small-title">Annual milage</h4>
          <Slider
            className="mb-20"
            name="milageLimit"
            marks={milageSliderMarks}
            step={1}
            max={3}
            tooltip={{
              formatter: null,
            }}
            onChange={onChangeMilage}
          />
        </form>
      </div>
      <div className="calc__progress">
        <p className="inactive-text">Insurance price</p>
        <div className="lease-switch-group">
          <h4 className="small-title">${insuranceQuoteYearly}</h4>
          <h4 className="small-title">{insuranceQuoteRate}</h4>
          <Switch
            checkedChildren="Yearly"
            unCheckedChildren="Monthly"
            defaultChecked
            onChange={onChangeInsurancePriceDisplay}
          />
        </div>
        <hr />
        <div>
          <p className="inactive-text totals-vehicle">Your vehicle:</p>
          <p className="totals-vehicle">Brand Model Year Trim </p>
        </div>
      </div>
    </div>
  );
}
