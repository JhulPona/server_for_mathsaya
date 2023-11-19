import React, { useState } from "react";
import { AiFillMinusSquare, AiFillPlusSquare } from "react-icons/ai";
import { BiLogOut, BiEdit } from "react-icons/bi";
import Logo from "../assets/logo.png";

const TeacherInfo = ({ teacherInfo, logout, handleEditTeacher }) => {
  const [showInfo, setShowInfo] = useState(true);
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="mb-4 p-4 border rounded border-black bg-white bg-opacity-60">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-semibold mb-2 justify-start">BAHIN NAKO</h2>
        <button
          type="button"
          onClick={toggleInfo}
          className="flex flex-row rounded hover:shadow-lg hover:shadow-primary text-4xl justify-end transition duration-300 ease-in-out transform hover:scale-105">
          {showInfo ? (
            <AiFillMinusSquare className="text-primary" />
          ) : (
            <AiFillPlusSquare className="text-primary" />
          )}
        </button>
      </div>

      {showInfo && (
        <>
          <div className="flex justify-center">
            <img src={Logo} alt="Component Logo" className="h-40" />
          </div>
          <div className=" overflow-x-auto">
            {teacherInfo ? (
              <table className="w-full text-lg">
                <tbody className=" ">
                  <tr>
                    <td className="font-semibold ">Magtutudlo:</td>
                    <td className=" ">
                      {teacherInfo.firstname} {teacherInfo.lastname}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold ">Kinatawo:</td>
                    <td className=" ">{teacherInfo.gender}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold ">Email:</td>
                    <td className=" ">
                      <div>{teacherInfo.email}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className="uppercase font-bold">
                Nagkarga pa sa impormasyon, palihug hulata...
              </p>
            )}
          </div>
        </>
      )}
      <div className="space-x-2 flex text-2xl mt-4 justify-end">
        <button
          onClick={handleEditTeacher}
          className=" bg-blue-500 text-white p-2 rounded hover:bg-blue-600 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
          <BiEdit />
        </button>
        <button
          onClick={logout}
          className=" bg-red-500 text-white p-2 rounded hover:bg-red-600 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
          <BiLogOut />
        </button>
      </div>
    </div>
  );
};

export default TeacherInfo;
