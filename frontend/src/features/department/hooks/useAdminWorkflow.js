// frontend/src/features/department/hooks/useAdminWorkflow.js
import { useState, useCallback } from 'react';
import { requestApi } from '../../../api';
import { useNotification } from '../../../hooks';

/**
 * Admin workflow hook for expense request processing.
 */
export function useAdminWorkflow() {
  const [requests, setRequests] = useState([]);
  const [applications, setApplications] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  /**
   * Fetch all data from three workflow stages.
   */
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [requestsData, applicationsData, acceptedData] = await Promise.all([
        requestApi.getRequestTorList(),
        requestApi.getPendingRequests(),
        requestApi.getFinalDocuments(),
      ]);

      setRequests(requestsData.data || []);
      setApplications(applicationsData.data || []);
      setAccepted(acceptedData.data || []);
    } catch (error) {
      showError(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  /**
   * Accept request (request queue -> pending queue).
   */
  const acceptRequest = useCallback(async (accountId) => {
    try {
      const data = await requestApi.acceptRequest(accountId);

      showSuccess(data.message || 'Request accepted successfully');
      await fetchAllData(); // Refresh all data
      return true;
    } catch (error) {
      showError(error.message || 'Failed to accept request');
      return false;
    }
  }, [fetchAllData, showSuccess, showError]);

  /**
   * Deny request and remove related queued records.
   */
  const denyRequest = useCallback(async (accountId) => {
    try {
      const data = await requestApi.denyRequest(accountId);

      const totalDeleted = Object.values(data).reduce((sum, count) => sum + count, 0);
      showSuccess(`Request denied. Removed ${totalDeleted} record(s).`);
      await fetchAllData(); // Refresh all data
      return true;
    } catch (error) {
      showError(error.message || 'Failed to deny request');
      return false;
    }
  }, [fetchAllData, showSuccess, showError]);

  /**
   * Finalize request (pending queue -> finalized queue).
   */
  const finalizeRequest = useCallback(async (accountId) => {
    try {
      const data = await requestApi.finalizeRequest(accountId);

      showSuccess(data.message || 'Request finalized successfully');
      await fetchAllData(); // Refresh all data
      return true;
    } catch (error) {
      showError(error.message || 'Failed to finalize request');
      return false;
    }
  }, [fetchAllData, showSuccess, showError]);

  /**
   * Update status in PendingRequest
   */
  const updateStatus = useCallback(async (accountId, status) => {
    try {
      const data = await requestApi.updateRequestStatus(accountId, status);

      showSuccess(data.message || `Status updated to "${status}"`);
      await fetchAllData(); // Refresh all data
      return true;
    } catch (error) {
      showError(error.message || 'Failed to update status');
      return false;
    }
  }, [fetchAllData, showSuccess, showError]);

  return {
    // State
    requests,
    applications,
    accepted,
    loading,

    // Methods
    fetchAllData,
    acceptRequest,
    denyRequest,
    finalizeRequest,
    updateStatus,
  };
}

