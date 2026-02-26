import React from 'react';

export default function ComparisonTable({ schoolTor, ocrResults }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* School TOR */}
      <div>
        <h3 className="font-semibold mb-2 text-center bg-lifewood-seaSalt py-2 rounded">
          School TOR
        </h3>
        <div className="border border-gray-300 rounded max-h-[480px] overflow-y-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="p-2 border">Subject Code</th>
                <th className="p-2 border">Prerequisites</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Units</th>
              </tr>
            </thead>
            <tbody>
              {schoolTor.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">{row.subject_code}</td>
                  <td className="p-2 border">
                    {Array.isArray(row.prerequisite)
                      ? row.prerequisite.join(', ')
                      : row.prerequisite || ''}
                  </td>
                  <td className="p-2 border">
                    {Array.isArray(row.description)
                      ? row.description.join(', ')
                      : row.description || ''}
                  </td>
                  <td className="p-2 border">{row.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OCR Results */}
      <div>
        <h3 className="font-semibold mb-2 text-center bg-green-50 py-2 rounded">
          OCR Results
        </h3>
        <div className="border border-gray-300 rounded max-h-[480px] overflow-y-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="p-2 border">Subject Code</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Prerequisites</th>
                <th className="p-2 border">Units</th>
                <th className="p-2 border">Final Grade</th>
                <th className="p-2 border">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {ocrResults.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">{row.subject_code}</td>
                  <td className="p-2 border">{row.subject_description}</td>
                  <td className="p-2 border">{row.pre_requisite}</td>
                  <td className="p-2 border">{row.total_academic_units}</td>
                  <td className="p-2 border">{row.final_grade}</td>
                  <td className="p-2 border">{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

