import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F"];
const GENDER_LABELS = ["Female", "Male"];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartGender = ({ studentData }) => {
  const maleCount = studentData.filter(
    (student) => student.gender === "Male"
  ).length;
  const femaleCount = studentData.filter(
    (student) => student.gender === "Female"
  ).length;

  const data = [
    { name: "FEMALE", value: femaleCount },
    { name: "MALE", value: maleCount },
  ];

  return (
    <div className="mb-5 p-4 border rounded border-black bg-white bg-opacity-60 ">
      <h2 className="text-base font-semibold mb-2">
        All Students Male to Female Ratio
      </h2>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-4">
        <div className="flex justify-center items-center space-x-2">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center">
              <div
                className="w-4 h-4"
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                }}></div>
              <span className="ml-2">{GENDER_LABELS[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartGender;
