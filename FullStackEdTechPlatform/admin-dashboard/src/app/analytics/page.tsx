'use client';

import { useEffect, useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { AnalyticsTable } from './AnalyticsTable';
import { fetchStudentCategories } from '@/utils/api';
import { FaUserAlt, FaUserCheck, FaUserGraduate, FaUsers } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

// Define allowed category keys and student type

type CategoryKey = 'notEnrolled' | 'free' | 'paid' | 'both';
interface Student {
  _id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

const CATEGORY_CONFIG = [
  {
    key: 'all',
    label: 'Show All',
    icon: <FaUsers className="text-3xl text-blue-500" />,
    color: 'bg-blue-100',
  },
  {
    key: 'notEnrolled',
    label: 'Not Enrolled',
    icon: <FaUserAlt className="text-3xl text-gray-500" />,
    color: 'bg-gray-100',
  },
  {
    key: 'free',
    label: 'Free Enrolled',
    icon: <FaUserCheck className="text-3xl text-green-500" />,
    color: 'bg-green-100',
  },
  {
    key: 'paid',
    label: 'Paid Enrolled',
    icon: <FaUserGraduate className="text-3xl text-yellow-500" />,
    color: 'bg-yellow-100',
  },
  {
    key: 'both',
    label: 'Both Free & Paid',
    icon: <FaUsers className="text-3xl text-purple-500" />,
    color: 'bg-purple-100',
  },
] as const;

type CategoryConfigKey = typeof CATEGORY_CONFIG[number]['key'];

export default function AnalyticsPage() {
  const [data, setData] = useState<Record<CategoryKey, Student[]>>({
    notEnrolled: [],
    free: [],
    paid: [],
    both: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<CategoryConfigKey>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudentCategories()
      .then(setData)
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  // Combine all students for 'Show All'
  const allStudents = useMemo(() => {
    const ids = new Set<string>();
    return (['notEnrolled', 'free', 'paid', 'both'] as CategoryKey[])
      .flatMap((k) => data[k] || [])
      .filter((s) => {
        if (ids.has(s._id)) return false;
        ids.add(s._id);
        return true;
      });
  }, [data]);

  const students = useMemo(() => {
    let list: Student[] = [];
    if (selected === 'all') list = allStudents;
    else if (["notEnrolled", "free", "paid", "both"].includes(selected)) list = data[selected as CategoryKey] || [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selected, allStudents, data, search]);

  const chartData = {
    labels: ['Not Enrolled', 'Free Enrolled', 'Paid Enrolled', 'Both Free & Paid'],
    datasets: [
      {
        label: 'Students',
        data: [data.notEnrolled.length, data.free.length, data.paid.length, data.both.length],
        backgroundColor: [
          'rgba(156, 163, 175, 0.7)', // gray
          'rgba(34, 197, 94, 0.7)',   // green
          'rgba(253, 224, 71, 0.7)',  // yellow
          'rgba(168, 85, 247, 0.7)'   // purple
        ],
        borderColor: [
          'rgba(156, 163, 175, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(253, 224, 71, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 2,
      },
    ],
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white text-lg text-gray-500">Loading analytics...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-white text-lg text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">Student Analytics</h1>
        {/* Summary Cards */}
        <div className="flex flex-wrap gap-6 justify-center mb-10">
          {CATEGORY_CONFIG.map(cat => (
            <button
              key={cat.key}
              className={`flex flex-col items-center justify-center w-48 h-32 rounded-2xl shadow-lg border-2 transition-all duration-150 focus:outline-none ${cat.color} ${selected === cat.key ? 'border-blue-500 scale-105' : 'border-transparent hover:border-blue-300'}`}
              onClick={() => setSelected(cat.key)}
            >
              {cat.icon}
              <span className="mt-2 text-lg font-bold text-gray-800">{cat.label}</span>
              <span className="text-3xl font-extrabold text-blue-700 mt-1">
                {cat.key === 'all'
                  ? allStudents.length
                  : data[cat.key as CategoryKey]?.length ?? 0}
              </span>
            </button>
          ))}
        </div>
        {/* Chart */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <Pie data={chartData} options={{
              plugins: { legend: { position: 'bottom', labels: { color: '#222', font: { size: 16 } } } },
              responsive: true,
              maintainAspectRatio: true,
            }} />
          </div>
        </div>
        {/* Search and Table */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none text-lg bg-white"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-x-auto">
          <AnalyticsTable students={students} />
        </div>
      </div>
    </div>
  );
} 