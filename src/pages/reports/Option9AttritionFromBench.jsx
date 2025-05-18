


import React, { useEffect, useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ClipLoader } from 'react-spinners'; 

const Option9 = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('No token found in sessionStorage');
        }

        const response = await fetch('http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api/ust/dashboard/options/9', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
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

  const exportToCSV = () => {
    if (!data || !data.data?.length) return;

    const headers = ["Employee ID", "Employee Name", "Bench Start Date", "Status"];
    const rows = data.data.map(item => [
      item.employeeId,
      item.employeeName,
      new Date(item.benchStartDate).toLocaleDateString(),
      item.status,
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "attrition_from_bench_report.csv");
    link.click();
  };

  const exportToPDF = () => {
    if (!data || !data.data?.length) return;

    const doc = new jsPDF();
    doc.text("Attrition from Bench Report", 14, 10);
    const rows = data.data.map(item => [
      item.employeeId,
      item.employeeName,
      new Date(item.benchStartDate).toLocaleDateString(),
      item.status,
    ]);

    doc.autoTable({
      head: [["Employee ID", "Employee Name", "Bench Start Date", "Status"]],
      body: rows,
      startY: 20,
    });

    doc.save("attrition_from_bench_report.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Attrition from Bench Report</h1>

      {error && <div className="text-red-500 my-2">{`Error: ${error}`}</div>}

      {data && (
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

      {data ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-amber-600 text-white">
              <tr>
                <th className="py-2 px-4 border border-gray-300">Employee ID</th>
                <th className="py-2 px-4 border border-gray-300">Employee Name</th>
                <th className="py-2 px-4 border border-gray-300">Bench Start Date</th>
                <th className="py-2 px-4 border border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-2 px-4 border border-gray-300 text-gray-700">{item.employeeId}</td>
                  <td className="py-2 px-4 border border-gray-300 text-gray-700">{item.employeeName}</td>
                  <td className="py-2 px-4 border border-gray-300 text-gray-600">
                    {new Date(item.benchStartDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border border-gray-300 text-green-700 font-semibold">{item.status}</td>
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

export default Option9;
