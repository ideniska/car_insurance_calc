import "./secondpage.css";
import {
  AutoComplete,
  DatePicker,
  Input,
  Select,
  Dropdown,
  Slider,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/semantic-ui.css";
import { Link } from "react-router-dom";
import { userData } from "../first/userData";

export default function SecondPage() {
  const [carPrice, setCarPrice] = useState();

  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY/MM/DD";
  const apiBaseUrl = "http://127.0.0.1:8000//api/";
  // const apiBaseUrl = "http://localhost:8000/api/";
  const getCarPrice = () => {
    axios
      .get(
        apiBaseUrl +
          `car/${userData.carModelId}/${userData.carYearId}/${userData.carTrimId}`
      )
      .then((data) => {
        setCarPrice(data.data.car_price);
      });
  };

  const dropdownCoverageOptions = [
    {
      label: "1st menu item",
      key: "1",
    },
    {
      label: "2nd menu item",
      key: "2",
    },
    {
      label: "3rd menu item",
      key: "3",
      danger: true,
    },
    {
      label: "4rd menu item",
      key: "4",
      danger: true,
      disabled: true,
    },
  ];

  const franchiseSliderMarks = {
    0: "No franchise",
    20: "$500",
    40: "$1000",
  };

  const milageSliderMarks = {
    0: "No limit",
    20: "10 000 km",
    40: "20 000 km",
  };

  getCarPrice();

  return (
    <div className="page">
      <div className="calc__container">
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
        <div className="calc__body">
          <div className="calc__form">
            <form>
              <h3>Driver details</h3>
              <div className="row driver-details">
                <div className="col">
                  <Input
                    name="nameInput"
                    placeholder={userData.userName}
                    value={userData.userName}
                  />
                </div>
                <div className="col">
                  <DatePicker
                    name="birthDateInput"
                    defaultValue={dayjs("1987/12/01", dateFormat)}
                    format={dateFormat}
                    className="date-picker"
                  />
                </div>
              </div>
              <div className="row driver-details">
                <div className="col">
                  <Input
                    name="driverLicence3Input"
                    placeholder="Your driver licence number"
                  />
                </div>
                <div className="col">
                  <Input
                    name="driverExperienceInput"
                    placeholder="Year issued"
                  />
                </div>
              </div>
              <h3>Choose insurance parameters</h3>
              <Input
                className="vehicle-price-input"
                name="priceInput"
                placeholder="Vehicle price: $50 000"
              />
              <Dropdown.Button
                className="coverage-options-dropdown"
                name="coverageOptions"
                menu={dropdownCoverageOptions}
              />
              <Slider
                className="slider"
                name="franchise"
                step={10}
                marks={franchiseSliderMarks}
              />
              <Slider
                className="slider"
                name="milageLimit"
                step={10}
                marks={milageSliderMarks}
              />
            </form>
            <div className="button-group">
              <Link to="/">Previous</Link>
              <button type="submit" className="btn btn-primary">
                Next
              </button>
            </div>
          </div>
          <div className="calc__progress">
            <p>Insurance price</p>
            <h3></h3>
            <div>
              <p>
                Your vehicle: {userData.carModel.value} modelID_
                {userData.carModelId} YearID_ {userData.carYearId}
                TrimID_
                {userData.carTrimId} car price: {carPrice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
