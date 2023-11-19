import React, { useEffect, useState } from "react";
import { FaDoorOpen, FaTrash } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";

const StudentList = ({
  selectedSectionId,
  handleDeleteStudent,
  handleSearchChangeStudents,
  searchQueryStudents,
  filteredStudents,
  handleView,
}) => {
  return (
    <div className="mb-5 p-4 bg-white bg-opacity-60 border border-black rounded">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-2 md:mb-0 md:mr-2">
          <h2 className="text-xl font-semibold">LISTAHAN SA MGA ESTUDYANTE</h2>
        </div>
        <div className="flex items-center pb-2">
          <label className="mr-2">Pangita:</label>
          <input
            type="text"
            placeholder="Pangitaanan ug estudyante"
            className="border rounded px-2 py-1"
            value={searchQueryStudents}
            onChange={handleSearchChangeStudents}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {filteredStudents.length > 0 ? (
          <table className="w-full border-collapse border border-gray-600 text-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-600 px-4 py-2 animate-bounce">
                  Pilia
                </th>
                <th className="border border-gray-600 px-4 py-2">Pangalan</th>
                <th className="border border-gray-600 px-4 py-2">Apilyedo</th>
                <th className="border border-gray-600 px-4 py-2">Angga</th>
                <th className="border border-gray-600 px-4 py-2">Kinatawo</th>
                <th className="border border-gray-600 px-4 py-2">Panaon</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  className="hover:bg-gray-100 text-center text-sm"
                  key={student.studentId}>
                  <td className="border border-gray-600 px-4 py-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 text-2xl"
                      onClick={() => {
                        handleView(student.studentId);
                      }}>
                      <BsPersonCircle />
                    </button>
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {student.firstname}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {student.lastname}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {student.username}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {student.gender}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 space-x-4">
                    <button
                      className="text-red-500 hover:text-red-700 text-2xl"
                      onClick={() => handleDeleteStudent(student.studentId)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center p-10">
            <p className="text-white bg-red-500 font-bold p-2">
              Walay mga estudyante nakita!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
