
import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners'; 
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA6EFB', '#F77070', '#70F7DB', '#EF6BF7'];

const Option5 = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'pie'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No token found in sessionStorage');

        const response = await fetch('http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api/ust/dashboard/options/5', {
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

        const transformedData = result?.data?.map(item => ({
          skill: item.skillSet,
          count: item._count._all
        })) || [];

        setData(transformedData);
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Skill-wise Bench Report</h1>

      {error && (
        <div className="text-red-500 my-2">
          Error: {error}
        </div>
      )}

      {/* Toggle Button */}
      <div className="mb-4">
        <button
          onClick={() => setChartType(chartType === 'bar' ? 'pie' : 'bar')}
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          Toggle to {chartType === 'bar' ? 'Pie' : 'Bar'} Chart
        </button>
      </div>

      {data.length > 0 ? (
        <>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              {chartType === 'bar' ? (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="skill"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Custom Legend only for Pie */}
          {chartType === 'pie' && (
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {data.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-700">{entry.skill}</span>
                </div>
              ))}
            </div>
          )}
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

export default Option5;
