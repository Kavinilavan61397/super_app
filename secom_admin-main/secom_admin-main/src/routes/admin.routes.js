import GroceryTable from 'views/admin/Sidenav_pages/GroceryTable';
import GroceryForm from 'views/admin/Sidenav_pages/GroceryForm';

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
];

export default adminRoutes; 