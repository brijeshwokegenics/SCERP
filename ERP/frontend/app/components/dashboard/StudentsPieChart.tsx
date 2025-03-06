'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function StudentsPieChart() {
  const data = {
    labels: ['Female Students', 'Male Students'],
    datasets: [
      {
        data: [45000, 105000],
        backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 206, 86, 0.5)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)'],
      },
    ],
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <h3 className="text-gray-600 text-lg font-semibold mb-4">Students</h3>
      <Doughnut data={data} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
    </div>
  );
}
