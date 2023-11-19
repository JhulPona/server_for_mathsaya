import "../App.css";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";

export default function StudentAuth() {
  const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

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
    const studentProfile = Cookies.get("studentProfile");
    if (studentProfile) {
      window.location.href = "/mathsaya-game";
    } else {
      setIsLoading(false);
    }
  }, []);

  const validationSchema = Yup.object({
    firstname: Yup.string().required("Kinahanglan"),
    lastname: Yup.string().required("Kinahanglan"),
    username: Yup.string().required("Kinahanglan"),
  });

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      username: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Handle student login
        const response = await axios.post(
          `${serverUrl}/sprofile/login`,
          values
        );

        if (response.data.profile) {
          Cookies.set(
            "studentProfile",
            JSON.stringify({ id: response.data.profile.profileId })
          );
          alert("Congrats! Malampuson ka nga nakasulod.");
          window.location.href = "/mathsaya-game";
        } else {
          alert("Wala paka sa listahan. Palihug kontaka ang imong magtutudlo.");
          setLoginError("Wala nakita imong pangalan");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setLoginError("Wala nakita imong pangalan");
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
          <h2 className="text-2xl font-semibold mb-4">Mag-sign in</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              {loginError && <div className="text-red-600">{loginError}</div>}
              <input
                type="text"
                {...formik.getFieldProps("firstname")}
                className="w-full p-2 border rounded"
                placeholder="Isulat imong pangalan"
                onFocus={() => speakText("Isulat ang imong pangalan")}
                onMouseLeave={stopSpeaking}
              />
              {formik.touched.firstname && formik.errors.firstname && (
                <div className="text-red-600">{formik.errors.firstname}</div>
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
              <input
                type="text"
                {...formik.getFieldProps("username")}
                className="w-full p-2 border rounded"
                placeholder="Imong username gikan sa maestra"
                onFocus={() =>
                  speakText("Isulat ang imong username gikan sa maestra")
                }
                onMouseLeave={stopSpeaking}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-600">{formik.errors.username}</div>
              )}
            </div>
            <button
              type="submit"
              className="bg-secondary p-2 rounded w-full hover:bg-pink hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
              Mag-sign in
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
