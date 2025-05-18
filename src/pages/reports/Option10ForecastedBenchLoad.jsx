import React, { useEffect, useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import jsPDF from 'jspdf';
import { ClipLoader } from 'react-spinners'; 
import autoTable from 'jspdf-autotable'; // ✅ Correctly imported

const Option10 = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No token found in sessionStorage');

        const response = await fetch('http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api/ust/dashboard/options/10', {
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
        const forecastData = calculateForecast(result.data);
        setForecast(forecastData);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const calculateForecast = (employeeData) => {
    const forecastMap = {};

    employeeData.forEach(({ projectEndDate, employeeName }) => {
      const date = new Date(projectEndDate).toISOString().slice(0, 10);
      if (!forecastMap[date]) {
        forecastMap[date] = [];
      }
      forecastMap[date].push(employeeName);
    });

    return Object.entries(forecastMap)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, names]) => ({
        date,
        benchLoad: names.length,
        employees: names,
      }));
  };

  const exportToCSV = () => {
    if (!forecast?.length) return;

    const headers = ["Date", "Bench Load", "Employee Names"];
    const rows = forecast.map(item => [
      item.date,
      item.benchLoad,
      item.employees.join(", "),
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "forecasted_bench_load.csv");
    link.click();
  };

  const exportToPDF = () => {
    if (!forecast?.length) return;

    const doc = new jsPDF();
    doc.text("Forecasted Bench Load", 14, 10);

    const rows = forecast.map(item => [
      item.date,
      item.benchLoad,
      item.employees.join('\n'),
    ]);

    autoTable(doc, {
      head: [["Date", "Bench Load", "Employee Names"]],
      body: rows,
      startY: 20,
    });

    doc.save("forecasted_bench_load.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-700">Forecasted Bench Load</h1>

      {error && <div className="text-red-500 my-2">Error: {error}</div>}

      {forecast && (
        <div className="mb-4 flex gap-2 items-center">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      )}

      {forecast ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-amber-600 text-white">
              <tr>
                <th className="py-2 px-4 border border-gray-300 text-left">Date</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Bench Load</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Employee Names</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border border-gray-300">{item.date}</td>
                  <td className="px-4 py-3 border border-gray-300">{item.benchLoad}</td>
                  <td className="px-4 py-3 border border-gray-300">
                    <ul className="list-disc list-inside">
                      {item.employees.map((name, i) => (
                        <li key={i}>{name}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !error ? (
        <div className="flex justify-center items-center">
          <ClipLoader size={40} color={"#3498db"} loading={true} />
          <p className="ml-4">Loading data...</p>
        </div>
      ) : null}
    </div>
  );
};

export default Option10;
