import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import taxiService from '../../../services/taxiService';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

const TaxiForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);

  // Validation schema
  const validationSchema = Yup.object().shape({
    user_id: Yup.number().required('User is required'),
    driver_id: Yup.number().required('Driver is required'),
    vehicle_id: Yup.number().required('Vehicle is required'),
    pickup_location: Yup.string().required('Pickup location is required'),
    dropoff_location: Yup.string().required('Dropoff location is required'),
    fare: Yup.number()
      .required('Fare is required')
      .typeError('Fare must be a number')
      .min(0, 'Fare must be greater than or equal to 0'),
    status: Yup.number()
      .required('Status is required')
      .min(0, 'Status must be 0 or greater')
      .max(4, 'Status must be 4 or less'),
    requested_at: Yup.date().required('Requested at is required'),
    started_at: Yup.date().nullable(),
    completed_at: Yup.date().nullable(),
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch drivers, vehicles, and users for dropdowns
        const [driversRes, vehiclesRes] = await Promise.all([
          taxiService.getAllTaxiDrivers(),
          taxiService.getAllTaxiVehicles()
        ]);

        if (driversRes.success) setDrivers(driversRes.data);
        if (vehiclesRes.success) setVehicles(vehiclesRes.data);

        // For now, we'll use a mock users array since we don't have a users service
        // In a real app, you'd fetch users from the API
        setUsers([
          { id: 1, first_name: 'John', last_name: 'Doe' },
          { id: 2, first_name: 'Jane', last_name: 'Smith' },
          { id: 3, first_name: 'Bob', last_name: 'Johnson' }
        ]);

        if (isEdit) {
          setLoading(true);
          const res = await taxiService.getTaxiRideById(id);
          if (res.success) {
            const data = res.data;
            reset({
              user_id: data.user_id,
              driver_id: data.driver_id,
              vehicle_id: data.vehicle_id,
              pickup_location: data.pickup_location,
              dropoff_location: data.dropoff_location,
              fare: data.fare,
              status: data.status,
              requested_at: data.requested_at ? new Date(data.requested_at).toISOString().slice(0, 16) : '',
              started_at: data.started_at ? new Date(data.started_at).toISOString().slice(0, 16) : '',
              completed_at: data.completed_at ? new Date(data.completed_at).toISOString().slice(0, 16) : '',
            });
          } else {
            setError('Failed to load taxi ride');
            toast.error('Failed to load taxi ride');
          }
        }
      } catch (err) {
        setError('Failed to load data');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit, reset]);

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // Convert empty strings to null for optional dates
      const data = {
        ...formData,
        started_at: formData.started_at || null,
        completed_at: formData.completed_at || null,
      };

      if (isEdit) {
        await taxiService.updateTaxiRide(id, data);
        toast.success('Taxi ride updated successfully');
      } else {
        await taxiService.createTaxiRide(data);
        toast.success('Taxi ride created successfully');
      }
      navigate('/admin/taxi-rides');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save taxi ride';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return <div className="flex justify-center items-center h-full">Loading...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Taxi Ride' : 'Add Taxi Ride'}</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">User</label>
            <select {...register('user_id')} className="input input-bordered w-full">
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
            {errors.user_id && <p className="text-red-500 text-sm">{errors.user_id.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Driver</label>
            <select {...register('driver_id')} className="input input-bordered w-full">
              <option value="">Select Driver</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
            {errors.driver_id && <p className="text-red-500 text-sm">{errors.driver_id.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Vehicle</label>
            <select {...register('vehicle_id')} className="input input-bordered w-full">
              <option value="">Select Vehicle</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} - {vehicle.plate_number}
                </option>
              ))}
            </select>
            {errors.vehicle_id && <p className="text-red-500 text-sm">{errors.vehicle_id.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select {...register('status')} className="input input-bordered w-full">
              <option value="">Select Status</option>
              <option value={0}>Requested</option>
              <option value={1}>Accepted</option>
              <option value={2}>Started</option>
              <option value={3}>Completed</option>
              <option value={4}>Cancelled</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>
        </div>

        <div>
          <label className="block font-medium">Pickup Location</label>
          <input {...register('pickup_location')} className="input input-bordered w-full" />
          {errors.pickup_location && <p className="text-red-500 text-sm">{errors.pickup_location.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Dropoff Location</label>
          <input {...register('dropoff_location')} className="input input-bordered w-full" />
          {errors.dropoff_location && <p className="text-red-500 text-sm">{errors.dropoff_location.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Fare</label>
          <input 
            type="number" 
            step="0.01" 
            {...register('fare')} 
            className="input input-bordered w-full" 
          />
          {errors.fare && <p className="text-red-500 text-sm">{errors.fare.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Requested At</label>
            <input 
              type="datetime-local" 
              {...register('requested_at')} 
              className="input input-bordered w-full" 
            />
            {errors.requested_at && <p className="text-red-500 text-sm">{errors.requested_at.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Started At </label>
            <input 
              type="datetime-local" 
              {...register('started_at')} 
              className="input input-bordered w-full" 
            />
            {errors.started_at && <p className="text-red-500 text-sm">{"Select a valid starting date & time"}</p>}
          </div>

          <div>
            <label className="block font-medium">Completed At </label>
            <input 
              type="datetime-local" 
              {...register('completed_at')} 
              className="input input-bordered w-full" 
            />
            {errors.completed_at && <p className="text-red-500 text-sm">{"Select a valid ending date & time"}</p>}
          </div>
        </div>

        <div className="flex space-x-4">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" 
            disabled={loading}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Taxi Ride' : 'Add Taxi Ride'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin/taxi-rides')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaxiForm; 