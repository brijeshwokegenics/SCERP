'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function EarningsChart() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Total Earning',
        data: [75000, 82000, 92000, 88000, 100000, 110000, 120000],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: true,
      },
      {
        label: 'Total Due',
        data: [105000, 100000, 32000, 19000, 25000, 27000, 10000],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-md col-span-2">
      <h3 className="text-gray-600 text-lg font-semibold mb-4">Earnings</h3>
      <Line data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
    </div>
  );
}
