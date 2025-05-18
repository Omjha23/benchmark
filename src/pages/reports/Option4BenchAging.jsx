

import React, { useEffect, useState } from 'react';
import { FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ClipLoader } from 'react-spinners'; 

const Option4 = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedRange, setSelectedRange] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No token found in sessionStorage');

        const response = await fetch('http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api/ust/dashboard/options/4', {
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

        if (result && result.data && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          throw new Error('Fetched data is not in the expected format');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const filteredData = data?.filter(emp => {
    if (selectedRange === "All") return true;
    return emp.range === selectedRange;
  });

  const exportToCSV = () => {
    if (!filteredData || filteredData.length === 0) return;

    const headers = ["Employee Name", "Range"];
    const rows = filteredData.map(emp => [emp.employeeName, emp.range]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", "bench_aging_report.csv");
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Bench Aging Report", 14, 10);
    const rows = filteredData.map(emp => [emp.employeeName, emp.range]);

    doc.autoTable({
      head: [["Employee Name", "Range"]],
      body: rows,
      startY: 20,
    });

    doc.save("bench_aging_report.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Bench Aging Report</h1>

      {error && (
        <div className="text-red-500 my-2">
          Error: {error}
        </div>
      )}

      {data && (
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="rangeFilter" className="text-gray-700 font-semibold flex items-center gap-1">
              Filter by Range:
              <FunnelIcon className="h-4 w-4 text-gray-600" />
            </label>
            <select
              id="rangeFilter"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="border border-gray-300 rounded p-2 text-sm"
            >
              <option value="All">All</option>
              <option value=">60 days">&gt;60 days</option>
              <option value="31-60 days">31-60 days</option>
              <option value="0-30 days">0-30 days</option>
            </select>
          </div>

          <div className="flex gap-2">
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
        </div>
      )}

      {data ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-amber-600 text-white">
              <tr>
                <th className="py-2 px-4 border border-gray-300">Employee Name</th>
                <th className="py-2 px-4 border border-gray-300">Range</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((emp, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.employeeName}</td>
                    <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.range}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-500">
                    No data for selected range.
                  </td>
                </tr>
              )}
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

export default Option4;
