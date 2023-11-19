import "../App.css";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";

export default function TeacherAuth() {
  const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

  const [isSignUp, setIsSignUp] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [speaking, setSpeaking] = useState(null);

  const speakText = (text) => {
    if (!speaking) {
      // Use ResponsiveVoice to speak the text in Filipino (Tagalog).
      responsiveVoice.speak(text, "Filipino Female"); // You can change the voice as needed.

      setSpeaking(text);
    }
  };

  const stopSpeaking = () => {
    if (speaking) {
      responsiveVoice.cancel();
      setSpeaking(null);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      window.location.href = "/teacherportal";
    } else {
      setIsLoading(false);
    }
  }, []);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Dili mao nga email").required("Kinahanglan"),
    password: Yup.string().required("Kinahanglan"),
    ...(isSignUp && {
      firstname: Yup.string().required("Kinahanglan"),
      lastname: Yup.string().required("Kinahanglan"),
      gender: Yup.string().required("Kinahanglan"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Kinahanglan pareha sa password")
        .required("Kinahanglan"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      gender: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isSignUp) {
          // Handle signup
          const response = await axios.post(
            `${serverUrl}/teachers/signup`,
            values
          );
          console.log("Signup response:", response.data);
          if (response.status === 201) {
            alert("Congrats! Malampuson ka nga nakabuhat!");
            window.location.reload();
          }
        } else {
          // Handle login
          const response = await axios.post(
            `${serverUrl}/teachers/login`,
            values
          );
          alert("Congrats! Malampuson ka nga nakasulod!");
          console.log("Login response:", response.data);

          if (response.data.token) {
            Cookies.set(
              "user",
              JSON.stringify({ id: response.data.user.teacherId })
            );
            Cookies.set("token", response.data.token);
            window.location.href = "/teacherportal";
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setLoginError("Mali ang email o ang password!");
        } else {
          console.error("Error:", error);
        }
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-tertiary p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">
            {isSignUp ? "Mag-sign Up" : "Mag-sign in"}
          </h2>
          <form onSubmit={formik.handleSubmit}>
            {isSignUp && (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    {...formik.getFieldProps("firstname")}
                    className="w-full p-2 border rounded"
                    placeholder="Isulat imong pangalan"
                    onFocus={() => speakText("Isulat ang imong pangalan")}
                    onMouseLeave={stopSpeaking}
                  />
                  {formik.touched.firstname && formik.errors.firstname && (
                    <div className="text-red-600">
                      {formik.errors.firstname}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    {...formik.getFieldProps("lastname")}
                    className="w-full p-2 border rounded"
                    placeholder="Isulat imong apilyedo"
                    onFocus={() => speakText("Isulat ang imong apilyedo")}
                    onMouseLeave={stopSpeaking}
                  />
                  {formik.touched.lastname && formik.errors.lastname && (
                    <div className="text-red-600">{formik.errors.lastname}</div>
                  )}
                </div>
                <div className="mb-4">
                  <select
                    {...formik.getFieldProps("gender")}
                    className="w-full p-2 border rounded"
                    onFocus={() =>
                      speakText("E click para mu ga-was ang pilian")
                    }
                    onMouseLeave={stopSpeaking}>
                    <option value="" disabled>
                      Unsa imong kinatawo
                    </option>
                    <option value="Lalaki">Lalaki</option>
                    <option value="Babae">Babae</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <div className="text-red-600">{formik.errors.gender}</div>
                  )}
                </div>
              </>
            )}
            <div className="mb-4">
              {loginError && <div className="text-red-600">{loginError}</div>}
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className="w-full p-2 border rounded"
                placeholder="Isulat imong email"
                onFocus={() => speakText("Isulat ang imong email")}
                onMouseLeave={stopSpeaking}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-600">{formik.errors.email}</div>
              )}
            </div>
            <div className="mb-4">
              <input
                type="password"
                {...formik.getFieldProps("password")}
                className="w-full p-2 border rounded"
                placeholder="Isulat imong password"
                onFocus={() => speakText("Isulat ang imong password")}
                onMouseLeave={stopSpeaking}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-600">{formik.errors.password}</div>
              )}
            </div>
            {isSignUp && (
              <div className="mb-4">
                <input
                  type="password"
                  {...formik.getFieldProps("confirmPassword")}
                  className="w-full p-2 border rounded"
                  placeholder="Isulat ug balik imong password"
                  onFocus={() => speakText("Isulat ug bahlik imong password")}
                  onMouseLeave={stopSpeaking}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className="text-red-600">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </div>
            )}
            <button
              type="submit"
              className="bg-secondary p-2 rounded w-full hover:bg-pink hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
              {isSignUp ? "Pag-sign Up" : "Pag-sign in"}
            </button>
          </form>
          <p className="mt-4">
            {isSignUp ? "Naa na koy akawnt!" : "Wala pa koy akawnt!"}
            <button
              onClick={toggleForm}
              className="text-blue-500 ml-1 underline cursor-pointer">
              {isSignUp ? "Pag-sign in" : "Pag-sign up"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
