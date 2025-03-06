'use client';

export default function HeaderStats() {
    const stats = [
      { label: 'Students', value: '150,000' },
      { label: 'Teachers', value: '2,250' },
      { label: 'Parents', value: '5,690' },
      { label: 'Earnings', value: '$193,000' },
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white shadow-md p-4 rounded-md">
            <h2 className="text-gray-600 text-sm">{stat.label}</h2>
            <p className="text-2xl text-blue-300 font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    );
  }
  