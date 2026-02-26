import React from 'react';

export default function SummaryView({ data }) {
  
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        No summary data available.
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-2 text-center bg-lifewood-paper py-2 rounded">
        Summary Result
      </h3>
      <div className="border border-gray-300 rounded max-h-[480px] overflow-y-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="p-2 border">Subject Code</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Units</th>
              <th className="p-2 border">Final Grade</th>
              <th className="p-2 border">Remark</th>
              <th className="p-2 border">Credit Evaluation</th>
              <th className="p-2 border">Summary</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-2 border">{row.subject_code}</td>
                <td className="p-2 border">{row.subject_description}</td>
                <td className="p-2 border">{row.total_academic_units}</td>
                <td className="p-2 border">{row.final_grade}</td>
                <td className="p-2 border">{row.remarks}</td>
                <td className="p-2 border whitespace-pre-line">{row.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

