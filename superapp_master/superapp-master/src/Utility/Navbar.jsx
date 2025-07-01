import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Screen1 from '../Splash/Screen1';
import Screen2 from '../Splash/Screen2';
import Register from '../Auth/Register';
import OTP from '../Auth/OTP';
import SetPassword from '../Auth/SetPassword';
import Login from '../Auth/Login';
import HomeScreen from '../Pages/HomeScreen';
import HomeC from '../Clothes/Pages/HomeC';
import MenUniforms from '../Clothes/Categories/Menuniforms';
import Vegetables from '../Clothes/Categories/Vegetables';
import Fruits from '../Clothes/Categories/Fruits';
import WomenUniforms from '../Clothes/Categories/Womenuniforms';
import Fruitdetail from '../Clothes/Categories/Fruitdetail';
// import Homeappliances from '../Clothes/Categories/Homeappliances';
import Lipstick from '../Clothes/Cosmetics/Lipstick';
import WomensClothing from '../Clothes/Categories/WomensWear/womensclothing';
import Kurti from '../Clothes/Categories/WomensWear/Kurti';
import Maxidress from '../Clothes/Categories/WomensWear/Maxidress';
import Tops from '../Clothes/Categories/WomensWear/Tops';
import Leggin from '../Clothes/Categories/WomensWear/Leggin';  
import Jean from '../Clothes/Categories/WomensWear/Jean'; 
import Saree from '../Clothes/Categories/WomensWear/Saree';
import Tshirt from '../Clothes/Categories/WomensWear/Tshirt';
import Trackpantwomen from '../Clothes/Categories/WomensWear/Trackpantwomen';
import Womenfootwear from '../Clothes/Categories/WomensWear/womenfootwear';
import Womenseasonaldress from '../Clothes/Categories/WomensWear/Womenseasonaldress';
import Palazzopant from '../Clothes/Categories/WomensWear/Palazzopant';
import Cosmetic from '../Clothes/Cosmetics/Cosmetic';    
// import Login from '../Clothes/Cosmetics/login';
import Conditioner from '../Clothes/Cosmetics/Conditioner';
import Shampoo from '../Clothes/Cosmetics/Shampoo';
import Sunscreen from '../Clothes/Cosmetics/Sunscreen';
import Primer from '../Clothes/Cosmetics/Primer';
import Foundation from '../Clothes/Cosmetics/Foundation';
import Luxury from '../Clothes/Cosmetics/Luxury';
import Eyeshadow from '../Clothes/Cosmetics/Eyeshadow';
// import ProductDetail from '../Clothes/Cosmetics/Productdetail';
import CompactPowder from '../Clothes/Cosmetics/Compactpowder';
import Kajal from '../Clothes/Cosmetics/Kajal';
import Highlighter from '../Clothes/Cosmetics/Highlighter';
import Settingspray from '../Clothes/Cosmetics/Settingspray';
// import EyeLinear from '../Clothes/Cosmetics/Eyelinear';
// import Cosmetics from '../Clothes/Categories/Cosmetics';
import Mascara from '../Clothes/Cosmetics/Mascara';
import DetailPage from '../Clothes/Pages/DetailPage';
import SingleProductPage from '../Clothes/Pages/SingleProductPage';
import Address from '../Clothes/Pages/Address';
import ProductDetails from '../Clothes/Pages/ProductDetails';
import Payment from '../Clothes/Pages/Payment';
import OrderPlaced from '../Clothes/Pages/OrderPlaced';
import Myorders from '../Clothes/Pages/Myorders';
import MyordersFilter from '../Clothes/Pages/MyOrdersFilter';
import Cart from '../Clothes/Pages/Cart';
import Account from '../Clothes/Pages/Account';
import Categories from '../Clothes/Pages/Categories';
import Profile from '../Clothes/Pages/Profile';
import Wishlist from '../Clothes/Pages/Wishlist';
import Settings from '../Clothes/Pages/Settings';
import Notification from '../Clothes/Pages/Notification';
import TermsConditions from '../Clothes/Pages/TermsConditions';
import PrivacyPolicy from '../Clothes/Pages/PrivacyPolicy';
import About from '../Clothes/Pages/About';
import AllAddresses from '../Clothes/Pages/AllAddresses';
import EditAllAddress from '../Clothes/Pages/EditAllAddress';
import HomeScreenF from '../FoodDilvery/PagesF/HomeScreenF';
import DetailPageF from '../FoodDilvery/PagesF/DetailPageF';
import SingleProductFood from '../FoodDilvery/PagesF/SingleProductFood';
import CartFood from '../FoodDilvery/PagesF/CartFood';
import ChooseAddressFood from '../FoodDilvery/PagesF/ChooseAddressFood';
import AddDilveryAddressFood from '../FoodDilvery/PagesF/AddDilveryAddressFood';
import ProductDetailsFood from '../FoodDilvery/PagesF/ProductDetailsFood';
import PaymentFood from '../FoodDilvery/PagesF/PaymentFood';
import OrderPlacedFood from '../FoodDilvery/PagesF/OrderPlacedFood';
import OrdersHistoryFood from '../FoodDilvery/PagesF/OrdersHistoryFood';
import AccountFood from '../FoodDilvery/PagesF/AccountFood';
import TrackOrderFood from '../FoodDilvery/PagesF/TrackOrderFood';
import CustomerProfileFood from '../FoodDilvery/PagesF/CustomerprofileFood';
import EditOptionforalladdresses from '../FoodDilvery/PagesF/EditOptionforalladdresses';
import SettingsFood from '../FoodDilvery/PagesF/SettingsFood';
import AboutFood from '../FoodDilvery/PagesF/AboutFood';
import TermsConditionFood from '../FoodDilvery/PagesF/TermsConditionFood';
import PrivacyPolicyFood from '../FoodDilvery/PagesF/PrivacyPolicyFood';
import NotificationFood from '../FoodDilvery/PagesF/NotificationFood';
import CategoriesFood from '../FoodDilvery/PagesF/CategoriesFood';
import EditDilveryAddressFood from '../FoodDilvery/PagesF/EditDilveryAddressFood';
import EditAddressValues from '../Clothes/Pages/EditAddressValues';
import HomeScreenTaxi from '../TaxiApp/PagesTaxi/HomeScreenTaxi';
import LocationSrcDes from '../TaxiApp/PagesTaxi/LocationSrcDes';
import SettingsTaxi from '../TaxiApp/PagesTaxi/SettingsTaxi';
import AccountTaxi from '../TaxiApp/PagesTaxi/AccountTaxi';
import ProfileTaxi from '../TaxiApp/PagesTaxi/ProfileTaxi';
import NotificationTaxi from '../TaxiApp/PagesTaxi/NotificationTaxi';
import TermsConditionsTaxi from '../TaxiApp/PagesTaxi/TermsConditionsTaxi';
import PrivacyTaxi from '../TaxiApp/PagesTaxi/PrivacyTaxi';
import AboutTaxi from '../TaxiApp/PagesTaxi/AboutTaxi';
import PaymentTaxi from '../TaxiApp/PagesTaxi/PaymentTaxi';
import MyRidesTaxi from '../TaxiApp/PagesTaxi/MyRidesTaxi';
import HomeH from '../HotelModule/PagesHotel/HomeH';
import ParticularHotelDetails from '../HotelModule/PagesHotel/ParticularHotelDetails';
import ReviewSummary from '../HotelModule/PagesHotel/ReviewSummary';
import Rooms from '../HotelModule/PagesHotel/Rooms';
import Favourites from '../HotelModule/PagesHotel/Favoutires';
import RestaurentPageCategory from '../FoodDilvery/PagesF/RestaurentPageCategory';
import DishesListBasedOnCategory from '../FoodDilvery/PagesF/DishesListBasedOnCategory';
// import HomeAppliances from '../Clothes/Categories/Homeappliances';
import Appliances from '../Clothes/Categories/Homeappliances/Appliances';
import Refrigerator from '../Clothes/Categories/Homeappliances/Refrigerator';
import Singledoor from '../Clothes/Categories/Homeappliances/Singledoor';
import Doubledoor from '../Clothes/Categories/Homeappliances/Doubledoor';
import Minifridge from '../Clothes/Categories/Homeappliances/Minifridge';


function Navbar() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Screen1 />} />
                <Route path='/step' element={<Screen2 />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/otp' element={<OTP />} />
                <Route path='/set-password' element={<SetPassword />} />
                <Route path='/home' element={<HomeScreen />} />

                {/* Clothes */}
                <Route path='/home-clothes' element={<HomeC />} />
                <Route path='/home-clothes/detail-page' element={<DetailPage />} />
                <Route path='/home-clothes/single-product-page' element={<SingleProductPage />} />
                <Route path='/home-clothes/address' element={<Address />} />
                <Route path='/home-clothes/all-addresses' element={<AllAddresses />} />
                <Route path='/home-clothes/edit-all-addresses' element={<EditAllAddress />} />
                <Route path='/home-clothes/edit-address-values' element={<EditAddressValues />} />
                <Route path='/home-clothes/product-detail' element={<ProductDetails />} />
                <Route path='/home-clothes/payment' element={<Payment />} />
                <Route path='/home-clothes/order' element={<OrderPlaced />} />
                <Route path='/home-clothes/order-list' element={<Myorders />} />
                <Route path='/home-clothes/order-list-filter' element={<MyordersFilter />} />
                <Route path='/home-clothes/cart' element={<Cart />} />
                <Route path='/home-clothes/account' element={<Account />} />
                <Route path='/home-clothes/categories' element={<Categories />} />
                <Route path='/home-clothes/profile' element={<Profile />} />
                <Route path='/home-clothes/wishlist' element={<Wishlist />} />
                <Route path='/home-clothes/settings' element={<Settings />} />
                <Route path='/home-clothes/notification' element={<Notification />} />
                <Route path='/home-clothes/terms-conditions' element={<TermsConditions />} />
                <Route path='/home-clothes/privacy-policy' element={<PrivacyPolicy />} />
                <Route path='/home-clothes/about' element={<About />} />
                <Route path='/Categories/men-uniforms' element={<MenUniforms/>}/>
                <Route path='/categories/vegetables' element={<Vegetables/>}/>
                <Route path='/categories/women-uniforms' element={<WomenUniforms />} />
                <Route path='/categories/fruits' element={<Fruits/>}/>
                {/* <Route path='/categories/cosmetics' element={<Cosmetics/>}/>                         */} 
                <Route path='/categories/fruitdetail' element={<Fruitdetail/>}/>
                {/* <Route path='categories/homeappliances' element={<Homeappliances/>}/> */}
                 <Route path ='categories/cosmetics' element={<Cosmetic/>}/>        
                <Route path ='cosmetics/lipstick' element={<Lipstick/>}/>  
                  <Route path ='cosmetics/foundation' element={<Foundation/>}/>
                  <Route path ='cosmetics/primer' element={<Primer/>}/>
                 <Route path ='cosmetics/sunscreen' element={<Sunscreen/>}/> 
                 <Route path ='cosmetics/shampoo' element ={<Shampoo/>}/> 
                 <Route path ='cosmetics/conditioner' element={<Conditioner/>}/> 
                 <Route path ='cosmetics/luxury' element={<Luxury/>}/>
                 <Route path ='cosmetics/eyeshadow' element={<Eyeshadow/>}/>
                 <Route path ='cosmetics/compactpowder' element={<CompactPowder/>}/>
                 <Route path ='cosmetics/kajal' element={<Kajal/>}/>
                 <Route path ='cosmetics/settingspray' element={<Settingspray/>}/>
                 <Route path ='cosmetics/highlighter' element={<Highlighter/>}/>
                 {/* <Route path ='/cosmetics/eyelinear' element={<EyeLinear/>}/> */}
                 <Route path ='cosmetics/mascara' element={<Mascara/>}/>
                 {/* <Route path ='cosmetics/productdetail' element={<ProductDetail/>}/> */}
                  <Route path='/categories' element={<Categories />} />
                <Route path='/categories/womens-wear' element={<WomensClothing/>} /> 
                {/* <Route path= '/categories/womens-wear/kurti' element={<Kurti/>}/> */}
                 {/* <Route path='cosmetics/womens-wear' element={<Womenswear/>}/> */}
                  <Route path ='/categories/womens-wear/kurti' element={<Kurti/>}/>  
                  <Route path ='/categories/womens-wear/tops' element={<Tops/>}/>   
                  <Route path = '/categories/womens-wear/maxidress' element={<Maxidress/>}/> 
                  <Route path ='/categories/womens-wear/leggin' element={<Leggin/>}/>
                  <Route path ='/categories/womens-wear/jean' element={<Jean/>}/ >   
                  <Route path = '/categories/womens-wear/saree' element={<Saree/>}/>   
                  <Route path = '/categories/womens-wear/tshirt' element={<Tshirt/>}/>  
                  <Route path = '/categories/womens-wear/trackpantwomen' element={<Trackpantwomen/>}/>  
                  <Route path = '/categories/womens-wear/womenfootwear' element={<Womenfootwear/>}/> 
                  <Route path = '/categories/womens-wear/womenseasonaldress' element={<Womenseasonaldress/>}/> 
                  <Route path ='/categories/womens-wear/palazzopant' element={<Palazzopant/>}/>
                  <Route path ='/categories/home-appliances' element={<Appliances/>}/>
                  {/* <Route path ='/categories/home-appliances/appliances ' element={<Appliances/>}/> */}
                  <Route path ='/categories/home-appliances/refrigerator' element={<Refrigerator/>}/>
                  <Route path ='/categories/home-appliances/singledoor' element={<Singledoor/>}/>
                  <Route path ='/categories/home-appliances/doubledoor' element={<Doubledoor/>}/>
                  <Route path ='/categories/home-appliances/minifridge' element={<Minifridge/>}/>
                  

                
                {/* Food */}
                <Route path='/home-food' element={<HomeScreenF />} />
                <Route path='/home-food/detail-page' element={<DetailPageF />} />
                <Route path='/home-food/restaurent-list-based-on-category/:restaurentCategoryName' element={<RestaurentPageCategory />} />
                <Route path='/home-food/single-product-details/:vendorId' element={<SingleProductFood />} />
                <Route path='/home-food/dishes-list-based-on-category-and-hotel/:vendorId/:restaurentCategoryName' element={<DishesListBasedOnCategory />} />
                <Route path='/home-food/cart' element={<CartFood />} />
                <Route path='/home-food/choose-address' element={<ChooseAddressFood />} />
                <Route path='/home-food/add-address' element={<AddDilveryAddressFood />} />
                <Route path='/home-food/product-details' element={<ProductDetailsFood />} />
                <Route path='/home-food/payment-type' element={<PaymentFood />} />
                <Route path='/home-food/order-placed' element={<OrderPlacedFood />} />
                <Route path='/home-food/orders-history' element={<OrdersHistoryFood />} />
                <Route path='/home-food/account' element={<AccountFood />} />
                <Route path='/home-food/food-order-tracking' element={<TrackOrderFood />} />
                <Route path='/home-food/customerProfile-details' element={<CustomerProfileFood />} />
                <Route path='/home-food/edit-option-all-address' element={<EditOptionforalladdresses />} />
                <Route path='/home-food/settings' element={<SettingsFood />} />
                <Route path='/home-food/about' element={<AboutFood />} />
                <Route path='/home-food/terms-conditions' element={<TermsConditionFood />} />
                <Route path='/home-food/privacy' element={<PrivacyPolicyFood />} />
                <Route path='/home-food/notification' element={<NotificationFood />} />
                <Route path='/home-food/categories' element={<CategoriesFood />} />
                <Route path='/home-food/edit-dilvery-address' element={<EditDilveryAddressFood />} />

                {/* taxi */}
                <Route path='/home-taxi' element={<HomeScreenTaxi />} />
                <Route path='/home-taxi/src-dest' element={<LocationSrcDes />} />
                <Route path='/home-taxi/settings' element={<SettingsTaxi />} />
                <Route path='/home-taxi/account' element={<AccountTaxi />} />
                <Route path='/home-taxi/profile' element={<ProfileTaxi />} />
                <Route path='/home-taxi/notification' element={<NotificationTaxi />} />
                <Route path='/home-taxi/terms-conditions' element={<TermsConditionsTaxi />} />
                <Route path='/home-taxi/privacy' element={<PrivacyTaxi />} />
                <Route path='/home-taxi/about' element={<AboutTaxi />} />
                <Route path='/home-taxi/payment' element={<PaymentTaxi />} />
                <Route path='/home-taxi/my-rides' element={<MyRidesTaxi />} />

                {/* Hotel room */}
                <Route path='/home-hotel' element={<HomeH />} />
                <Route path='/home-hotel/particular-hotel-details' element={<ParticularHotelDetails />} />
                <Route path='/home-hotel/review-summary' element={<ReviewSummary />} />
                <Route path='/home-hotel/total-rooms' element={<Rooms />} />
                <Route path='/home-hotel/favourite' element={<Favourites />} />
            </Routes>
        </BrowserRouter>
    )
}
export default Navbar;