import { useState } from "react";
import { FiUsers, FiBook, FiCheckSquare, FiUser } from "react-icons/fi";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const Dashboard = ({
  studentCount,
  unitCreatedAt,
  lessonCreatedAt,
  exerciseCreatedAt,
  completedExerInfo,
  studentProfilesInfo,
}) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [showFormStudentStat, setShowFormStudentStat] = useState(null);
  const [showFormCompleteExer, setshowFormCompleteExer] = useState(null);
  const [showFormLessonStat, setShowFormLessonStat] = useState(null);
  const [showFormExerciseStat, setShowFormExerciseStat] = useState(null);
  const [showFormCompletedExer, setShowFormCompletedExer] = useState(null);
  const [showFormProfileStat, setShowFormProfileStat] = useState(null);

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
  };

  const toggleFormStudentStat = () => {
    setShowFormStudentStat(!showFormStudentStat);
  };
  const toggleFormUnitStat = () => {
    setshowFormCompleteExer(!showFormCompleteExer);
  };
  const toggleFormLessonStat = () => {
    setShowFormLessonStat(!showFormLessonStat);
  };
  const toggleFormExerciseStat = () => {
    setShowFormExerciseStat(!showFormExerciseStat);
  };
  const toggleFormCompletedExer = () => {
    setShowFormCompletedExer(!showFormCompletedExer);
  };
  const toggleFormProfileStat = () => {
    setShowFormProfileStat(!showFormProfileStat);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 p-4">
      {/* Student Statistics */}
      <div className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 px-2 py-1">
        <FiUsers className="text-xl text-primary" />
        <h3 className="text-lg font-semibold mb-2 text-primary">
          Student Statistics
        </h3>
        {selectedSection ? (
          <div className="w-full h-64 overflow-x-auto flex justify-center">
            <PieChart width={400} height={200}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={[
                  {
                    name: "Male",
                    value: selectedSection.maleCount,
                    fill: getRandomColor(),
                  },
                  {
                    name: "Female",
                    value: selectedSection.femaleCount,
                    fill: getRandomColor(),
                  },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              />
              <Tooltip />
            </PieChart>
          </div>
        ) : (
          <div className="w-full h-64 overflow-x-auto flex justify-center text-red-500">
            Select a section to view chart!
          </div>
        )}
        <div className="flex flex-row justify-end pt-2 pb-2">
          <button
            type="button"
            onClick={toggleFormStudentStat}
            className="flex flex-row rounded hover:shadow-lg hover:shadow-pink hover:bg-pink hover:text-white text-xl justify-center transition duration-300 ease-in-out transform hover:scale-105 px-2 py-1">
            {showFormStudentStat ? "TAGUAN" : "IPAKITA"}
          </button>
        </div>
        {showFormStudentStat && (
          <>
            {studentCount.map((section, index) => (
              <div key={index} className="mt-4 overflow-y-auto">
                <p className="text-base font-semibold">
                  Section: {section.sectionName}
                </p>
                <p>Total Students: {section.totalStudents}</p>
                <p>Male Students: {section.maleCount}</p>
                <p>Female Students: {section.femaleCount}</p>
                <button
                  onClick={() => handleSectionSelect(section)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition duration-300 ease-in-out">
                  Show Distribution
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Teaching Units Statistics */}
      <div className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 px-2 py-1">
        <FiBook className="text-xl text-primary" />
        <h3 className="text-lg font-semibold mb-2 text-primary">
          Teaching Units Statistics
        </h3>
        <div className="w-full h-64 overflow-x-auto">
          <LineChart width={800} height={200} data={unitCreatedAt}>
            <XAxis dataKey="yunitName" interval={0} tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => [value, "Created At"]}
            />
            <Legend align="center" verticalAlign="top" height={36} />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="createdAt"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </div>
        <div className="flex flex-row justify-end pt-2 pb-2">
          <button
            type="button"
            onClick={toggleFormUnitStat}
            className="flex flex-row rounded hover:shadow-lg hover:shadow-pink hover:bg-pink hover:text-white text-xl justify-center transition duration-300 ease-in-out transform hover:scale-105 px-2 py-1">
            {showFormCompleteExer ? "TAGUAN" : "IPAKITA"}
          </button>
        </div>
        {showFormCompleteExer && (
          <>
            {unitCreatedAt.map((unit, index) => (
              <div key={index} className="mt-4 overflow-y-auto">
                <p className="text-base font-semibold">
                  Unit: {unit.yunitName}
                </p>
                <p>Created At: {unit.createdAt}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Teaching Lessons Statistics */}
      <div className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 px-2 py-1">
        <FiBook className="text-xl text-primary" />
        <h3 className="text-lg font-semibold mb-2 text-primary">
          Teaching Lessons Statistics
        </h3>
        <div className="w-full h-64 overflow-x-auto">
          <LineChart width={800} height={200} data={lessonCreatedAt}>
            <XAxis dataKey="lessonName" interval={0} tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => [value, "Created At"]}
            />
            <Legend align="center" verticalAlign="top" height={36} />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="createdAt"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </div>
        <div className="flex flex-row justify-end pt-2 pb-2">
          <button
            type="button"
            onClick={toggleFormLessonStat}
            className="flex flex-row rounded hover:shadow-lg hover:shadow-pink hover:bg-pink hover:text-white text-xl justify-center transition duration-300 ease-in-out transform hover:scale-105 px-2 py-1">
            {showFormLessonStat ? "TAGUAN" : "IPAKITA"}
          </button>
        </div>
        {showFormLessonStat && (
          <>
            {lessonCreatedAt.map((lesson, index) => (
              <div key={index} className="mt-4 overflow-y-auto">
                <p className="text-base font-semibold">
                  Lesson: {lesson.lessonName}
                </p>
                <p>Created At: {lesson.createdAt}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Teaching Exercises Statistics */}
      <div className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 px-2 py-1">
        <FiBook className="text-xl text-primary" />
        <h3 className="text-lg font-semibold mb-2 text-primary">
          Teaching Exercises Statistics
        </h3>
        <div className="w-full h-64 overflow-x-auto">
          <LineChart width={800} height={200} data={exerciseCreatedAt}>
            <XAxis
              dataKey="exercise_name"
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => [value, "Created At"]}
            />
            <Legend align="center" verticalAlign="top" height={36} />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="createdAt"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </div>
        <div className="flex flex-row justify-end pt-2 pb-2">
          <button
            type="button"
            onClick={toggleFormExerciseStat}
            className="flex flex-row rounded hover:shadow-lg hover:shadow-pink hover:bg-pink hover:text-white text-xl justify-center transition duration-300 ease-in-out transform hover:scale-105 px-2 py-1">
            {showFormExerciseStat ? "TAGUAN" : "IPAKITA"}
          </button>
        </div>
        {showFormExerciseStat && (
          <>
            {exerciseCreatedAt.map((exercise, index) => (
              <div key={index} className="mt-4 overflow-y-auto">
                <p className="text-base font-semibold">
                  Exercise: {exercise.exercise_name}
                </p>
                <p>Created At: {exercise.createdAt}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Completed Exercises Statistics */}
      <div className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 px-2 py-1">
        <FiCheckSquare className="text-xl text-primary" />
        <h3 className="text-lg font-semibold mb-2 text-primary">
          Completed Exercises Statistics
        </h3>
        <div className="w-full h-64 overflow-x-auto">
          <ScatterChart width={1000} height={200}>
            <XAxis dataKey="Exercise.exercise_name" />
            <YAxis dataKey="Exercise.completionTime" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Scatter
              name="Completion Time"
              data={completedExerInfo}
              fill="#8884d8"
            />
          </ScatterChart>
        </div>
        <div className="flex flex-row justify-end pt-2 pb-2">
          <button
            type="button"
            onClick={toggleFormCompletedExer}
            className="flex flex-row rounded hover:shadow-lg hover:shadow-pink hover:bg-pink hover:text-white text-xl justify-center transition duration-300 ease-in-out transform hover:scale-105 px-2 py-1">
            {showFormCompletedExer ? "TAGUAN" : "IPAKITA"}
          </button>
        </div>
        {showFormCompletedExer && (
          <>
            {completedExerInfo.map((exercise, index) => (
              <div key={index} className="mt-4 overflow-y-auto">
                <p className="text-base font-semibold">
                  Exercise: {exercise.Exercise.exercise_name}
                </p>
                <p>
                  Completion Time:{" "}
                  {new Date(exercise.completionTime).toLocaleString()}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Student Profiles Statistics */}
      <div className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 px-2 py-1">
        <FiUser className="text-xl text-primary" />
        <h3 className="text-lg font-semibold mb-2 text-primary">
          Student Profiles Statistics
        </h3>
        <div className="w-full h-64 overflow-x-auto">
          <LineChart width={800} height={200} data={studentProfilesInfo}>
            <XAxis
              dataKey={(entry) =>
                entry.Student.firstname + " " + entry.Student.lastname
              }
              tick={{ fontSize: 12 }}
            />{" "}
            <YAxis dataKey="firstLoginDate" />
            <Tooltip />
            <Legend align="center" verticalAlign="top" height={36} />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="firstLoginDate"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </div>
        <div className="flex flex-row justify-end pt-2 pb-2">
          <button
            type="button"
            onClick={toggleFormProfileStat}
            className="flex flex-row rounded hover:shadow-lg hover:shadow-pink hover:bg-pink hover:text-white text-xl justify-center transition duration-300 ease-in-out transform hover:scale-105 px-2 py-1">
            {showFormProfileStat ? "TAGUAN" : "IPAKITA"}
          </button>
        </div>
        {showFormProfileStat && (
          <>
            {studentProfilesInfo.map((profile, index) => (
              <div key={index} className="mt-4 overflow-y-auto">
                <p className="text-base font-semibold">
                  Student: {profile.Student.firstname}{" "}
                  {profile.Student.lastname}
                </p>
                <p>First Login Date: {profile.firstLoginDate}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
