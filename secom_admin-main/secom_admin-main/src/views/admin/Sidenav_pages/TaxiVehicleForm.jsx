import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import taxiService from '../../../services/taxiService';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

const TaxiVehicleForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drivers, setDrivers] = useState([]);

  // Validation schema
  const validationSchema = Yup.object().shape({
    driver_id: Yup.mixed()
      .required('Driver is required')
      .test('is-valid-id', 'Driver ID must be a valid number', function(value) {
        const numValue = parseInt(value, 10);
        return !isNaN(numValue) && numValue > 0;
      }),
    make: Yup.string().required('Make is required'),
    model: Yup.string().required('Model is required'),
    plate_number: Yup.string().required('Plate number is required'),
    color: Yup.string().required('Color is required'),
    status: Yup.mixed()
      .required('Status is required')
      .test('is-valid-status', 'Status must be 0, 1, or 2', function(value) {
        const numValue = parseInt(value, 10);
        return !isNaN(numValue) && numValue >= 0 && numValue <= 2;
      }),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {
    // Fetch drivers for the dropdown first
    taxiService.getAllTaxiDrivers()
      .then((driversRes) => {
        if (driversRes.success) {
          setDrivers(driversRes.data);
        }
      })
      .catch(() => {
        setError('Failed to load drivers');
        toast.error('Failed to load drivers');
      });

    // If in edit mode, fetch the specific vehicle's data
    if (isEdit) {
      setLoading(true);
      taxiService.getTaxiVehicleById(id)
        .then((response) => {
          if (response.success) {
            const data = response.data;
            reset({
              driver_id: data.driver_id,
              make: data.make,
              model: data.model,
              plate_number: data.plate_number,
              color: data.color,
              status: data.status,
            });
          } else {
            setError('Failed to load taxi vehicle');
            toast.error('Failed to load taxi vehicle');
          }
        })
        .catch(() => {
          setError('Failed to load taxi vehicle');
          toast.error('Failed to load taxi vehicle');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // Convert status and driver_id to numbers if they're strings
      const dataToSubmit = {
        ...formData,
        driver_id: parseInt(formData.driver_id, 10),
        status: parseInt(formData.status, 10)
      };

      console.log('Submitting taxi vehicle data:', dataToSubmit);

      if (isEdit) {
        console.log('Updating taxi vehicle with ID:', id);
        const response = await taxiService.updateTaxiVehicle(id, dataToSubmit);
        console.log('Update response:', response);
        toast.success('Taxi vehicle updated successfully');
      } else {
        console.log('Creating new taxi vehicle');
        const response = await taxiService.createTaxiVehicle(dataToSubmit);
        console.log('Create response:', response);
        toast.success('Taxi vehicle created successfully');
      }
      navigate('/admin/taxi-vehicles');
    } catch (err) {
      console.error('Error in form submission:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || 'Failed to save taxi vehicle';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return <div className="flex justify-center items-center h-full">Loading...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Taxi Vehicle' : 'Add Taxi Vehicle'}</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Driver</label>
          <select {...register('driver_id')} className="input input-bordered w-full">
            <option value="">Select Driver</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name} - {driver.license_no}
              </option>
            ))}
          </select>
          {errors.driver_id && <p className="text-red-500 text-sm">{errors.driver_id.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Make</label>
            <input 
              {...register('make')} 
              className="input input-bordered w-full" 
              placeholder="e.g., Toyota"
            />
            {errors.make && <p className="text-red-500 text-sm">{errors.make.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Model</label>
            <input 
              {...register('model')} 
              className="input input-bordered w-full" 
              placeholder="e.g., Camry"
            />
            {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Plate Number</label>
            <input 
              {...register('plate_number')} 
              className="input input-bordered w-full" 
              placeholder="e.g., ABC123"
            />
            {errors.plate_number && <p className="text-red-500 text-sm">{errors.plate_number.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Color</label>
            <input 
              {...register('color')} 
              className="input input-bordered w-full" 
              placeholder="e.g., White"
            />
            {errors.color && <p className="text-red-500 text-sm">{errors.color.message}</p>}
          </div>
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select {...register('status')} className="input input-bordered w-full">
            <option value="">Select Status</option>
            <option value={0}>Inactive</option>
            <option value={1}>Active</option>
            <option value={2}>Maintenance</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary flex-1"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Vehicle' : 'Create Vehicle')}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin/taxi-vehicles')}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaxiVehicleForm; 