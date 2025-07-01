import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  icon: Yup.string(),
  status: Yup.boolean(),
});

function AmenityForm({ initialValues = {}, onSubmit, onCancel, isEditMode }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
      <div>
        <label>Name</label>
        <Controller name="name" control={control} render={({ field }) => (
          <input {...field} className="border px-2 py-1 w-full" />
        )} />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>
      <div>
        <label>Icon (URL or class)</label>
        <Controller name="icon" control={control} render={({ field }) => (
          <input {...field} className="border px-2 py-1 w-full" />
        )} />
      </div>
      <div className="flex items-center">
        <Controller name="status" control={control} render={({ field }) => (
          <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
        )} />
        <span className="ml-2">Active</span>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>Cancel</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{isEditMode ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}

export default AmenityForm; 