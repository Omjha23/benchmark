

import React, { useEffect, useState } from 'react';
import { FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClipLoader } from 'react-spinners'; 

const Option2 = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedWindow, setSelectedWindow] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('No token found in sessionStorage');
        }

        const response = await fetch('http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api/ust/dashboard/options/2', {
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

        if (result && result.data && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          throw new Error('Fetched data is not in the expected format');
        }
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const filterByWindow = (emp) => {
    if (selectedWindow === "All") return true;
    const days = emp.daysUntilEnd;

    if (selectedWindow === "Beyond 60 Days") return days > 60;
    if (selectedWindow === "Between 31-60 Days") return days >= 31 && days <= 60;
    if (selectedWindow === "Within 30 Days") return days <= 30;

    return true;
  };

  const filteredData = data?.filter(filterByWindow);

  const exportToCSV = () => {
    const csvRows = [
      ['Employee Name', 'Employee ID', 'Project Name', 'Days Until End', 'Roll-off Window'],
      ...filteredData.map(emp => [
        emp.employeeName,
        emp.employeeId,
        emp.projectName || 'N/A',
        emp.daysUntilEnd,
        emp.rolloffWindow
      ])
    ];

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'rolloff_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Upcoming Roll-off Report', 14, 16);
    autoTable(doc, {
      head: [['Employee Name', 'Employee ID', 'Project Name', 'Days Until End', 'Roll-off Window']],
      body: filteredData.map(emp => [
        emp.employeeName,
        emp.employeeId,
        emp.projectName || 'N/A',
        emp.daysUntilEnd,
        emp.rolloffWindow
      ]),
      startY: 20,
      styles: { fontSize: 10 },
    });
    doc.save('rolloff_report.pdf');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Upcoming Roll-off Report</h1>

      {error && <div className="text-red-500 my-2">Error: {error}</div>}

      {/* Filter Dropdown & Buttons */}
      {data && (
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="rolloffFilter" className="text-gray-700 font-semibold flex items-center gap-1">
              Filter by Roll-off Window:
              <FunnelIcon className="h-4 w-4 text-gray-600" />
            </label>
            <select
              id="rolloffFilter"
              value={selectedWindow}
              onChange={(e) => setSelectedWindow(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="All">All</option>
              <option value="Beyond 60 Days">Beyond 60 Days</option>
              <option value="Between 31-60 Days">Between 31-60 Days</option>
              <option value="Within 30 Days">Within 30 Days</option>
            </select>
          </div>

          {/* Export Buttons */}
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

      {/* Data Table */}
      {data ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-amber-600 text-white">
              <tr>
                <th className="py-2 px-4 border border-gray-300">Employee Name</th>
                <th className="py-2 px-4 border border-gray-300">Employee ID</th>
                <th className="py-2 px-4 border border-gray-300">Project Name</th>
                <th className="py-2 px-4 border border-gray-300">Days Until End</th>
                <th className="py-2 px-4 border border-gray-300">Roll-off Window</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((emp, idx) => (
                  <tr key={emp.employeeId} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.employeeName}</td>
                    <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.employeeId}</td>
                    <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.projectName || 'N/A'}</td>
                    <td className="py-2 px-4 border border-gray-300 text-gray-600">{emp.daysUntilEnd}</td>
                    <td className="py-2 px-4 border border-gray-300 text-gray-600">{emp.rolloffWindow}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No data for selected filter.
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

export default Option2;
