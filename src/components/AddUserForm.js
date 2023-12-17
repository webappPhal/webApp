import React, { useState, useEffect } from "react";

import { BiShow, BiHide } from "react-icons/bi";
import Toast from "./Toast/Toast";

const AddUserFrom = () => {
  //offset to maintain time zone difference

  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
    msg: "",
    success: true,
  });
  const [showPass, setShowPass] = useState(false);
  const [query, setQuery] = useState({
    email: "",
    password: "",
    role: "",
  });

  // Update inputs value
  const handleParam = () => (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Form Submit function

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetch("/api/User/register", {
        method: "POST",
        body: JSON.stringify({
          email: query.email,
          password: query.password,
          role: query.role,
          team: query.team,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((t) => t.json());
      if (data.response === 200) {
        setUser({ ...user, email: data.email, password: data.password });
        setQuery({
          email: "",
          password: "",
          role: "",
          team: "",
        });
        setUser({ ...user, msg: data.message, success: true });
      } else {
        setDisplay(true);
        setUser({ ...user, msg: data.message, success: false });
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDisplay(false);
    }, 100);
    clearTimeout(timeOut);
  }, [display]);
  let btnText = "create user";

  return (
    <div>
      <form
        className="bg-emerald-100 px-8 py-6 rounded-lg flex flex-col justify-center"
        onSubmit={formSubmit}
        onChange={() => {
          setUser({ ...user, msg: "" });
          setDisplay(false);
        }}
      >
        <div className="flex flex-col mb-3">
          <input
            id="email"
            type="email"
            name="email"
            required
            className="rounded h-[35px] px-2 placeholder:text-xs focus:outline-none text-xs"
            placeholder="Enter User Email*"
            value={query.email}
            onChange={handleParam()}
          />
          {user.msg === "" ? "" : <label htmlFor="email">{user.msg}</label>}
        </div>

        <div className="flex  items-center mb-3 bg-white px-2 rounded">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            required
            className="rounded h-[35px] placeholder:text-xs focus:outline-none text-xs"
            placeholder="Enter User Password*"
            value={query.password}
            onChange={handleParam()}
          />
          {showPass ? (
            <BiShow onClick={() => setShowPass(false)} />
          ) : (
            <BiHide onClick={() => setShowPass(true)} />
          )}
        </div>
        <div className="flex flex-col mb-3">
          <select
            name="role"
            required
            value={query.role}
            className="rounded h-[35px] placeholder:text-xs focus:outline-none text-xs text-[#646464] px-2"
            onChange={handleParam()}
            placeholder="Select User Role*"
          >
            <option value="">User Role*</option>

            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>

        {loading ? (
          <div className="center">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        ) : (
          <button
            type="submit"
            className="text-xs bg-white rounded px-5 py-2 hover:bg-green-200"
          >
            {btnText}
          </button>
        )}
      </form>
      {display ? <Toast content={user.msg} success={user.success} shows /> : ""}
    </div>
  );
};

export default AddUserFrom;
