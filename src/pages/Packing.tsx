import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { packingAPI } from '../utils/api';

interface PackingItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  is_packed: boolean;
}

interface PackingFormData {
  name: string;
  category: string;
  quantity: number;
}

export function Packing() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);
  const queryClient = useQueryClient();

  const { data: packingResponse, isLoading } = useQuery({
    queryKey: ['packing'],
    queryFn: () => packingAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: PackingFormData) => packingAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packing'] });
      setIsCreating(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PackingFormData }) =>
      packingAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packing'] });
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => packingAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packing'] });
    },
  });

  const togglePackedMutation = useMutation({
    mutationFn: (id: number) => {
      const item = packingResponse?.data.find((i: PackingItem) => i.id === id);
      return packingAPI.update(id, { ...item, is_packed: !item.is_packed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packing'] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PackingFormData>();

  const onSubmit = (data: PackingFormData) => {
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

  const packingItems = packingResponse?.data || [];
  const categories = ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Other'];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Packing List</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Item
          </button>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingItem) && (
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Item Name
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Item name is required' })}
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
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    defaultValue={editingItem?.category}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('quantity', {
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Quantity must be at least 1' },
                    })}
                    defaultValue={editingItem?.quantity}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.quantity.message}
                    </p>
                  )}
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

        {/* Packing Items List */}
        <div className="mt-8 space-y-6">
          {categories.map((category) => {
            const categoryItems = packingItems.filter(
              (item: PackingItem) => item.category === category
            );
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} className="bg-white shadow sm:rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{category}</h3>
                  <div className="space-y-4">
                    {categoryItems.map((item: PackingItem) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-2 border-b last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={item.is_packed}
                            onChange={() => togglePackedMutation.mutate(item.id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span
                            className={`text-sm ${
                              item.is_packed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}
                          >
                            {item.name} ({item.quantity})
                          </span>
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
                              if (window.confirm('Are you sure you want to delete this item?')) {
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
            );
          })}
        </div>
      </div>
    </div>
  );
} 