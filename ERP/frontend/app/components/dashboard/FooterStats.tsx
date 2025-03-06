'use client';

export default function FooterStats() {
    const stats = [
      { label: 'Facebook', value: '30,000' },
      { label: 'Twitter', value: '1,11,000' },
      { label: 'Google+', value: '19,000' },
      { label: 'LinkedIn', value: '45,000' },
    ];
  
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-blue-100 text-center p-4 rounded-md">
            <h4 className="text-sm text-gray-600">{stat.label}</h4>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    );
  }
  