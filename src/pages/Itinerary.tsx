import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { itineraryAPI } from '../utils/api';

interface ItineraryItem {
  id: number;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  date: string;
}

interface ItineraryFormData {
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  date: string;
}

export function Itinerary() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const queryClient = useQueryClient();

  const { data: itineraryResponse, isLoading } = useQuery({
    queryKey: ['itinerary'],
    queryFn: () => itineraryAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: ItineraryFormData) => itineraryAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary'] });
      setIsCreating(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ItineraryFormData }) =>
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
  } = useForm<ItineraryFormData>();

  const onSubmit = (data: ItineraryFormData) => {
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
    const dateA = new Date(`${a.date}T${a.start_time}`);
    const dateB = new Date(`${b.date}T${b.start_time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const groupedItems = sortedItems.reduce((groups, item) => {
    const date = item.date;
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
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
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
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    defaultValue={editingItem?.title}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
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
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    {...register('location', { required: 'Location is required' })}
                    defaultValue={editingItem?.location}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.location.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      {...register('date', { required: 'Date is required' })}
                      defaultValue={editingItem?.date}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="start_time"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Start Time
                      </label>
                      <input
                        type="time"
                        {...register('start_time', { required: 'Start time is required' })}
                        defaultValue={editingItem?.start_time}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.start_time && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.start_time.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="end_time"
                        className="block text-sm font-medium text-gray-700"
                      >
                        End Time
                      </label>
                      <input
                        type="time"
                        {...register('end_time', { required: 'End time is required' })}
                        defaultValue={editingItem?.end_time}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.end_time && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.end_time.message}
                        </p>
                      )}
                    </div>
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
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
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
                            {item.title}
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.start_time} - {item.end_time}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          Location: {item.location}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-indigo-600 hover:text-indigo-900"
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