// frontend/src/features/department/components/ExpenseComparison.jsx
import React, { useState, useEffect } from 'react';
import { expenseApi } from '../../../api';
import { useNotification } from '../../../hooks';
import SummaryView from '../../expenseProcessing/components/Results/SummaryView';
import { Loader } from '../../../components/common';

export default function ExpenseComparison({ accountId }) {
  const [expenseItems, setExpenseItems] = useState([]);
  const [referenceItems, setReferenceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  useEffect(() => {
    if (accountId) {
      fetchExpenseData();
    }
  }, [accountId]);

  const fetchExpenseData = async () => {
    setLoading(true);
    try {
      // Fetch employee processed expense data
      const employeeData = await expenseApi.getCompareResultTor(accountId);
      setExpenseItems(employeeData || []);
      
      // Fetch reference expense mapping data
      const referenceData = await expenseApi.getCitTorContent();
      setReferenceItems(referenceData || []);
    } catch (error) {
      console.error('Failed to fetch expense data:', error);
      showError('Failed to load expense data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader />
        <span className="ml-2">Loading expense data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reference Expense Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Reference Expense Items</h3>
        {referenceItems.length > 0 ? (
          <div className="border border-gray-300 rounded max-h-[400px] overflow-y-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-3 border text-left">Subject Code</th>
                  <th className="p-3 border text-left">Units</th>
                  <th className="p-3 border text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {referenceItems.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 border">{row.subject_code}</td>
                    <td className="p-3 border">{row.units || row.total_academic_units}</td>
                    <td className="p-3 border">{row.subject_description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No reference expense data available</p>
        )}
      </div>

      {/* Employee Expense Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Employee Expense Items</h3>
        {expenseItems.length > 0 ? (
          <SummaryView data={expenseItems} />
        ) : (
          <div className="border border-gray-300 rounded p-8 text-center">
            <p className="text-gray-500 italic">No expense entries found.</p>
            <p className="text-sm text-gray-400 mt-2">
              The employee may not have completed expense processing yet.
            </p>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchExpenseData}
          className="px-4 py-2 bg-lifewood-castletonGreen text-white rounded hover:bg-lifewood-darkSerpent transition-colors"
        >
          Refresh Expense Data
        </button>
      </div>
    </div>
  );
}

