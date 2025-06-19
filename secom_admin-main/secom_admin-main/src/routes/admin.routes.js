import GroceryTable from 'views/admin/Sidenav_pages/GroceryTable';
import GroceryForm from 'views/admin/Sidenav_pages/GroceryForm';
import TaxiTable from 'views/admin/Sidenav_pages/TaxiTable';
import TaxiForm from 'views/admin/Sidenav_pages/TaxiForm';

const adminRoutes = [
  {
    path: '/admin/groceries',
    element: <GroceryTable />,
  },
  {
    path: '/admin/groceries/new',
    element: <GroceryForm />,
  },
  {
    path: '/admin/groceries/edit/:id',
    element: <GroceryForm />,
  },
  {
    path: '/admin/taxi-rides',
    element: <TaxiTable />,
  },
  {
    path: '/admin/taxi-rides/new',
    element: <TaxiForm />,
  },
  {
    path: '/admin/taxi-rides/edit/:id',
    element: <TaxiForm />,
  },
];

export default adminRoutes; 