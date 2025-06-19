import React from "react";
import MainDashboard from "views/admin/default";
import authRoutes from "./routes/auth.routes";
import {
  MdSupervisorAccount,
  MdLock,
  MdSecurity ,
  MdHome,
  MdLocalShipping,
  MdRestaurant,
  MdCategory,
  MdBrandingWatermark,
  MdViewQuilt,
  MdImage,
  MdPerson,
  MdPages,
  MdDescription,
  MdSettings,
  MdHelp,
  MdStar,
  MdEmail,
  MdLibraryBooks,
  MdPayment,
  MdStore,
  MdInventory,
  MdShoppingCart,
  MdQuestionAnswer,
  MdTag,
  MdColorLens,
  MdFormatSize,
  MdAttachMoney,
  MdGroup,
  MdScale,
  MdPeople,
  MdLocalPizza,
  MdHotel,
  MdLocationCity,
  MdHelpOutline,
  MdLocalGroceryStore,
  MdDirectionsCar
} from "react-icons/md";
import { FaTags, FaPercentage } from "react-icons/fa";
import { AiOutlineShoppingCart, AiOutlineAppstore } from 'react-icons/ai';
import BrandTable from "views/admin/Sidenav_pages/BrandTable";
import Category from "views/admin/Sidenav_pages/Category";
import SubCategory from "views/admin/Sidenav_pages/Sub_Category";
import Products from "views/admin/Sidenav_pages/Products";
import ProductVariation from "views/admin/Sidenav_pages/ProductVariation";
import Orders from "views/admin/Sidenav_pages/Orders";
import Discount from "views/admin/Sidenav_pages/Discount";
import Color from "views/admin/Sidenav_pages/Color";
import Tax from "views/admin/Sidenav_pages/Tax";
import GroupTax from "views/admin/Sidenav_pages/GroupTax";
import Users from "views/admin/Sidenav_pages/Users";
import Size from "views/admin/Sidenav_pages/Size";
import Tags from "views/admin/Sidenav_pages/Tags";
import Banner from "views/admin/Sidenav_pages/Banner";
import Profile from "views/admin/Sidenav_pages/Profile";
import Pages from "views/admin/Sidenav_pages/Pages";
import BlogCategory from "views/admin/Sidenav_pages/BlogCategory";
import BlogMain from "views/admin/Sidenav_pages/BlogMain";
import EmailConfiguration from "views/admin/Sidenav_pages/EmailConfiguration";
import HomePage from "views/admin/Sidenav_pages/HomePage";
import SectionName from "views/admin/Sidenav_pages/SectionName";
import Faq from "views/admin/Sidenav_pages/Faq";
import EmailTemplate from "views/admin/Sidenav_pages/EmailTemplate";
import Rating from "views/admin/Sidenav_pages/Rating";
import Enquiry from "views/admin/Sidenav_pages/Enquiry";
import PaymentGateway from "views/admin/Sidenav_pages/PaymentGateway";
import StockAdjustment from "views/admin/Sidenav_pages/StockAdjustment";
import Stocks from "views/admin/Sidenav_pages/Stocks";
import Units from "views/admin/Sidenav_pages/Units";
import Staff from "views/admin/Sidenav_pages/Staff";
import Role from "views/admin/Sidenav_pages/Role";
import RolePermission from "views/admin/Sidenav_pages/RolePermission";
// import RestoBrand from "views/admin/Sidenav_pages/RestoBrand";
import RestoCategory from "views/admin/Sidenav_pages/RestoCategory";
import RestoSubCategory from "views/admin/Sidenav_pages/RestoSubCategory";
import RestoProducts from "views/admin/Sidenav_pages/RestoProducts";
import RestoProductVariation from "views/admin/Sidenav_pages/RestoProductVariation";
import RestoDiscount from "views/admin/Sidenav_pages/RestoDiscount";
import RestoOrders from "views/admin/Sidenav_pages/RestoOrders";
import RestoRatings from "views/admin/Sidenav_pages/RestoRatings";
import RestoStockAdjustment from "views/admin/Sidenav_pages/RestoStockAdjustment";
import RestoStocks from "views/admin/Sidenav_pages/RestoStocks";
import Toppings from "views/admin/Sidenav_pages/Toppings";
import HotelAttributes from "views/admin/Sidenav_pages/HotelAttributes";
import HotelPolicy from "views/admin/Sidenav_pages/HotelPolicy";
import AllHotel from "views/admin/Sidenav_pages/AllHotel";
import HotelFaqs from "views/admin/Sidenav_pages/HotelFaqs";
import ManageRooms from "views/admin/Sidenav_pages/ManageRooms";
import AvailableRooms from "views/admin/Sidenav_pages/AvailableRooms";
import GroceryTable from "views/admin/Sidenav_pages/GroceryTable";
import GroceryForm from "views/admin/Sidenav_pages/GroceryForm";
import TaxiTable from "views/admin/Sidenav_pages/TaxiTable";
import TaxiForm from "views/admin/Sidenav_pages/TaxiForm";

const routes = [
  ...authRoutes,
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Grocery",
    layout: "/admin",
    icon: <MdLocalGroceryStore className="h-6 w-6" />,
    subNav: [
      {
        name: "All Groceries",
        layout: "/admin",
        icon: <MdLocalGroceryStore className="h-6 w-6" />,
        path: "groceries",
        component: <GroceryTable />,
      },
      {
        name: "Add Grocery",
        layout: "/admin",
        icon: <MdLocalGroceryStore className="h-6 w-6" />,
        path: "groceries/new",
        component: <GroceryForm />,
      }
    ]
  },
  {
    name: "Taxi",
    layout: "/admin",
    icon: <MdDirectionsCar className="h-6 w-6" />,
    subNav: [
      {
        name: "All Taxi Rides",
        layout: "/admin",
        icon: <MdDirectionsCar className="h-6 w-6" />,
        path: "taxi-rides",
        component: <TaxiTable />,
      },
      // {
      //   name: "Add Taxi Ride",
      //   layout: "/admin",
      //   icon: <MdDirectionsCar className="h-6 w-6" />,
      //   path: "taxi-rides/new",
      //   component: <TaxiForm />,
      // }
    ]
  },
  {
    name: "Ecommerce",
    layout: "/admin",
    icon: <MdShoppingCart className="h-6 w-6" />,
    subNav: [
      {
        name: "Brand",
        layout: "/admin",
        icon: <MdBrandingWatermark className="h-6 w-6" />,
        path: "brand",
        component: <BrandTable />,
      },
      {
        name: "Category",
        layout: "/admin",
        icon: <MdCategory className="h-6 w-6" />,
        path: "category",
        component: <Category />,
      },
      {
        name: "Sub-Category",
        layout: "/admin",
        path: "subCategory",
        icon: <FaTags className="h-6 w-6" />,
        component: <SubCategory />,
      },
      {
        name: "Product",
        layout: "/admin",
        icon: <AiOutlineAppstore className="h-6 w-6" />,
        path: "product",
        component: <Products />,
      },
      {
        name: "Discount",
        layout: "/admin",
        icon: <FaPercentage className="h-6 w-6" />,
        path: "discount",
        component: <Discount />,
      },
      {
        name: "Orders",
        layout: "/admin",
        icon: <AiOutlineShoppingCart className="h-6 w-6" />,
        path: "orders",
        component: <Orders />,
      },
      {
        name: "Ratings",
        layout: "/admin",
        icon: <MdStar className="h-6 w-6" />, 
        path: "rating",
        component: <Rating />,
      },
      {
        name: "Stock Adjustment",
        layout: "/admin",
        icon: <MdStore  className="h-6 w-6" />, 
        path: "stockadjustment",
        component: <StockAdjustment />,
      },
      {
        name: "Roles and Permissions",
        layout: "/admin",
        path: null,
        icon: <MdSecurity className="h-6 w-6" />,
        subNav: [
          {
            name: "Roles",
            layout: "/admin",
            icon: <MdSupervisorAccount  className="h-6 w-6" />,
            path: "role",
            component: <Role />,
          },
          {
            name: "Staff",
            layout: "/admin",
            icon: <MdPerson className="h-6 w-6" />,
            path: "staff",
            component: <Staff />,
          },
          {
            name: "Roles and Permission",
            layout: "/admin",
            path: "rolepermission",
            icon: <MdLock className="h-6 w-6" />,
            component: <RolePermission />,
          },
        ]
      },
    ]
  },
  {
    name: "Restaurant",
    layout: "/admin",
    icon: <MdRestaurant className="h-6 w-6" />,
    subNav: [
      // {
      //   name: "Brand",
      //   layout: "/admin",
      //   icon: <MdBrandingWatermark className="h-6 w-6" />,
      //   path: "restobrand",
      //   component: <RestoBrand />,
      // },
      {
        name: "Category",
        layout: "/admin",
        icon: <MdCategory className="h-6 w-6" />,
        path: "restocategory",
        component: <RestoCategory />,
      },
      {
        name: "Sub-Category",
        layout: "/admin",
        path: "restosubcategory",
        icon: <FaTags className="h-6 w-6" />,
        component: <RestoSubCategory />,
      },
      {
        name: "Product",
        layout: "/admin",
        icon: <AiOutlineAppstore className="h-6 w-6" />,
        path: "restoproducts",
        component: <RestoProducts />,
      },
      {
        name: "Discount",
        layout: "/admin",
        icon: <FaPercentage className="h-6 w-6" />,
        path: "restodiscount",
        component: <RestoDiscount />,
      },
      {
        name: "Orders",
        layout: "/admin",
        icon: <AiOutlineShoppingCart className="h-6 w-6" />,
        path: "restoorders",
        component: <RestoOrders />,
      },
      {
        name: "Ratings",
        layout: "/admin",
        icon: <MdStar className="h-6 w-6" />, 
        path: "RestoRatings",
        component: <RestoRatings />,
      },
      {
        name: "Toppings",
        layout: "/admin",
        icon: <MdLocalPizza   className="h-6 w-6" />, 
        path: "Toppings",
        component: <Toppings />,
      },
      {
        name: "Stock Adjustment",
        layout: "/admin",
        icon: <MdStore  className="h-6 w-6" />, 
        path: "restostockadjustment",
        component: <RestoStockAdjustment />,
      },
    ]
  },
  {
  name: "Hotel",
  layout: "/admin",
  icon: <MdHotel className="h-6 w-6" />, // Changed to MdHotel for a more appropriate icon
  subNav: [
    {
      name: "All Hotels",
      layout: "/admin",
      icon: <MdLocationCity className="h-6 w-6" />, // Changed to MdLocationCity to represent hotels
      path: "allhotel",
      component: <AllHotel />,
    },
    {
      name: "Hotel Attributes",
      layout: "/admin",
      icon: <MdSettings className="h-6 w-6" />, // Changed to MdSettings to represent attributes or configurations
      path: "hotelattributes",
      component: <HotelAttributes />,
    },
    {
      name: "Hotel Policy",
      layout: "/admin",
      icon: <MdDescription className="h-6 w-6" />, // Changed to MdDescription for policies (documents)
      path: "hotelpolicy",
      component: <HotelPolicy />,
    },
    {
      name: "Hotel FAQs",
      layout: "/admin",
      icon: <MdHelpOutline className="h-6 w-6" />, // Changed to MdHelpOutline for FAQs (questions)
      path: "hotelfaqs",
      component: <HotelFaqs />,
    },
  ]
},
  {
    name: "Taxes",
    layout: "/admin",
    icon: <MdCategory className="h-6 w-6" />,
    subNav: [
      {
        name: "Tax",
        layout: "/admin",
        icon: <MdAttachMoney className="h-6 w-6" />,
        path: "taxs",
        component: <Tax />,
      },
      {
        name: "Group Tax",
        layout: "/admin",
        icon: <MdGroup className="h-6 w-6" />,
        path: "grouptax",
        component: <GroupTax />,
      },
    ]
  },
  
  {
    name: "Blog",
    layout: "/admin",
    path: null,
    icon: <MdDescription className="h-6 w-6" />,
    subNav: [
      {
        name: "Blog Category",
        layout: "/admin",
        icon: <MdCategory className="h-6 w-6" />,
        path: "blogcategory",
        component: <BlogCategory />,
      },
      {
        name: "Blog Main",
        layout: "/admin",
        icon: <MdDescription className="h-6 w-6" />,
        path: "blogmain",
        component: <BlogMain />,
      },
      { 
        name: "Tags",
        layout: "/admin",
        icon: <MdTag className="h-6 w-6" />,
        path: "tags",
        component: <Tags />,
      },
    ]
  },

  {
    name: "CMS",
    layout: "/admin",
    icon: <MdLibraryBooks className="h-6 w-6" />,
    subNav: [
      {
        name: "Pages",
        layout: "/admin",
        icon: <MdPages className="h-6 w-6" />,
        path: "pages",
        component: <Pages />,
      },
      {
        name: "Banner",
        layout: "/admin",
        icon: <MdImage className="h-6 w-6" />,
        path: "banner",
        component: <Banner />,
      },
      {
        name: "Faq",
        layout: "/admin",
        icon: <MdHelp className="h-6 w-6" />,
        path: "faq",
        component: <Faq />,
      },
      {
        name: "Home Page",
        layout: "/admin",
        icon: <MdHome className="h-6 w-6" />,
        path: "homepage",
        component: <HomePage />,
      },
      {
        name: "Sections",
        layout: "/admin",
        icon: <MdLibraryBooks className="h-6 w-6" />,
        path: "sectionname",
        component: <SectionName />,
      },
    ]
  },
  
   {
    name: "Settings",
    layout: "/admin",
    icon: <MdCategory className="h-6 w-6" />,
    subNav: [
      {
        name: "Profile",
        layout: "/admin",
        icon: <MdPerson className="h-6 w-6" />, 
        path: "profile",
        component: <Profile />,
      },
      {
        name: "Payment Gateway",
        layout: "/admin",
        icon: <MdPayment  className="h-6 w-6" />, 
        path: "paymentgateway",
        component: <PaymentGateway />,
      },
      {
        name: "Email Configuration",
        layout: "/admin",
        icon: <MdSettings className="h-6 w-6" />, 
        path: "emailconfiguration",
        component: <EmailConfiguration />,
      },
      {
        name: "Email Template",
        layout: "/admin",
        icon: <MdEmail className="h-6 w-6" />, 
        path: "emailtemplate",
        component: <EmailTemplate />,
      },
    
    ]
   },
   {
    name: "Roles and Permissions",
    layout: "/admin",
    path: null,
    icon: <MdSecurity className="h-6 w-6" />, // Main icon remains the same
    subNav: [
      {
        name: "Roles",
        layout: "/admin",
        icon: <MdSupervisorAccount  className="h-6 w-6" />, // Group icon for roles
        path: "role",
        component: <Role />,
      },
      {
        name: "Staff",
        layout: "/admin",
        icon: <MdPerson className="h-6 w-6" />, // Person icon for staff
        path: "staff",
        component: <Staff />,
      },
      {
        name: "Roles and Permission",
        layout: "/admin",
        path: "rolepermission",
        icon: <MdLock className="h-6 w-6" />, // Lock icon for roles and permissions
        component: <RolePermission />,
      },
    ]
  },
    {
      name: "Users",
      layout: "/admin",
      icon: <MdPeople className="h-6 w-6" />,
      path: "users",
      component: <Users />,
    },
    
    {
      name: "Size",
      layout: "/admin",
      icon: <MdFormatSize className="h-6 w-6" />,
      path: "size",
      component: <Size />,
    },
    {
      name: "Color",
      layout: "/admin",
      icon: <MdColorLens className="h-6 w-6" />,
      path: "color",
      component: <Color />,
    },
  
    {
      name: "Enquiry",
      layout: "/admin",
      icon: <MdQuestionAnswer className="h-6 w-6" />, 
      path: "enquiry",
      component: <Enquiry />,
    },
    {
      name: "Units",
      layout: "/admin",
      icon: <MdScale className="h-6 w-6" />, 
      path: "units",
      component: <Units />,
    },


    
    {
      name: "",
      layout: "/admin",
      // icon: <MdViewQuilt className="h-6 w-6" />,
      path: "productvariation",
      component: <ProductVariation />,
    },
    {
      name: "",
      layout: "/admin",
      // icon: <MdInventory  className="h-6 w-6" />, 
      path: "restoproductvariation",
      component: <RestoProductVariation />,
    },
    {
      name: "",
      layout: "/admin",
      // icon: <MdInventory  className="h-6 w-6" />, 
      path: "stocks",
      component: <Stocks />,
    },
    {
      name: "",
      layout: "/admin",
      // icon: <MdInventory  className="h-6 w-6" />, 
      path: "restostocks",
      component: <RestoStocks />,
    },
    {
      name: "",
      layout: "/admin",
      // icon: <MdInventory  className="h-6 w-6" />, 
      path: "manage-rooms",
      component: <ManageRooms />,
    },
    {
      name: "",
      layout: "/admin",
      // icon: <MdInventory  className="h-6 w-6" />, 
      path: "available-rooms",
      component: <AvailableRooms />,
    },
    {
      name: "",
      layout: "/admin",
      path: "groceries/edit/:id",
      component: <GroceryForm />,
    },
    {
      name: "",
      layout: "/admin",
      path: "taxi-rides/edit/:id",
      component: <TaxiForm />,
    },
    ]

export default routes;



// import React from "react";
// // Admin Imports
// import MainDashboard from "views/admin/default";
// // Icon Imports
// import {
//   MdLocalShipping,
//   MdRestaurant ,
//   MdHome,
//   MdBrandingWatermark,
//   MdCategory,
//   MdViewQuilt,
//   MdImage,
//   MdPerson,
//   MdPages,
//   MdDescription,
//   MdSettings,
//   MdHelp,
//   MdStar,
//   MdEmail,MdLibraryBooks ,
//   MdPayment ,MdStore ,MdInventory ,MdShoppingCart ,
//   MdQuestionAnswer,MdTag, MdColorLens, MdFormatSize, MdAttachMoney, MdGroup, MdPeople,
// } from "react-icons/md";
// import { FaTags,FaPercentage    } from "react-icons/fa";
// import { AiOutlineShoppingCart ,AiOutlineAppstore } from 'react-icons/ai';
// import BrandTable from "views/admin/Sidenav_pages/BrandTable";
// import Category from "views/admin/Sidenav_pages/Category";
// import SubCategory from "views/admin/Sidenav_pages/Sub_Category";
// import Products from "views/admin/Sidenav_pages/Products";
// import ProductVariation from "views/admin/Sidenav_pages/ProductVariation";
// import Orders from "views/admin/Sidenav_pages/Orders";
// import Discount from "views/admin/Sidenav_pages/Discount";
// import Color from "views/admin/Sidenav_pages/Color";
// import Tax from "views/admin/Sidenav_pages/Tax";
// import GroupTax from "views/admin/Sidenav_pages/GroupTax";
// import Users from "views/admin/Sidenav_pages/Users";
// import Size from "views/admin/Sidenav_pages/Size";
// import Tags from "views/admin/Sidenav_pages/Tags";
// import Banner from "views/admin/Sidenav_pages/Banner";
// import Profile from "views/admin/Sidenav_pages/Profile";
// import Pages from "views/admin/Sidenav_pages/Pages";
// import BlogCategory from "views/admin/Sidenav_pages/BlogCategory";
// import BlogMain from "views/admin/Sidenav_pages/BlogMain";
// import EmailConfiguration from "views/admin/Sidenav_pages/EmailConfiguration";
// import HomePage from "views/admin/Sidenav_pages/HomePage";
// import SectionName from "views/admin/Sidenav_pages/SectionName";
// import Faq from "views/admin/Sidenav_pages/Faq";
// import EmailTemplate from "views/admin/Sidenav_pages/EmailTemplate";
// import Rating from "views/admin/Sidenav_pages/Rating";
// import Enquiry from "views/admin/Sidenav_pages/Enquiry";
// import PaymentGateway from "views/admin/Sidenav_pages/PaymentGateway";
// import StockAdjustment from "views/admin/Sidenav_pages/StockAdjustment";
// import Stocks from "views/admin/Sidenav_pages/Stocks";
// import Posts from "views/admin/Sidenav_pages/Posts";
// const routes = [
//   {
//     name: "Main Dashboard",
//     layout: "/admin",
//     path: "default",
//     icon: <MdHome className="h-6 w-6" />,
//     component: <MainDashboard />,
//   },
//   {
//     name: "Ecommerce",
//     layout: "/admin",
//     icon: <MdShoppingCart  className="h-6 w-6" />,
//     subNav: [ {
//       name: "Brand",
//       layout: "/admin",
//       icon:  <MdBrandingWatermark className="h-6 w-6" />,
//       path: "brand",
//       component:<BrandTable/>
//     },
//     {
//       name: "Category",
//       layout: "/admin",
//       icon: <MdCategory className="h-6 w-6" />,
//       path: "category",
//       component:<Category/>
//     },
//     {
//       name: "Sub-Category",
//       layout: "/admin",
//       path: "subCategory",
//       icon: <FaTags className="h-6 w-6" />, 
//       component: <SubCategory />,
//     },
//     {
//       name: "Product",
//       layout: "/admin",
//       icon: <AiOutlineAppstore  className="h-6 w-6" />, 
//       path: "product",
//       component: <Products />,
//     },
//     {
//       name: "Discount",
//       layout: "/admin",
//       icon: <FaPercentage   className="h-6 w-6" />,
//       path: "discount",
//       component: <Discount />,
//     },
//     {
//       name: "Orders",
//       layout: "/admin",
//       icon: <AiOutlineShoppingCart className="h-6 w-6" />, 
//       path: "orders",
//       component: <Orders />,
//     },
//     {
//       name: "Users",
//       layout: "/admin",
//       icon: <MdPeople className="h-6 w-6" />,
//       path: "users",
//       component: <Users />,
//     },
  
//     {
//       name: "Blog",
//       layout: "/admin",
//       path: null,
//       icon: <MdCategory className="h-6 w-6" />, // Function returning JSX
//       subNav: [
//         {
//           name: "Blog Category",
//           layout: "/admin",
//           icon:<MdCategory className="h-6 w-6" />, 
//           path: "blogcategory",
//           component: <BlogCategory />,
//         },
//         {
//           name: "Blog Main",
//           layout: "/admin",
//           icon:<MdDescription className="h-6 w-6" />, 
//           path: "blogmain",
//           component: <BlogMain />,
//         },
//       ]
//     },
//     {
//       name: "CMS",
//       layout: "/admin",
//       icon: <MdCategory className="h-6 w-6" />,
//       subNav: [
//         {
//           name: "Pages",
//           layout: "/admin",
//           icon: <MdPages className="h-6 w-6" />, 
//           path: "pages",
//           component: <Pages />,
//         },
       
//         {
//           name: "Banner",
//           layout: "/admin",
//           icon: <MdImage className="h-6 w-6" />, 
//           path: "banner",
//           component: <Banner />,
//         },
       
//         {
//           name: "Faq",
//           layout: "/admin",
//           icon: <MdHelp className="h-6 w-6" />, 
//           path: "faq",
//           component: <Faq />,
//         },
//         {
//           name: "Home Page",
//           layout: "/admin",
//           icon: <MdHome className="h-6 w-6" />, 
//           path: "homepage",
//           component: <HomePage />,
//         },
//         {
//           name: "Sections",
//           layout: "/admin",
//           icon: <MdLibraryBooks  className="h-6 w-6" />, 
//           path: "sectionname",
//           component: <SectionName />,
//         },
//       ]
//     },
//     ]
//   },
//   {
//     name: "Groceries",
//     layout: "/admin",
//     icon: <MdLocalShipping   className="h-6 w-6" />,
//     subNav: [ {
//       name: "Brand",
//       layout: "/admin",
//       icon:  <MdBrandingWatermark className="h-6 w-6" />,
//       path: "brand",
//       component:<BrandTable/>
//     },
//     {
//       name: "Category",
//       layout: "/admin",
//       icon: <MdCategory className="h-6 w-6" />,
//       path: "category",
//       component:<Category/>
//     },
//     {
//       name: "Sub-Category",
//       layout: "/admin",
//       path: "subCategory",
//       icon: <FaTags className="h-6 w-6" />, 
//       component: <SubCategory />,
//     },
//     {
//       name: "Product",
//       layout: "/admin",
//       icon: <AiOutlineAppstore  className="h-6 w-6" />, 
//       path: "product",
//       component: <Products />,
//     },
//     {
//       name: "Discount",
//       layout: "/admin",
//       icon: <FaPercentage   className="h-6 w-6" />,
//       path: "discount",
//       component: <Discount />,
//     },
//     {
//       name: "Orders",
//       layout: "/admin",
//       icon: <AiOutlineShoppingCart className="h-6 w-6" />, 
//       path: "orders",
//       component: <Orders />,
//     },
//     {
//       name: "Users",
//       layout: "/admin",
//       icon: <MdPeople className="h-6 w-6" />,
//       path: "users",
//       component: <Users />,
//     },
//     {
//       name: "Blog",
//       layout: "/admin",
//       path: null,
//       icon:<MdCategory className="h-6 w-6" />, // Function returning JSX
//       subNav: [
//         {
//           name: "Blog Category",
//           layout: "/admin",
//           icon:<MdCategory className="h-6 w-6" />, 
//           path: "blogcategory",
//           component: <BlogCategory />,
//         },
//         {
//           name: "Blog Main",
//           layout: "/admin",
//           icon:<MdDescription className="h-6 w-6" />, 
//           path: "blogmain",
//           component: <BlogMain />,
//         },
//       ]
//     },
//     {
//       name: "CMS",
//       layout: "/admin",
//       icon: <MdCategory className="h-6 w-6" />,
//       subNav: [
//         {
//           name: "Pages",
//           layout: "/admin",
//           icon: <MdPages className="h-6 w-6" />, 
//           path: "pages",
//           component: <Pages />,
//         },
//         {
//           name: "Banner",
//           layout: "/admin",
//           icon: <MdImage className="h-6 w-6" />, 
//           path: "banner",
//           component: <Banner />,
//         },
//         {
//           name: "Faq",
//           layout: "/admin",
//           icon: <MdHelp className="h-6 w-6" />, 
//           path: "faq",
//           component: <Faq />,
//         },
//         {
//           name: "Home Page",
//           layout: "/admin",
//           icon: <MdHome className="h-6 w-6" />, 
//           path: "homepage",
//           component: <HomePage />,
//         },
//         {
//           name: "Sections",
//           layout: "/admin",
//           icon: <MdLibraryBooks  className="h-6 w-6" />, 
//           path: "sectionname",
//           component: <SectionName />,
//         },
//       ]
//     },
//     ]
//   },
//   {
//     name: "Resturant",
//     layout: "/admin",
//     icon: <MdRestaurant   className="h-6 w-6" />,
//     subNav: [ {
//       name: "Brand",
//       layout: "/admin",
//       icon:  <MdBrandingWatermark className="h-6 w-6" />,
//       path: "brand",
//       component:<BrandTable/>
//     },
//     {
//       name: "Category",
//       layout: "/admin",
//       icon: <MdCategory className="h-6 w-6" />,
//       path: "category",
//       component:<Category/>
//     },
//     {
//       name: "Sub-Category",
//       layout: "/admin",
//       path: "subCategory",
//       icon: <FaTags className="h-6 w-6" />, 
//       component: <SubCategory />,
//     },
//     {
//       name: "Product",
//       layout: "/admin",
//       icon: <AiOutlineAppstore  className="h-6 w-6" />, 
//       path: "product",
//       component: <Products />,
//     },
//     {
//       name: "Discount",
//       layout: "/admin",
//       icon: <FaPercentage   className="h-6 w-6" />,
//       path: "discount",
//       component: <Discount />,
//     },
//     {
//       name: "Orders",
//       layout: "/admin",
//       icon: <AiOutlineShoppingCart className="h-6 w-6" />, 
//       path: "orders",
//       component: <Orders />,
//     },
//     {
//       name: "Users",
//       layout: "/admin",
//       icon: <MdPeople className="h-6 w-6" />,
//       path: "users",
//       component: <Users />,
//     },
  
//     {
//       name: "Blog",
//       layout: "/admin",
//       path: null,
//       icon:<MdCategory className="h-6 w-6" />, // Function returning JSX
//       subNav: [
//         {
//           name: "Blog Category",
//           layout: "/admin",
//           icon:<MdCategory className="h-6 w-6" />, 
//           path: "blogcategory",
//           component: <BlogCategory />,
//         },
//         {
//           name: "Blog Main",
//           layout: "/admin",
//           icon:<MdDescription className="h-6 w-6" />, 
//           path: "blogmain",
//           component: <BlogMain />,
//         },
//       ]
//     },
//     {
//       name: "CMS",
//       layout: "/admin",
//       icon: <MdCategory className="h-6 w-6" />,
//       subNav: [
//         {
//           name: "Pages",
//           layout: "/admin",
//           icon: <MdPages className="h-6 w-6" />, 
//           path: "pages",
//           component: <Pages />,
//         },
       
//         {
//           name: "Banner",
//           layout: "/admin",
//           icon: <MdImage className="h-6 w-6" />, 
//           path: "banner",
//           component: <Banner />,
//         },
       
//         {
//           name: "Faq",
//           layout: "/admin",
//           icon: <MdHelp className="h-6 w-6" />, 
//           path: "faq",
//           component: <Faq />,
//         },
//         {
//           name: "Home Page",
//           layout: "/admin",
//           icon: <MdHome className="h-6 w-6" />, 
//           path: "homepage",
//           component: <HomePage />,
//         },
//         {
//           name: "Sections",
//           layout: "/admin",
//           icon: <MdLibraryBooks  className="h-6 w-6" />, 
//           path: "sectionname",
//           component: <SectionName />,
//         },   
//       ]
//     },
//     ]
//   },
//   {
//     name: "Common",
//     layout: "/admin",
//     path: "default",
//     icon: <MdHome className="h-6 w-6" />,
//     subNav: [ {
//       name: "Stock Adjustment",
//       layout: "/admin",
//       icon: <MdStore  className="h-6 w-6" />, 
//       path: "stockadjustment",
//       component: <StockAdjustment />,
//     },
//     {
//       name: "Ratings",
//       layout: "/admin",
//       icon: <MdStar className="h-6 w-6" />, 
//       path: "rating",
//       component: <Rating />,
//     },
  
    
//     {
//       name: "Size",
//       layout: "/admin",
//       icon: <MdFormatSize className="h-6 w-6" />,
//       path: "size",
//       component: <Size />,
//     },
//     {
//       name: "Color",
//       layout: "/admin",
//       icon: <MdColorLens className="h-6 w-6" />,
//       path: "color",
//       component: <Color />,
//     },
//     { 
//       name: "Tags",
//       layout: "/admin",
//       icon: <MdTag className="h-6 w-6" />,
//       path: "tags",
//       component: <Tags />,
//     },
//     {
//       name: "Taxes",
//       layout: "/admin",
//       icon: <MdCategory className="h-6 w-6" />,
//       subNav: [
//         {
//           name: "Tax",
//           layout: "/admin",
//           icon: <MdAttachMoney className="h-6 w-6" />,
//           path: "taxs",
//           component: <Tax />,
//         },
//         {
//           name: "Group Tax",
//           layout: "/admin",
//           icon: <MdGroup className="h-6 w-6" />,
//           path: "grouptax",
//           component: <GroupTax />,
//         },
//       ]
//     },
//     {
//       name: "Enquiry",
//       layout: "/admin",
//       icon: <MdQuestionAnswer className="h-6 w-6" />, 
//       path: "enquiry",
//       component: <Enquiry />,
//     },
   
//     {
//       name: "Product Variation",
//       layout: "/admin",
//       icon: <MdViewQuilt className="h-6 w-6" />,
//       path: "productvariation",
//       component: <ProductVariation />,
//     },
//     {
//       name: "Stocks",
//       layout: "/admin",
//       icon: <MdInventory  className="h-6 w-6" />, 
//       path: "stocks",
//       component: <Stocks />,
//     },
//      {
//       name: "Settings",
//       layout: "/admin",
//       icon: <MdCategory className="h-6 w-6" />,
//       subNav: [
//         {
//           name: "Profile",
//           layout: "/admin",
//           icon: <MdPerson className="h-6 w-6" />, 
//           path: "profile",
//           component: <Profile />,
//         },
//         {
//           name: "Payment Gateway",
//           layout: "/admin",
//           icon: <MdPayment  className="h-6 w-6" />, 
//           path: "paymentgateway",
//           component: <PaymentGateway />,
//         },
//         {
//           name: "Email Configuration",
//           layout: "/admin",
//           icon: <MdSettings className="h-6 w-6" />, 
//           path: "emailconfiguration",
//           component: <EmailConfiguration />,
//         },
//         {
//           name: "Email Template",
//           layout: "/admin",
//           icon: <MdEmail className="h-6 w-6" />, 
//           path: "emailtemplate",
//           component: <EmailTemplate />,
//         },
      
//       ]
//     },
//     ]
//   },
//   // {
//   //   name: "Posts",
//   //   layout: "/admin",
//   //   icon: <MdInventory  className="h-6 w-6" />, 
//   //   path: "posts",
//   //   component: <Posts />,
//   // },
// ];
//
// export default routes;
