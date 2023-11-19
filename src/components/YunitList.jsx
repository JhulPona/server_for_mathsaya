import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { LuTextSelect } from "react-icons/lu";
import ImageModal from "./ImageModal";

const YunitList = ({
  handleDeleteYunit,
  handleSearchChangeYunits,
  searchQueryYunits,
  filteredYunits,
  handleView,
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
          <h2 className="text-xl font-semibold">LISTAHAN SA MGA YUNIT</h2>
        </div>
        <div className="flex items-center pb-2">
          <label className="mr-2">Pangita:</label>
          <input
            type="text"
            placeholder="Pangitaanan ug yunit"
            className="border rounded px-2 py-1"
            value={searchQueryYunits}
            onChange={handleSearchChangeYunits}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {filteredYunits.length > 0 ? (
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
                <th className="border border-gray-600 px-4 py-2">Panason</th>
              </tr>
            </thead>
            <tbody>
              {filteredYunits.map((yunit) => (
                <tr
                  className="hover:bg-gray-100 text-center text-sm"
                  key={yunit.yunitId}>
                  <td className="border border-gray-600 px-4 py-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 text-2xl"
                      onClick={() => {
                        handleView(yunit.yunitId);
                      }}>
                      <LuTextSelect />
                    </button>
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {yunit.yunitTitle}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 space-x-4">
                    {yunit.yunitThumbnail && (
                      <div className="flex items-center justify-center">
                        <img
                          src={`${serverUrl}/uploads/yunits/${yunit.yunitThumbnail}`}
                          alt="Not found"
                          className="w-16 h-16 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                          onClick={() =>
                            openImageModal(
                              `${serverUrl}/uploads/yunits/${yunit.yunitThumbnail}`
                            )
                          }
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {yunit.yunitNumber}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {yunit.yunitName}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 space-x-4">
                    <button
                      className="text-red-500 hover:text-red-700 text-2xl"
                      onClick={() => handleDeleteYunit(yunit.yunitId)}>
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
              Walay mga yunit nakita!
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

export default YunitList;
