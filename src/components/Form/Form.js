// components/YourFormComponent.js

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const YourFormComponent = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [value, setValue] = useState();
  const [passNo, setPassNo] = useState("");
  const [name, setName] = useState("");
  const [sourceAuction, setSourceAuction] = useState("");
  const [permitHolder, setPermitHolder] = useState("");
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

  const vehicleCumData = {
    "Hiwa-10 wheels - 18 cum": "18CUM",
    "Truck- 4 wheels": "4CUM",
    "Tata 407 - 4 wheels": "4CUM",
    "Tractor - 4 wheels": "4CUM",
    "Pickup van - 4 wheel": "4CUM",
    "Pickup van - 3 wheel": "4CUM",
    "Hiwa- 10wheels- 16cum": "16CUM",
    "Hiwa- 10wheels - 14cum": "14CUM",
    "Hiwa- 10wheel - 14cum": "14CUM",
    "Hiwa - 12wheels - 22cum": "22CUM",
    "Hiwa - 12wheel - 18 cum": "18CUM",
    "Hiwa - 6wheel - 10cum": "10CUM",
    "Mini Hiwa- 6 wheel - 10cum": "10CUM",
    "Mini Hiwa - 6 wheel-8cum": "8CUM",
    "Tipper - 6wheel -6cum": "6CUM",
    "Tipper - 6wheel - 5ucm": "5CUM",
    "Hiwa- 10wheel - 12 cum": "12CUM",
  };
  const handleVehicleTypeChange = (selectedVehicleType) => {
    setVehicleType(selectedVehicleType);
    let cubicContent = "";
    // Calculate cubic content based on the selected vehicle type
    // You might want to replace this with your own logic
    if (selectedVehicleType !== "") {
      cubicContent = vehicleCumData[selectedVehicleType] || "";
      setCubicContent(cubicContent);
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
          endDate: endDate,
          phone: value,
          passNo,
          name,
          sourceAuction,
          permitHolder,
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
      <div style={{ display: "flex", flexFlow: "column", gap: "10px" }}>
        <DatePicker
          selected={startDate}
          name="dateTime"
          id="dateTime"
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          timeIntervals={15}
          showTimeSelectSeconds // Enable selecting seconds
          dateFormat="d-MMM-yyyy h:mm:ss aa"
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
          placeholderText="Enter  start Date"
        />
        <DatePicker
          name="endDateTime"
          id="endDateTime"
          placeholderText="Enter end Date"
          selected={endDate}
          showTimeSelect
          showTimeSelectSeconds // Enable selecting seconds
          dateFormat="d-MMM-yyyy h:mm:ss aa"
          onChange={(date) => setEndDate(date)}
          selectsEnd
          timeIntervals={15}
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
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
          value={sourceAuction}
          className="focus:outline-none  border-solid border-slate-500 border-2 h-[35px] w-[260px] rounded  px-1 py-1"
          placeholder="Name of the Quarry/Lease/Source of Auction"
          onChange={(e) => setSourceAuction(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          value={permitHolder}
          className="focus:outline-none  border-solid border-slate-500 border-2 h-[35px] w-[260px] rounded  px-1 py-1"
          placeholder="Name of the Licensee/Lessee/Permit Holder/Auction Holder/Auction Purchaser"
          onChange={(e) => setPermitHolder(e.target.value)}
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
            onChange={(e) => handleVehicleTypeChange(e.target.value)}
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
