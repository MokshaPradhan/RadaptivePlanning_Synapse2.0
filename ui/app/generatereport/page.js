import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ReportPage = () => {
  const router = useRouter();
  const { lat, lng } = router.query; // Extract lat and lng directly from the URL query parameters

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    if (!lat || !lng) {
      setError('Latitude and longitude are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const solarApi = `https://api.solar-example.com/data?lat=${lat}&lng=${lng}`;
      const windApi = `https://api.wind-example.com/data?lat=${lat}&lng=${lng}`;
      const airQualityApi = `https://api.airquality-example.com/data?lat=${lat}&lng=${lng}`;
      const weatherApi = `https://api.weather-example.com/data?lat=${lat}&lng=${lng}`;

      const responses = await Promise.all([
        axios.get(solarApi),
        axios.get(windApi),
        axios.get(airQualityApi),
        axios.get(weatherApi)
      ]);

      setReportData({
        solar: responses[0].data,
        wind: responses[1].data,
        airQuality: responses[2].data,
        weather: responses[3].data
      });
    } catch (err) {
      setError('Failed to fetch data. Please check the console for more details.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Environmental Report</h1>
      <button onClick={handleGenerateReport} disabled={loading || !lat || !lng}>
        {loading ? 'Loading...' : 'Generate Report'}
      </button>
      {error && <p>Error: {error}</p>}
      {reportData && (
        <div>
          <h2>Report Details</h2>
          <div>
            <h3>Solar Data:</h3>
            <pre>{JSON.stringify(reportData.solar, null, 2)}</pre>
          </div>
          <div>
            <h3>Wind Data:</h3>
            <pre>{JSON.stringify(reportData.wind, null, 2)}</pre>
          </div>
          <div>
            <h3>Air Quality Data:</h3>
            <pre>{JSON.stringify(reportData.airQuality, null, 2)}</pre>
          </div>
          <div>
            <h3>Weather Data:</h3>
            <pre>{JSON.stringify(reportData.weather, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
