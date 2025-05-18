


import React, { useEffect, useState } from 'react';
import { FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import jsPDF from 'jspdf';
import { ClipLoader } from 'react-spinners'; 
import 'jspdf-autotable';

const Option1 = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No token found in sessionStorage');

        const response = await fetch('http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api/ust/dashboard/options/1', {
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

        let loadedData = Array.isArray(result) ? result : result.data;
        if (!Array.isArray(loadedData)) {
          throw new Error("Fetched data is not in the expected format.");
        }

        setData(loadedData);
        setFilteredData(loadedData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);

    if (value === "All") {
      setFilteredData(data);
    } else {
      const filterValue = parseFloat(value) / 100;
      setFilteredData(data.filter(emp => parseFloat(emp.billabilityStatus) === filterValue));
    }
  };

  const exportToCSV = () => {
    if (!filteredData || filteredData.length === 0) return;

    const headers = [
      "Employee Name", "Employee ID", "Project Name", "Start Date", "End Date", "Status", "Billability"
    ];
    const rows = filteredData.map(emp => [
      emp.employeeName,
      emp.employeeId,
      emp.projectName,
      new Date(emp.projectStartDate).toLocaleDateString(),
      new Date(emp.projectEndDate).toLocaleDateString(),
      emp.status,
      (parseFloat(emp.billabilityStatus) * 100).toFixed(0) + "%"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", "billability_report.csv");
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Current Billability Report", 14, 10);
    const rows = filteredData.map(emp => [
      emp.employeeName,
      emp.employeeId,
      emp.projectName,
      new Date(emp.projectStartDate).toLocaleDateString(),
      new Date(emp.projectEndDate).toLocaleDateString(),
      emp.status,
      (parseFloat(emp.billabilityStatus) * 100).toFixed(0) + "%"
    ]);

    doc.autoTable({
      head: [["Employee Name", "Employee ID", "Project Name", "Start Date", "End Date", "Status", "Billability"]],
      body: rows,
      startY: 20,
    });

    doc.save("billability_report.pdf");
  };

  const renderTable = (dataToRender) => {
    if (!Array.isArray(dataToRender)) {
      return <div>Error: Invalid data format</div>;
    }

    return (
      <div className="overflow-x-auto p-4">
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-amber-600 text-white">
            <tr>
              <th className="py-2 px-4 border border-gray-300">Employee Name</th>
              <th className="py-2 px-4 border border-gray-300">Employee ID</th>
              <th className="py-2 px-4 border border-gray-300">Project Name</th>
              <th className="py-2 px-4 border border-gray-300">Start Date</th>
              <th className="py-2 px-4 border border-gray-300">End Date</th>
              <th className="py-2 px-4 border border-gray-300">Status</th>
              <th className="py-2 px-4 border border-gray-300">Billability</th>
            </tr>
          </thead>
          <tbody>
            {dataToRender.map((emp, idx) => (
              <tr key={emp.employeeId} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.employeeName}</td>
                <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.employeeId}</td>
                <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.projectName}</td>
                <td className="py-2 px-4 border border-gray-300 text-gray-600">
                  {new Date(emp.projectStartDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border border-gray-300 text-gray-600">
                  {new Date(emp.projectEndDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border border-gray-300 text-green-700 font-semibold">{emp.status}</td>
                <td
                  className={`py-2 px-4 border border-gray-300 font-bold ${
                    emp.billabilityStatus === "1"
                      ? "text-green-600"
                      : emp.billabilityStatus >= 0.75
                      ? "text-amber-600"
                      : "text-red-500"
                  }`}
                >
                  {(parseFloat(emp.billabilityStatus) * 100).toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Current Billability Report</h1>

      {error && <div className="text-red-500 my-2">Error: {error}</div>}

      {data && (
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-gray-700 font-semibold flex items-center gap-1">
              Filter Billability:
              <FunnelIcon className="h-4 w-4 text-gray-600" />
            </label>
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="All">All</option>
              <option value="100">100%</option>
              <option value="75">75%</option>
              <option value="50">50%</option>
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

      {filteredData ? renderTable(filteredData) : !error ? <div className="flex justify-center items-center">
          <ClipLoader size={40} color={"#3498db"} loading={true} />
          <p className="ml-4">Loading data...</p>
        </div> : null}
    </div>
  );
};

export default Option1;
