
import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners'; 
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#4CAF50', '#FF9800', '#9E9E9E'];

const Option6 = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('pie');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No token found in sessionStorage');

        const response = await fetch('http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api/ust/dashboard/options/6', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        });

        const isJson = response.headers.get("content-type")?.includes("application/json");
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
    const { totalEmployees, billable, Onbench } = data.data;
    const others = totalEmployees - (billable + Onbench);

    return [
      { name: 'Billable', value: billable },
      { name: 'On Bench', value: Onbench },
      { name: 'Others', value: others }
    ];
  };

  const chartData = getChartData();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Utilization Report</h1>

      {error && <div className="text-red-500 mb-2 text-sm">Error: {error}</div>}

      <button
        onClick={() => setChartType(chartType === 'pie' ? 'bar' : 'pie')}
        className="mb-3 bg-amber-600 text-white text-sm px-3 py-1.5 rounded hover:bg-indigo-700"
      >
        Toggle to {chartType === 'pie' ? 'Bar' : 'Pie'} Chart
      </button>

      {data ? (
        <>
          <div className="text-sm text-gray-600 mb-2 font-bold">
            <p>Total Employees: {data.data.totalEmployees}</p>
            <p>Billable: {data.data.billable} ({data.data.utilizationRateBillable})</p>
            <p>On Bench: {data.data.Onbench} ({data.data.utilizationRateOnBench})</p>
          </div>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
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
                </PieChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
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

export default Option6;
