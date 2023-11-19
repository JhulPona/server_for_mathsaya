import { useState } from "react";
import { FaTrash, FaDoorOpen } from "react-icons/fa";
import { BsListTask } from "react-icons/bs";

import ImageModal from "./ImageModal";
import VideoModal from "./VideoModal";

const LessonList = ({
  selectedYunitId,
  handleDeleteLesson,
  handleSearchChangeLessons,
  searchQueryLessons,
  filteredLessons,
  handleView,
  serverUrl,
}) => {
  const [modalOpenImage, setModalOpenImage] = useState(false);
  const [modalOpenVideo, setModalOpenVideo] = useState(false);

  const [modalImageUrl, setModalImageUrl] = useState("");
  const [modalVideoUrl, setModalVideoUrl] = useState("");

  const openImageModal = (imageSrc) => {
    setModalImageUrl(imageSrc);
    setModalOpenImage(true);
  };

  const openVideoModal = (videoSrc) => {
    setModalVideoUrl(videoSrc);
    setModalOpenVideo(true);
  };

  const closeModal = () => {
    setModalOpenImage(false);
    setModalOpenVideo(false);
    setModalImageUrl("");
    setModalVideoUrl("");
  };

  return (
    <div className="mb-5 p-4 bg-white bg-opacity-60 border border-black rounded">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-2 md:mb-0 md:mr-2">
          <h2 className="text-xl font-semibold">LISTAHAN SA MGA LEKSYON</h2>
        </div>
        <div className="flex items-center pb-2">
          <label className="mr-2">Pangita:</label>
          <input
            type="text"
            placeholder="Pangitaanan ug leksyon"
            className="border rounded px-2 py-1"
            value={searchQueryLessons}
            onChange={handleSearchChangeLessons}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {filteredLessons.length > 0 ? (
          <table className="w-full border-collapse border border-gray-600 text-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-600 px-4 py-2 animate-bounce">
                  Pilia
                </th>
                <th className="border border-gray-600 px-4 py-2">
                  Tibuok pangalan
                </th>
                <th className="border border-gray-600 px-4 py-2">Imahe</th>
                <th className="border border-gray-600 px-4 py-2">
                  Numero kung Ikapila
                </th>
                <th className="border border-gray-600 px-4 py-2">Pangalan</th>
                <th className="border border-gray-600 px-4 py-2">
                  Deskripsyon
                </th>
                <th className="border border-gray-600 px-4 py-2">
                  Bidyo Diskasyon
                </th>
                <th className="border border-gray-600 px-4 py-2">Panason</th>
              </tr>
            </thead>
            <tbody>
              {filteredLessons.map((lesson) => (
                <tr
                  className="hover:bg-gray-100 text-center text-sm"
                  key={lesson.lessonId}>
                  <td className="border border-gray-600 px-4 py-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 text-2xl"
                      onClick={() => {
                        handleView(lesson.lessonId);
                      }}>
                      <BsListTask />
                    </button>
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {lesson.lessonTitle}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 space-x-4">
                    {lesson.lessonThumbnail && (
                      <div className="flex items-center justify-center">
                        <img
                          src={`${serverUrl}/uploads/lessons/${lesson.lessonThumbnail}`}
                          alt="Not found"
                          className="w-16 h-16 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                          onClick={() =>
                            openImageModal(
                              `${serverUrl}/uploads/lessons/${lesson.lessonThumbnail}`
                            )
                          }
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {lesson.lessonNumber}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {lesson.lessonName}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {lesson.lessonDescription}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 text-2xl hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                      onClick={() => {
                        openVideoModal(lesson.lessonVideo);
                      }}>
                      Lantawang bidyo
                    </button>
                  </td>
                  <td className="border border-gray-600 px-4 py-2 space-x-4">
                    <button
                      className="text-red-500 hover:text-red-700 text-2xl"
                      onClick={() => handleDeleteLesson(lesson.lessonId)}>
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
              Walay mga leksyon nakita!
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
      {modalOpenVideo && (
        <VideoModal
          modalOpenVideo={modalOpenVideo}
          closeModal={closeModal}
          modalVideoUrl={modalVideoUrl}
        />
      )}
    </div>
  );
};

export default LessonList;
