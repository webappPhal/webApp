import { useState, useRef } from "react";
import { login } from "../../lib/auth";
import { useRouter } from "next/router";

function AuthForm() {
  const router = useRouter();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [error, setError] = useState({
    password: false,
    user: false,
  });
  const [loading, setLoading] = useState(false);
  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setLoading(true);
    // optional: Add validation
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: enteredEmail,
          password: enteredPassword,
        }),
      });
      if (response.status === 200) {
        const { token, role, team } = await response.json();
        login({ token, role, team }, true);
      } else if (response.status === 404) {
        const { message } = await response.json();
        setError({ ...error, user: true });
      } else if (response.status === 401) {
        const { message } = await response.json();
        setError({ ...error, password: true });
      } else {
        console.log("Login failed.");
        // https://github.com/developit/unfetch#caveats
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    } catch (err) {
      console.error(
        "You have an error in your code or there are network issues.",
        err
      );
    }
    setLoading(false);
  }

  return (
    <section
      className="flex items-center justify-center flex-col bg-blur-1 saturate-167 bg-[#fff5] border border-gray-300
    w-max rounded-lg px-6 py-10"
    >
      <h1 className="text-2xl font-bold "> Login</h1>
      <form onSubmit={submitHandler} className="flex flex-col  rounded-xl">
        <div className="flex flex-col mb-3">
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            required
            className="rounded h-[35px] px-2"
            ref={emailInputRef}
            onChange={() => setError({ password: false, user: false })}
          />
          {error.user ? <p className="text-red-400">user not exist</p> : ""}
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            className="rounded h-[35px] px-2"
            onChange={() => setError({ password: false, user: false })}
            ref={passwordInputRef}
          />
          {error.password ? (
            <p className="text-red-400">Incorrect Password</p>
          ) : (
            ""
          )}
        </div>
        <div className="flex w-full items-center justify-center">
          {loading ? (
            <div className="loader">Loading...</div>
          ) : (
            <button className="bg-[#ffffff6e] px-7 py-2 rounded">LogIn</button>
          )}
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
