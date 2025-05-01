import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { culinaryAPI } from '../utils/api';

interface CulinaryItem {
  id: number;
  name: string;
  description: string;
  location: string;
  price_range: string;
  cuisine_type: string;
  rating: number;
  notes: string;
}

interface CulinaryFormData {
  name: string;
  description: string;
  location: string;
  price_range: string;
  cuisine_type: string;
  rating: number;
  notes: string;
}

export function Culinary() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<CulinaryItem | null>(null);
  const queryClient = useQueryClient();

  const { data: culinaryResponse, isLoading } = useQuery({
    queryKey: ['culinary'],
    queryFn: () => culinaryAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CulinaryFormData) => culinaryAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['culinary'] });
      setIsCreating(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CulinaryFormData }) =>
      culinaryAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['culinary'] });
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => culinaryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['culinary'] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CulinaryFormData>();

  const onSubmit = (data: CulinaryFormData) => {
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

  const culinaryItems = culinaryResponse?.data || [];
  const groupedItems = culinaryItems.reduce((groups, item) => {
    const type = item.cuisine_type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {} as Record<string, CulinaryItem[]>);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Culinary Experiences</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Food Experience
          </button>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingItem) && (
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {editingItem ? 'Edit Food Experience' : 'Add New Food Experience'}
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
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
                      htmlFor="cuisine_type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cuisine Type
                    </label>
                    <select
                      {...register('cuisine_type', { required: 'Cuisine type is required' })}
                      defaultValue={editingItem?.cuisine_type}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a cuisine type</option>
                      <option value="Local">Local</option>
                      <option value="International">International</option>
                      <option value="Street Food">Street Food</option>
                      <option value="Fine Dining">Fine Dining</option>
                      <option value="Cafe">Cafe</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.cuisine_type && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.cuisine_type.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="price_range"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price Range
                    </label>
                    <select
                      {...register('price_range', { required: 'Price range is required' })}
                      defaultValue={editingItem?.price_range}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select price range</option>
                      <option value="$">$ (Budget)</option>
                      <option value="$$">$$ (Moderate)</option>
                      <option value="$$$">$$$ (Expensive)</option>
                      <option value="$$$$">$$$$ (Luxury)</option>
                    </select>
                    {errors.price_range && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.price_range.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.5"
                    {...register('rating', {
                      required: 'Rating is required',
                      min: { value: 1, message: 'Minimum rating is 1' },
                      max: { value: 5, message: 'Maximum rating is 5' },
                    })}
                    defaultValue={editingItem?.rating}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    defaultValue={editingItem?.notes}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
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

        {/* Culinary List */}
        <div className="mt-8 space-y-6">
          {Object.entries(groupedItems).map(([type, items]) => (
            <div key={type} className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{type}</h3>
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
                            {item.price_range}
                          </span>
                          <span className="text-sm text-gray-500">
                            Rating: {item.rating}/5
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          Location: {item.location}
                        </p>
                        {item.notes && (
                          <p className="mt-1 text-sm text-gray-500">Notes: {item.notes}</p>
                        )}
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
                            if (
                              window.confirm(
                                'Are you sure you want to delete this food experience?'
                              )
                            ) {
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