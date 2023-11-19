import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import axios from "axios";

const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

const StudentProfile = ({ studentProfileId, studentLeast }) => {
  const [studentProfile, setStudentProfile] = useState(null);
  useEffect(() => {
    if (studentProfileId) {
      getStudentProfile(studentProfileId)
        .then((data) => setStudentProfile(data))
        .catch((error) =>
          console.error("Error fetching student profile:", error)
        );
    }
  }, [studentProfileId]);

  const getStudentProfile = async (studentProfileId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/sprofile/student-profile/${studentProfileId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }
  };
  return (
    <>
      <div className="mb-5 p-4 bg-white bg-opacity-60 border border-black rounded">
        {studentProfile ? (
          <div className="p-4">
            <h2 className="text-3xl font-semibold mb-6 text-blue-600">
              PROFAYL SA ESTUDYANTE
            </h2>

            <div className="bg-blue-200 rounded p-4 mb-6 hover:shadow-md hover:ring-4 ring-blue-400 transition duration-300">
              <h2 className="text-2xl font-bold mb-2 text-blue-600">
                {studentProfile.student.firstname}{" "}
                {studentProfile.student.lastname}
              </h2>
              <div className="text-blue-600">
                <p className="mb-2">Petsa sa pinaka unang sign-in:</p>
                <div className="bg-white rounded p-2 border border-blue-400">
                  {new Date(
                    studentProfile.studentProfile.firstLoginDate
                  ).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-green-200 rounded p-4 hover:shadow-md hover:ring-4 ring-green-400 transition duration-300">
                <h3 className="text-2xl font-bold text-green-600">
                  Rekord sa mga Ehersisyo
                </h3>
                <ul className="list-disc ml-4">
                  {studentProfile.completedExercises.map((exercise) => (
                    <li
                      key={exercise.id}
                      className="text-blue-600 hover:text-blue-800 transition duration-300 p-1">
                      <span className="mr-2">
                        {exercise.Exercise.exerciseTitle}
                      </span>
                      <span className="flex text-gray-500">
                        - Bituon: {exercise.starRating} ⭐
                      </span>
                      {exercise.completionTime && (
                        <span className="flex items-center">
                          - Petsa:{" "}
                          {new Date(exercise.completionTime).toLocaleString()}
                          <FaClock className="ml-1" />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-200 rounded p-4 hover:shadow-md hover:ring-4 ring-yellow-400 transition duration-300">
                <h3 className="text-2xl font-bold text-yellow-600">
                  Rekord sa mga Leksyon
                </h3>
                <ul className="list-disc ml-4">
                  {studentProfile.completedLessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="text-blue-600 hover:text-blue-800 transition duration-300 p-1">
                      {lesson.Lesson.lessonTitle}{" "}
                      <span className="flex text-gray-500">
                        - Bituon: {lesson.starRating} ⭐
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-200 rounded p-4 hover:shadow-md hover:ring-4 ring-red-400 transition duration-300">
                <h3 className="text-2xl font-bold text-red-600">
                  Rekord sa mga Yunit
                </h3>
                <ul className="list-disc ml-4">
                  {studentProfile.completedUnits.map((yunit) => (
                    <li
                      key={yunit.id}
                      className="text-blue-600 hover:text-blue-800 transition duration-300 p-1">
                      {yunit.Yunit.yunitTitle}{" "}
                      <span className="flex text-gray-500">
                        - Bituon: {yunit.starRating} ⭐
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-purple-200 rounded p-4 mt-6 hover:shadow-md hover:ring-4 ring-purple-400 transition duration-300">
              <h2 className="text-2xl font-bold mb-2 text-purple-600">
                Gikabalak-an sa Estudyante
              </h2>
              <div className="text-blue-600">
                <p className="mb-2">Ehersisyo nga nagkalisod ang estudyante:</p>
                <div className="bg-white rounded p-2 border border-blue-400 hover:text-blue-800">
                  {studentLeast.minExercise ? (
                    <div>
                      {studentLeast.minExercise.Exercise.exerciseTitle} -{" "}
                      <span className="text-gray-500">
                        Bituon: {studentLeast.minExercise.starRating} ⭐
                      </span>
                    </div>
                  ) : (
                    "Walay datos makuha"
                  )}
                </div>
                <p className="mb-2">Leksyon nga nagkalisod ang estudyante:</p>
                <div className="bg-white rounded p-2 border border-blue-400 hover:text-blue-800">
                  {studentLeast.minLesson ? (
                    <div>
                      {studentLeast.minLesson.Lesson.lessonTitle} -{" "}
                      <span className="text-gray-500">
                        Bituon: {studentLeast.minLesson.starRating} ⭐
                      </span>
                    </div>
                  ) : (
                    "Walay datos makuha"
                  )}
                </div>
                <p className="mb-2">Yunit nga nagkalisod ang estudyante:</p>
                <div className="bg-white rounded p-2 border border-blue-400 hover:text-blue-800">
                  {studentLeast.minYunit ? (
                    <div>
                      {studentLeast.minYunit.Yunit.yunitTitle} -{" "}
                      <span className="text-gray-500">
                        Bituon: {studentLeast.minYunit.starRating} ⭐
                      </span>
                    </div>
                  ) : (
                    "Walay datos makuha"
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500">
            Kani nga estudyante wala pa naka sign-in sa iyang akawnt.
          </div>
        )}
      </div>
    </>
  );
};

export default StudentProfile;
