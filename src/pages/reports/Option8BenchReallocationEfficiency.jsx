

import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners'; 
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = ['#4CAF50', '#FF9800', '#9E9E9E', '#00C49F'];

const Option8 = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null); // For displaying error messages
  const [chartType, setChartType] = useState('pie'); // 'pie' or 'bar'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No token found in sessionStorage');

        const response = await fetch('http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api/ust/dashboard/options/8', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        });

        const contentType = response.headers.get("content-type");
        const isJson = contentType && contentType.includes("application/json");
        const result = isJson ? await response.json() : await response.text();

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${JSON.stringify(result)}`);
        }

        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const getChartData = () => {
    if (!data?.data) return [];
    return data.data.map(item => ({
      range: item.range,
      count: item.count
    }));
  };

  const chartData = getChartData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Bench Reallocation Efficiency</h1>

      {error && <div className="text-red-500 my-2">{`Error: ${error}`}</div>}

      {/* Toggle Button */}
      <div className="mb-4">
        <button
          onClick={() => setChartType(chartType === 'pie' ? 'bar' : 'pie')}
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-600"
        >
          Toggle to {chartType === 'pie' ? 'Bar' : 'Pie'} Chart
        </button>
      </div>

      {data ? (
        <>
          <div className="text-sm text-gray-600 mb-2">
            <p><span className="font-bold">Total Data:</span> {data.data.length} Data Points</p>
          </div>

          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis
                    dataKey="range"
                    type="category"
                    width={200} // Adjust the width for Y-axis to fit labels
                    tick={{ angle: -45, textAnchor: 'end' }} // Rotate tick labels
                  />
                  <XAxis type="number" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </>
      ) : !error ? (
        <div className="flex justify-center items-center">
          <ClipLoader size={40} color={"#3498db"} loading={true} />
          <p className="ml-4">Loading data...</p>
        </div>
      ) : null}
    </div>
  );
};

export default Option8;
