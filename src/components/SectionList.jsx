import React from "react";
import { FaTrash, FaDoorOpen } from "react-icons/fa";

const SectionList = ({
  handleDeleteSection,
  handleSearchChangeSections,
  searchQuerySections,
  filteredSections,
  handleView,
}) => {
  return (
    <div className="mb-5 p-4 bg-white bg-opacity-60 border border-black rounded">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-2 md:mb-0 md:mr-2">
          <h2 className="text-xl font-semibold">LISTAHAN SA MGA SEKSYON</h2>
        </div>
        <div className="flex items-center pb-2">
          <label className="mr-2">Pangita:</label>
          <input
            type="text"
            placeholder="Pangitaanan ug seksyon"
            className="border rounded px-2 py-1"
            value={searchQuerySections}
            onChange={handleSearchChangeSections}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {filteredSections.length > 0 ? (
          <table className="w-full border-collapse border border-gray-600 text-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-600 px-4 py-2 animate-bounce">
                  Pilia
                </th>
                <th className="border border-gray-600 px-4 py-2">
                  Tuig sa Pagtungha
                </th>
                <th className="border border-gray-600 px-4 py-2">
                  Pangalan sa Seksyon
                </th>
                <th className="border border-gray-600 px-4 py-2">
                  Pila ka Estudyante
                </th>
                <th className="border border-gray-600 px-4 py-2">Panaon</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.map((section) => (
                <tr
                  className="hover:bg-gray-100 text-center text-sm"
                  key={section.sectionId}>
                  <td className="border border-gray-600 px-4 py-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 text-2xl"
                      onClick={() => {
                        handleView(section.sectionId);
                      }}>
                      <FaDoorOpen />
                    </button>
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {section.schoolYear}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {section.sectionName}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {section.totalStudents}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 space-x-4">
                    <button
                      className="text-red-500 hover:text-red-700 text-2xl"
                      onClick={() => handleDeleteSection(section.sectionId)}>
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
              Walay mga seskyon nakita!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionList;
