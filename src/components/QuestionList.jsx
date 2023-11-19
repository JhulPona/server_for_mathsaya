import React, { useState } from "react";
import { FaTrash, FaDoorOpen } from "react-icons/fa";
import ImageModal from "./ImageModal";

const QuestionList = ({
  selectedExerciseId,
  handleDeleteQuestion,
  handleSearchChangeQuestion,
  searchQueryQuestions,
  filteredQuestions,
  serverUrl,
}) => {
  const [modalOpenImage, setModalOpenImage] = useState(false);

  const [modalImageUrl, setModalImageUrl] = useState("");

  const openImageModal = (imageSrc) => {
    setModalImageUrl(imageSrc);
    setModalOpenImage(true);
  };

  const closeModal = () => {
    setModalOpenImage(false);
    setModalImageUrl("");
  };
  return (
    <div className="mb-5 p-4 bg-white bg-opacity-60 border border-black rounded">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-2 md:mb-0 md:mr-2">
          <h2 className="text-xl font-semibold">LISTAHAN SA MGA TUBAGONON</h2>
        </div>
        <div className="flex items-center pb-2">
          <label className="mr-2">Search:</label>
          <input
            type="text"
            placeholder="Pangitaanan ug tubagonon"
            className="border rounded px-2 py-1"
            value={searchQueryQuestions}
            onChange={handleSearchChangeQuestion}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {filteredQuestions.length > 0 ? (
          <table className="w-full border-collapse border border-gray-600 text-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-600 px-4 py-2">Pangutana</th>
                <th className="border border-gray-600 px-4 py-2">
                  Pikstsur sa pangutana
                </th>
                <th className="border border-gray-600 px-4 py-2">
                  Pilianan sa Tubag
                </th>
                <th className="border border-gray-600 px-4 py-2">
                  Saktong Tubag
                </th>
                <th className="border border-gray-600 px-4 py-2">Panaon</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question) => (
                <tr
                  className="hover:bg-gray-100 text-center text-sm"
                  key={question.questionId}>
                  <td className="border border-gray-600 px-4 py-2">
                    {question.question_text}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {question.questionImage && (
                      <div className="flex items-center justify-center">
                        <img
                          src={`${serverUrl}/uploads/questions/${question.questionImage}`}
                          alt="Not found"
                          className="w-16 h-16 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                          onClick={() =>
                            openImageModal(
                              `${serverUrl}/uploads/questions/${question.questionImage}`
                            )
                          }
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {question.answer_choices.join(", ")}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {question.correct_answer}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 space-x-4">
                    <button
                      className="text-red-500 hover:text-red-700 text-2xl"
                      onClick={() => handleDeleteQuestion(question.questionId)}>
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
              No Questions found!
            </p>
          </div>
        )}
      </div>
      {modalOpenImage && (
        <ImageModal
          modalOpenImage={modalOpenImage}
          closeModal={closeModal}
          modalImageUrl={modalImageUrl}
        />
      )}
    </div>
  );
};

export default QuestionList;
