import React from "react";
import { FaTrash } from "react-icons/fa";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const ExerciseList = ({
  selectedLessonId,
  handleDeleteExercise,
  handleSearchChangeExercise,
  searchQueryExercises,
  filteredExercises,
  handleView,
}) => {
  return (
    <div className="mb-5 p-4 bg-white bg-opacity-60 border border-black rounded">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-2 md:mb-0 md:mr-2">
          <h2 className="text-xl font-semibold">LISTAHAN SA MGA EHERSISYO</h2>
        </div>
        <div className="flex items-center pb-2">
          <label className="mr-2">Pangita:</label>
          <input
            type="text"
            placeholder="Pangitaanan ug ehersisyo"
            className="border rounded px-2 py-1"
            value={searchQueryExercises}
            onChange={handleSearchChangeExercise}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {filteredExercises.length > 0 ? (
          <table className="w-full border-collapse border border-gray-600 text-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-600 px-4 py-2 animate-bounce">
                  Pilia
                </th>
                <th className="border border-gray-600 px-4 py-2">
                  Tibuok pangalan
                </th>
                <th className="border border-gray-600 px-4 py-2">
                  Numero kung Ikapila
                </th>
                <th className="border border-gray-600 px-4 py-2">Pangalan</th>
                <th className="border border-gray-600 px-4 py-2">
                  Deskripsyon
                </th>
                <th className="border border-gray-600 px-4 py-2">Panaon</th>
              </tr>
            </thead>
            <tbody>
              {filteredExercises.map((exercise) => (
                <tr
                  className="hover:bg-gray-100 text-center text-sm"
                  key={exercise.exerciseId}>
                  <td className="border border-gray-600 px-4 py-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 text-2xl"
                      onClick={() => {
                        handleView(exercise.exerciseId);
                      }}>
                      <AiOutlineQuestionCircle />
                    </button>
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {exercise.exerciseTitle}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {exercise.exercise_number}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {exercise.exercise_name}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {exercise.exercise_description}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 space-x-4">
                    <button
                      className="text-red-500 hover:text-red-700 text-2xl"
                      onClick={() => handleDeleteExercise(exercise.exerciseId)}>
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
              Walay mga ehersisyo nakita!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseList;
