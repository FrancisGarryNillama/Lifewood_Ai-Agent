import React, { useState, useEffect } from 'react';
import { trackingApi } from '../../../api';
import { Modal, ModalContent, Loader } from '../../../components/common';

export default function TrackerModal({ isOpen, onClose, userName }) {
  const [trackerData, setTrackerData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !userName) return;

    const fetchTrackerData = async () => {
      setLoading(true);
      try {
        const data = await trackingApi.getTrackerExpenseProcessing(userName);
        setTrackerData(data);
      } catch (err) {
        console.error('Error fetching tracker data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackerData();
  }, [isOpen, userName]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tracker expense processing"
      size="lg"
    >
      <ModalContent>
        {loading ? (
          <Loader text="Loading tracker data..." />
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-lifewood-seaSalt">
              <tr>
                <th className="border px-3 py-2 text-left">Account ID</th>
                <th className="border px-3 py-2 text-left">Subject Code</th>
                <th className="border px-3 py-2 text-left">Description</th>
                <th className="border px-3 py-2 text-left">Credit Evaluation</th>
              </tr>
            </thead>
            <tbody>
              {trackerData.length > 0 ? (
                trackerData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{item.account_id}</td>
                    <td className="border px-3 py-2">{item.subject_code}</td>
                    <td className="border px-3 py-2">
                      {item.subject_description}
                    </td>
                    <td
                      className={`border px-3 py-2 font-medium ${
                        item.credit_evaluation === 'Accepted'
                          ? 'text-lifewood-castletonGreen'
                          : item.credit_evaluation === 'Denied'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {item.credit_evaluation}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-gray-500">
                    No tracker data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </ModalContent>
    </Modal>
  );
}

