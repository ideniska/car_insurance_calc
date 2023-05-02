import "./SecondStep.css";
import {
  DatePicker,
  Input,
  Select,
  Dropdown,
  Slider,
  Button,
  Space,
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

  const [insuranceParams, setInsuranceParams] = useState({
    coverage: 1,
    licenceYear: null,
    deductible: 0,
    milage: 0,
    tires: 0,
  });

  const [insuranceQuoteRate, setInsuranceQuoteRate] = useState(0.01);
  const [insuranceQuoteYearly, setInsuranceQuoteYearly] = useState(
    parseFloat(carPrice) * insuranceQuoteRate
  );
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
          `car/${carInfo.model.id}/${carInfo.year.id}/${carInfo.trim.id}
        `
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
      label: "Maximum coverage",
      id: "1",
      value: 1,
    },

    {
      label: "Middle coverage",
      id: "2",
      value: 2,
    },

    {
      label: "Minimal coverage",
      id: "3",
      value: 3,
    },
  ];

  const tiresItems = [
    {
      label: "Winter tires",
      id: "1",
      value: 1,
    },

    {
      label: "All season tires",
      id: "2",
      value: 0,
    },
  ];

  const onSelectTires = (value, option) => {
    setInsuranceParams({
      coverage: insuranceParams.coverage,
      licenceYear: insuranceParams.licenceYear,
      deductible: insuranceParams.deductible,
      milage: insuranceParams.milage,
      tires: option.value,
    });
  };

  const onSelectCoverage = (value, option) => {
    setInsuranceParams({
      coverage: option.value,
      licenceYear: insuranceParams.licenceYear,
      deductible: insuranceParams.deductible,
      milage: insuranceParams.milage,
      tires: insuranceParams.tires,
    });
  };

  const dropdownCoverageOptions = {
    coverageItems,
  };

  const deductibleSliderMarks = {
    0: "$0",
    1: "$500",
    2: "$1000",
    3: "$1500",
  };

  const onChangeDeductible = (value, option) => {
    setInsuranceParams({
      coverage: insuranceParams.coverage,
      licenceYear: insuranceParams.licenceYear,
      deductible: value,
      milage: insuranceParams.milage,
      tires: insuranceParams.tires,
    });
  };

  const milageSliderMarks = {
    0: "10 000 km",
    1: "15 000 km",
    2: "20 000 km",
    3: "No limit",
  };

  const onChangeMilage = (value, option) => {
    setInsuranceParams({
      coverage: insuranceParams.coverage,
      licenceYear: insuranceParams.licenceYear,
      deductible: insuranceParams.deductible,
      milage: value,
      tires: insuranceParams.tires,
    });
  };

  const onInputDriverLicence = (value, option) => {
    setUserData({
      name: userData.name,
      phone: userData.phone,
      birthDate: userData.birthDate,
      driverLicence: value,
      yearIssued: userData.yearIssued,
    });
  };

  const onInputLicenceYear = (value, option) => {
    setUserData({
      name: userData.name,
      phone: userData.phone,
      birthDate: userData.birthDate,
      driverLicence: userData.driverLicence,
      yearIssued: value,
    });
  };

  return (
    <div className="calc__body">
      {" "}
      <div className="calc__form">
        {" "}
        <form>
          {" "}
          <h3>Driver details</h3>{" "}
          <div className="row driver-details">
            {" "}
            <div className="col">
              {" "}
              <Input
                name="nameInput"
                placeholder={userData.name}
                value={userData.name}
              />{" "}
            </div>{" "}
            <div className="col">
              {" "}
              <DatePicker
                name="birthDateInput"
                value={dayjs(userData.birthDate, dateFormat)}
                format={dateFormat}
                className="date-picker"
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="row driver-details">
            {" "}
            <div className="col">
              {" "}
              <Input
                name="driverLicenceInput"
                placeholder="Licence number"
                onChange={(e) => onInputDriverLicence(e.target.value)}
              />{" "}
            </div>{" "}
            <div className="col">
              {" "}
              <Input
                name="driverLicenceYearInput"
                placeholder="Year issued"
                onChange={(e) => onInputLicenceYear(e.target.value)}
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* <h3>Choose insurance parameters</h3> */}
          <h4>Vehicle price</h4>{" "}
          <Input
            className="mb-20"
            name="priceInput"
            value={carPrice}
            onChange={(e) => onCarPriceInput(e.target.value)}
          />{" "}
          <Select
            className="mb-20"
            name="coverageOptions"
            options={coverageItems}
            style={{
              width: 345,
            }}
            placeholder="Coverage"
            onSelect={onSelectCoverage}
          />{" "}
          <Select
            className="mb-20"
            name="tiresOptions"
            options={tiresItems}
            style={{
              width: 345,
            }}
            placeholder="Tires"
            onSelect={onSelectTires}
          />{" "}
          <h4>Deductible</h4>{" "}
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
          />{" "}
          <h4>Annual milage</h4>{" "}
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
          />{" "}
        </form>{" "}
      </div>{" "}
      <div className="calc__progress">
        {" "}
        <p>Insurance price {insuranceQuoteYearly}</p> <h3></h3>{" "}
        <div>
          {" "}
          <p>Your vehicle: car price: {carPrice}</p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
