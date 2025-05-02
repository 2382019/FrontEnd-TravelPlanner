import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { budgetAPI, BudgetItem } from '../utils/api';

interface BudgetFormData {
  category: string;
  unitCost: number;
  description: string;
  quantity: number;
}

export function Budget() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const queryClient = useQueryClient();

  const { data: budgetResponse, isLoading } = useQuery({
    queryKey: ['budget'],
    queryFn: () => budgetAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: BudgetFormData) => budgetAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      setIsCreating(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BudgetFormData }) =>
      budgetAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => budgetAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>();

  const onSubmit = (data: BudgetFormData) => {
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

  const budgetItems = budgetResponse?.data || [];
  const totalAmount = budgetItems.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Budget</h1>
            <p className="mt-1 text-sm text-gray-500">
              Total Expenses: ${totalAmount.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-[#663366] text-white px-4 py-2 rounded-md hover:bg-[#4d264d]"
          >
            Add Expense
          </button>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingItem) && (
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {editingItem ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
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
                    <option value="Transportation">Transportation</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Food">Food</option>
                    <option value="Activities">Activities</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
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
                    step="1"
                    {...register('quantity', {
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Quantity must be at least 1' },
                      valueAsNumber: true,
                    })}
                    defaultValue={editingItem?.quantity || 1}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="unitCost"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Unit Cost
                  </label>
                  <input
                    type="number"
                    step="1"
                    {...register('unitCost', {
                      required: 'Unit cost is required',
                      min: { value: 0, message: 'Unit cost must be positive' },
                      valueAsNumber: true,
                    })}
                    defaultValue={editingItem?.unitCost}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.unitCost && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.unitCost.message}
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
                  <input
                    type="text"
                    {...register('description', { required: 'Description is required' })}
                    defaultValue={editingItem?.description}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description.message}
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

        {/* Budget Items List */}
        <div className="mt-8 space-y-6">
          {budgetItems.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow sm:rounded-lg overflow-hidden"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.category}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-medium text-gray-900">
                      ${(item.unitCost * item.quantity).toFixed(2)}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-[#663366] hover:text-[#4d264d]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this expense?')) {
                            deleteMutation.mutate(item.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 