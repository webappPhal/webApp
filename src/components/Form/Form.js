// components/YourFormComponent.js

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const YourFormComponent = () => {
  const [startDate, setStartDate] = useState();
  const [value, setValue] = useState();
  const [passNo, setPassNo] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [route, setRoute] = useState("");
  const [vecNo, setVecNo] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [cubicContent, setCubicContent] = useState("3.00");
  const [imgS, setImgS] = useState("");
  const [isSubmit, setISSubmit] = useState(false);

  const vehicleOptions = [
    "Hiwa-10 wheels - 18 cum",
    "Truck- 4 wheels",
    "Tata 407 - 4 wheels",
    "Tractor - 4 wheels",
    "Pickup van - 4 wheel",
    "Pickup van - 3 wheel",
    "Hiwa- 10wheels- 16cum",
    "Hiwa- 10wheels - 14cum",
    "Hiwa- 10wheel - 14cum",
    "Hiwa - 12wheels - 22cum",
    "Hiwa - 12wheel - 18 cum",
    "Hiwa - 6wheel - 10cum",
    "Mini Hiwa- 6 wheel - 10cum",
    "Mini Hiwa - 6 wheel-8cum",
    "Tipper - 6wheel -6cum",
    "Tipper - 6wheel - 5ucm",
    "Hiwa- 10wheel - 12 cum",
  ];

  const handleVehicleTypeChange = (selectedVehicleType) => {
    setVehicleType(selectedVehicleType);

    // Calculate cubic content based on the selected vehicle type
    // You might want to replace this with your own logic
    if (selectedVehicleType != "") {
      setCubicContent("3.0");
    } else {
      setCubicContent("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setISSubmit(true);
    try {
      const data = await fetch("/api/PdfGenerate", {
        method: "POST",
        body: JSON.stringify({
          date: startDate,
          phone: value,
          passNo,
          name,
          address,
          route,
          vecNo,
          vehicleType,
          cubicContent,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((t) => t.json());
      console.log(data, "form");
      if (data.status === 200) {
        alert("Data Submitted Successfully");
      }
      setImgS(data.qr);
      // setValue("");
      // setStartDate("");
      // setAddress("");
      // setCubicContent("3.00");
      // setName("");
      // setPassNo("");
      // setRoute("");
      // setVehicleType("");
      // setVecNo("");
    } catch (error) {
      console.log(error);
    } finally {
      setISSubmit(false);
    }

    // Handle form submission logic here
    // You can access form fields like passNo, name, address, etc.
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 mt-3 px-5 py-5 rounded-lg w-max"
      style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
    >
      <div className="flex">
        <input
          className="rounded px-1 py-1 h-[35px] w-[260px] w-[260px] border-solid border-slate-500 border-2 focus:outline-none"
          type="text"
          value={passNo}
          placeholder="Enter Pass No."
          onChange={(e) => setPassNo(e.target.value)}
        />
      </div>
      <div>
        <DatePicker
          selected={startDate}
          name="dateTime"
          id="dateTime"
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          required
          popperPlacement="top"
          popperModifiers={[
            {
              name: "offset",
              options: {
                offset: [5, 10],
              },
            },
            {
              name: "preventOverflow",
              options: {
                rootBoundary: "viewport",
                tether: false,
                altAxis: true,
              },
            },
          ]}
          className="focus:outline-none  border-solid border-slate-500 border-2 h-[35px] w-[260px] rounded  px-1 py-1"
          placeholderText="Enter  Date"
        />
      </div>
      <div>
        <input
          type="text"
          value={name}
          className="focus:outline-none  border-solid border-slate-500 border-2 h-[35px] w-[260px] rounded  px-1 py-1"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          value={address}
          className="focus:outline-none  border-solid border-slate-500 border-2 h-[35px] w-[260px] rounded  px-1 py-1"
          placeholder="Enter Address"
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>
        <PhoneInput
          name="customerPhone"
          rules={{ required: true }}
          defaultCountry="IN"
          placeholder="Enter Phone Number*"
          className="focus:outline-none  border-solid border-slate-500 border-2 h-[35px] w-[260px] rounded  px-1 py-1"
          value={value}
          required
          onChange={setValue}
        />
      </div>
      <div>
        <input
          type="text"
          value={route}
          placeholder="Enter Route"
          className="focus:outline-none  border-solid border-slate-500 border-2 h-[35px] w-[260px] rounded  px-1 py-1"
          onChange={(e) => setRoute(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          value={vecNo}
          className="focus:outline-none  border-solid border-slate-500 border-2 h-[35px] w-[260px] rounded  px-1 py-1"
          placeholder="Enter Vehicle No."
          onChange={(e) => setVecNo(e.target.value)}
        />
      </div>
      <div>
        <select
          value={vehicleType}
          className="focus:outline-none  border-solid border-slate-500 border-2 h-[35px] w-[260px] rounded  px-1 py-1"
          onChange={(e) => handleVehicleTypeChange(e.target.value)}
        >
          <option value="">Select Vehicle Type</option>
          {vehicleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {vehicleType === "" ? (
        ""
      ) : (
        <div>
          <input
            type="text"
            value={cubicContent}
            readOnly
            className="focus:outline-none  border-solid border-slate-500 border-2 h-[35px] w-[260px] rounded  px-1 py-1"
          />
        </div>
      )}

      <div className="w-[40%]">
        <button
          type="submit"
          className={
            isSubmit
              ? "rounded bg-lime-900 text-white  flex  px-3 py-1 gap-2 justify-between disabled: bg-slate-600"
              : "rounded bg-lime-900 text-white  flex  px-3 py-1 gap-2 justify-between"
          }
          disabled={isSubmit ? true : false}
        >
          {isSubmit ? <span className="loader"></span> : "submit"}
        </button>
      </div>
    </form>
  );
};

export default YourFormComponent;
