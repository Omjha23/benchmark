


import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ClipLoader } from 'react-spinners'; 

const Option3 = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No token found in sessionStorage');

        const response = await fetch('http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api/ust/dashboard/options/3', {
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

  // CSV download
  const downloadCSV = () => {
    if (!data) return;

    const headers = [
      "Employee Name",
      "Employee ID",
      "Skill Set",
      "Status",
      "Bench Start Date",
      "Days on Bench"
    ];

    const rows = data.map(emp => [
      emp.employeeName,
      emp.employeeId,
      emp.skillSet,
      emp.status,
      emp.benchStartDate || '',
      emp.daysOnBench ?? 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(item => `"${item}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bench_summary_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF download
  const downloadPDF = () => {
    if (!data) return;

    const doc = new jsPDF();

    const headers = [["Employee Name", "Employee ID", "Skill Set", "Status", "Bench Start Date", "Days on Bench"]];
    const rows = data.map(emp => [
      emp.employeeName,
      emp.employeeId,
      emp.skillSet,
      emp.status,
      emp.benchStartDate || '',
      emp.daysOnBench ?? 'N/A'
    ]);

    doc.text("Bench Summary Report", 14, 15);
    doc.autoTable({
      startY: 20,
      head: headers,
      body: rows,
      styles: { fontSize: 8 },
      theme: 'grid',
    });

    doc.save("bench_summary_report.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Bench Summary Report</h1>

      {error && <div className="text-red-500 my-2">Error: {error}</div>}

      {data && (
        <>
          <div className="flex gap-4 mb-4">
            <button
              onClick={downloadCSV}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
            >
              Download CSV
            </button>
            <button
              onClick={downloadPDF}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
            >
              Download PDF
            </button>
          </div>

          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-amber-600 text-white">
              <tr>
                <th className="py-2 px-4 border border-gray-300">Employee Name</th>
                <th className="py-2 px-4 border border-gray-300">Employee ID</th>
                <th className="py-2 px-4 border border-gray-300">Skill Set</th>
                <th className="py-2 px-4 border border-gray-300">Status</th>
                <th className="py-2 px-4 border border-gray-300">Bench Start Date</th>
                <th className="py-2 px-4 border border-gray-300">Days on Bench</th>
              </tr>
            </thead>
            <tbody>
              {data.map((emp, idx) => (
                <tr key={emp.employeeId} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.employeeName}</td>
                  <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.employeeId}</td>
                  <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.skillSet}</td>
                  <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.status}</td>
                  <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.benchStartDate || ''}</td>
                  <td className="py-2 px-4 border border-gray-300 text-gray-700">{emp.daysOnBench ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!data && !error && <div className="flex justify-center items-center">
          <ClipLoader size={40} color={"#3498db"} loading={true} />
          <p className="ml-4">Loading data...</p>
        </div>}
    </div>
  );
};

export default Option3;
