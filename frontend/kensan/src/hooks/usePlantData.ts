import { useState, useEffect } from 'react';
import axios from 'axios';

export interface PlantData {
  ovenRunning: boolean;
  ovenStatus: string;
  craneRunning: boolean;
  cranePosition: string;
  craneMove: boolean;
  warehouseRunning: boolean;
  warehouseLocationX: number;
  warehouseLocationY: number;
  warehousePickup: boolean;
  warehouseStore: boolean;
  warehouseStock: number;
  conveyerRunning: boolean;
}

const API_URL = 'http://localhost:3001';
const TESTDATA_URL = '/testdata.json'; // Load testdata.json dynamically
const POLL_INTERVAL = 5000; // 5 seconds

// Default fallback data
const DEFAULT_DATA: PlantData = {
  ovenRunning: true,
  ovenStatus: 'idle',
  craneRunning: false,
  cranePosition: 'unknown',
  craneMove: true,
  warehouseRunning: true,
  warehouseLocationX: 0,
  warehouseLocationY: 0,
  warehousePickup: true,
  warehouseStore: true,
  warehouseStock: 0,
  conveyerRunning: true,
};

export const usePlantData = () => {
  const [data, setData] = useState<PlantData>(DEFAULT_DATA);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState<number>(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, try to fetch from the API
        const response = await axios.get(`${API_URL}/api/all`, {
          timeout: 3000, // 3 second timeout
        });
        
        setData(response.data);
        setIsOnline(true);
        setError(null);
        setTimeUntilRefresh(5); // Reset timer after successful fetch
      } catch (err: any) {
        // If API fails, try to load testdata.json dynamically
        try {
          const testDataResponse = await axios.get(TESTDATA_URL, {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Expires': '0',
            },
          });
          setData(testDataResponse.data);
          setIsOnline(false);
          setError('Using test data - API not available');
          console.warn('Using test data - API not available:', err.message);
        } catch (testErr: any) {
          // If both fail, use default data
          setData(DEFAULT_DATA);
          setIsOnline(false);
          setError('Failed to load data');
          console.error('Failed to load test data:', testErr.message);
        }
        setTimeUntilRefresh(5); // Reset timer after fetch attempt
      }
    };

    // Fetch immediately on mount
    fetchData();

    // Set up polling interval
    const interval = setInterval(fetchData, POLL_INTERVAL);

    // Set up countdown timer (updates every second)
    const countdownInterval = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev <= 1) {
          return 5; // Reset to 5 when it reaches 0
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, []);

  return { data, isOnline, error, timeUntilRefresh };
};
