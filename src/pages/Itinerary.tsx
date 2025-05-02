import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { itineraryAPI, authAPI, } from '../utils/api';
import { jwtDecode } from 'jwt-decode';

interface ItineraryItem {
  id: number;
  user_id: number;
  name: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  created_at: string;
  updated_at: string;
}

interface ItineraryFormData {
  user_id: number;
  name: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
}

export function Itinerary() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const queryClient = useQueryClient();

  // Get current user profile
  const {  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile(),
  });

  const { data: itineraryResponse, isLoading } = useQuery({
    queryKey: ['itinerary'],
    queryFn: () => itineraryAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<ItineraryFormData, 'user_id'>) => {
      
      const payload = {
        name: data.name,
        destination: data.destination,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        user_id: jwtDecode(localStorage.getItem('token') || '').sub
      };
      return itineraryAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary'] });
      setIsCreating(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ItineraryFormData> }) =>
      itineraryAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary'] });
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => itineraryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary'] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<ItineraryFormData, 'user_id'>>();

  const onSubmit = (data: Omit<ItineraryFormData, 'user_id'>) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
    reset();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const itineraryItems = itineraryResponse?.data || [];
  const sortedItems = [...itineraryItems].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA.getTime() - dateB.getTime();
  });

  const groupedItems = sortedItems.reduce((groups, item) => {
    const date = item.startDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, ItineraryItem[]>);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Itinerary</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-[#663366] text-white px-4 py-2 rounded-md hover:bg-[#4d264d]"
          >
            Add Activity
          </button>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingItem) && (
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {editingItem ? 'Edit Activity' : 'Add New Activity'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    defaultValue={editingItem?.name}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="destination"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Destination
                  </label>
                  <input
                    type="text"
                    {...register('destination', { required: 'Destination is required' })}
                    defaultValue={editingItem?.destination}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.destination && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.destination.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    defaultValue={editingItem?.description}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      {...register('startDate', { required: 'Start date is required' })}
                      defaultValue={editingItem?.startDate}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      {...register('endDate', { required: 'End date is required' })}
                      defaultValue={editingItem?.endDate}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingItem(null);
                      reset();
                    }}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#663366]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#663366] text-white px-4 py-2 rounded-md hover:bg-[#4d264d]"
                  >
                    {editingItem ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Itinerary List */}
        <div className="mt-8 space-y-6">
          {Object.entries(groupedItems).map(([date, items]) => (
            <div key={date} className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between py-4 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-900">
                            {item.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.destination}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-[#663366] hover:text-[#4d264d]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this activity?')) {
                              deleteMutation.mutate(item.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 