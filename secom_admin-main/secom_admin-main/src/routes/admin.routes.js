import GroceryTable from '../views/admin/Sidenav_pages/GroceryTable';
import GroceryForm from '../views/admin/Sidenav_pages/GroceryForm';
import TaxiTable from '../views/admin/Sidenav_pages/TaxiTable';
import TaxiForm from '../views/admin/Sidenav_pages/TaxiForm';
import TaxiDriverTable from '../views/admin/Sidenav_pages/TaxiDriverTable';
import TaxiDriverForm from '../views/admin/Sidenav_pages/TaxiDriverForm';
import TaxiVehicleTable from '../views/admin/Sidenav_pages/TaxiVehicleTable';
import TaxiVehicleForm from '../views/admin/Sidenav_pages/TaxiVehicleForm';
import BrandTable from '../views/admin/Sidenav_pages/BrandTable';
import BrandForm from '../views/admin/Sidenav_pages/BrandForm';
import CategoryTable from '../views/admin/Sidenav_pages/CategoryTable';
import CategoryForm from '../views/admin/Sidenav_pages/CategoryForm';
import RestoCategoryTable from '../views/admin/Sidenav_pages/RestoCategoryTable';
import RestoCategoryForm from '../views/admin/Sidenav_pages/RestoCategoryForm';
import RestaurantTable from '../views/admin/Sidenav_pages/RestaurantTable';
import RestaurantForm from '../views/admin/Sidenav_pages/RestaurantForm';

const adminRoutes = [
  {
    path: 'categories',
    element: <CategoryTable />,
  },
  {
    path: 'categories/new',
    element: <CategoryForm />,
  },
  {
    path: 'categories/edit/:id',
    element: <CategoryForm />,
  },
  {
    path: 'restocategory',
    element: <RestoCategoryTable />,
  },
  {
    path: 'restocategory/new',
    element: <RestoCategoryForm />,
  },
  {
    path: 'restocategory/edit/:id',
    element: <RestoCategoryForm />,
  },
  {
    path: 'groceries',
    element: <GroceryTable />,
  },
  {
    path: 'groceries/new',
    element: <GroceryForm />,
  },
  {
    path: 'groceries/edit/:id',
    element: <GroceryForm />,
  },
  {
    path: 'taxi-rides',
    element: <TaxiTable />,
  },
  {
    path: 'taxi-rides/new',
    element: <TaxiForm />,
  },
  {
    path: 'taxi-rides/edit/:id',
    element: <TaxiForm />,
  },
  {
    path: 'taxi-drivers',
    element: <TaxiDriverTable />,
  },
  {
    path: 'taxi-drivers/new',
    element: <TaxiDriverForm />,
  },
  {
    path: 'taxi-drivers/edit/:id',
    element: <TaxiDriverForm />,
  },
  {
    path: 'taxi-vehicles',
    element: <TaxiVehicleTable />,
  },
  {
    path: 'taxi-vehicles/new',
    element: <TaxiVehicleForm />,
  },
  {
    path: 'taxi-vehicles/edit/:id',
    element: <TaxiVehicleForm />,
  },
  {
    path: 'brands',
    element: <BrandTable />,
  },
  {
    path: 'brands/new',
    element: <BrandForm />,
  },
  {
    path: 'brands/edit/:id',
    element: <BrandForm />,
  },
  {
    path: 'restaurant',
    element: <RestaurantTable />,
  },
  {
    path: 'restaurant/new',
    element: <RestaurantForm />,
  },
  {
    path: 'restaurant/edit/:id',
    element: <RestaurantForm />,
  },
];

export default adminRoutes; 