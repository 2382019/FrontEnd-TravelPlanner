import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { budgetAPI, packingAPI, itineraryAPI, culinaryAPI } from '../utils/api';

export function Dashboard() {
  const { data: budgetsResponse } = useQuery({
    queryKey: ['budgets'],
    queryFn: budgetAPI.getAll,
  });

  const { data: packingResponse } = useQuery({
    queryKey: ['packing-items'],
    queryFn: packingAPI.getAll,
  });

  const { data: itinerariesResponse } = useQuery({
    queryKey: ['itineraries'],
    queryFn: itineraryAPI.getAll,
  });

  const { data: culinaryResponse } = useQuery({
    queryKey: ['culinary-items'],
    queryFn: culinaryAPI.getAll,
  });

  const budgets = budgetsResponse?.data || [];
  const packingItems = packingResponse?.data || [];
  const itineraries = itinerariesResponse?.data || [];
  const culinaryItems = culinaryResponse?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Welcome to your travel planning dashboard</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Budget Summary */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                  <svg
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Budget Items</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{budgets.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 px-6 py-4">
              <div className="text-sm">
                <Link
                  to="/budget"
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                >
                  View all budget items →
                </Link>
              </div>
            </div>
          </div>

          {/* Packing List Summary */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                  <svg
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Packing Items</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{packingItems.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 px-6 py-4">
              <div className="text-sm">
                <Link
                  to="/packing"
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                >
                  View all packing items →
                </Link>
              </div>
            </div>
          </div>

          {/* Itinerary Summary */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                  <svg
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Itinerary Items</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{itineraries.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 px-6 py-4">
              <div className="text-sm">
                <Link
                  to="/itinerary"
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                >
                  View all itinerary items →
                </Link>
              </div>
            </div>
          </div>

          {/* Culinary Summary */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                  <svg
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Culinary Items</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{culinaryItems.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 px-6 py-4">
              <div className="text-sm">
                <Link
                  to="/culinary"
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                >
                  View all culinary items →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 