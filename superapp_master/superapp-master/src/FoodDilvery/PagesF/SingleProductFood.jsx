import React, { useState, useEffect } from 'react';
import search from "../../Icons/search.svg";
import cross from "../../Icons/close-circle.svg";
import mic from "../../Icons/Mic.svg";
import shirt from "../ImagesF/noodles.svg";
import star from "../../Icons/Star.svg";
import HeaderInsideFood from '../ComponentsF/HeaderInsideFood';
import FooterFood from '../ComponentsF/FooterFood';
import banner1 from "../../Images/HomeScreen/banner1.svg";
import banner2 from "../../Images/HomeScreen/banner2.svg";
import banner3 from "../../Images/HomeScreen/banner3.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


const filters = {
  price: ["Under 500 - 1000", "2000 - 3000", "4000 - 6000", "8000 - 12000"],
  offers: ["20% Offer", "35% Offer", "50% Offer"],
  categories: ["Cotton", "Normal Fabric"],
  discount: ["20%", "35%", "50%"],
  colors: ["Green", "Red"]
};

function SingleProductFood() {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilters = () => setShowFilters(!showFilters);

  const applyFilters = (filters) => {
    setSelectedFilters(filters);
    setShowFilters(false);
  };

  const removeFilter = (filterToRemove) => {
    setSelectedFilters(selectedFilters.filter(filter => filter !== filterToRemove));
  };

  const [loading, setLoading] = useState(true);

  const [openIndex, setOpenIndex] = useState(0);

  const toggleCard = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const [quantity, setQuantity] = useState(0);

  const handleAdd = (variation) => {
    setSelectedProduct(variation);
    setFinalPrice(variation.sales_price);
    setSelectedToppings([]);
    setShowPopup(true);
  }
  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => {
    if (quantity === 1) {
      setQuantity(0); // If it goes to 0, hide counter and show "Add" again
    } else {
      setQuantity(prev => prev - 1);
    }
  };

  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);

  const handleToppingToggle = (topping) => {
    const isSelected = selectedToppings.includes(topping.id);

    const updatedToppings = isSelected
      ? selectedToppings.filter((id) => id !== topping.id)
      : [...selectedToppings, topping.id];

    setSelectedToppings(updatedToppings);

    const totalToppingPrice = selectedProduct.toppings
      .filter((t) => updatedToppings.includes(t.id))
      .reduce((sum, t) => sum + Number(t.price || 0), 0); // ✅ Make sure price is a number

    const basePrice = Number(selectedProduct?.sales_price || 0); // ✅ Make sure base price is a number
    setFinalPrice(basePrice + totalToppingPrice);
  };


  const [alldishes, setAllDishes] = useState([]);
  useEffect(() => {
    const getAllDishes = async () => {
      try {
        const response = await axios.get(`https://yrpitsolutions.com/ecom_backend/api/get-all-restaurants-by-vendor-id/${vendorId}`);
        setAllDishes(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    getAllDishes();
  }, []);




  return (
    <div className='min-h-screen'>
      <HeaderInsideFood />
      <div className='mt-24 pb-32 px-4'>

        <div className="flex justify-between items-center w-full mt-2">
          <div className="font-medium text-base">{alldishes?.vendor?.firm_name}</div>
          <div className="flex items-center">
            <img src={star} alt="Star" className="w-4 h-4" />
            <span className="ml-1 text-[#242424] text-base font-medium">{alldishes?.vendor?.average_rating}</span>
          </div>
        </div>

        <div className="w-full">
          <Swiper
            spaceBetween={16}
            slidesPerView="auto"
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            className="!py-2 w-full"
          >
            {alldishes?.vendor?.images?.map((imageUrl, index) => (
              <SwiperSlide key={index} className="!w-full">
                <div className="flex flex-col items-center w-full h-[140px] rounded-2xl shadow-md cursor-pointer overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`banner_image`}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="text-center font-medium text-base">Menu</div>

        <div className="flex justify-center mt-2 items-center bg-white">
          <div className="relative w-full max-w-md">
            <img
              src={search}
              alt="search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-7 h-7"
            />
            <input
              type="text"
              placeholder="What do you want.."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF]"
            />
            <img
              src={mic}
              alt="mic"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-7 h-7"
            />
          </div>

          <button onClick={toggleFilters} className="ml-4 px-4 py-2 bg-[#5C3FFF] text-white rounded-full flex items-center">
            Filters
            {selectedFilters.length > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 border border-white rounded-full text-xs font-bold ml-2">
                {selectedFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Selected Filters Display */}
        <div className="overflow-x-auto whitespace-nowrap mt-2 mb-3">
          <div className="flex gap-2">
            {selectedFilters.map((filter, index) => (
              <span
                key={index}
                className="text-[#484848] text-xs px-3 py-2 bg-[#F7F5FF] border border-[#5C3FFF] rounded-full cursor-pointer inline-block"
                onClick={() => removeFilter(filter)}
              >
                {filter} ✕
              </span>
            ))}
          </div>
        </div>

        {/* <div className="font-medium text-base">{alldishes?.vendor?.firm_name}</div> */}

        {alldishes?.data?.map((dish, index) => (
          <div
            key={index}
            className="bg-white border border-[#E1E1E1] rounded-[20px] mt-4 p-4"
          >
            {/* Header acting as dropdown toggle */}
            <div
              className="flex items-center justify-between gap-4 cursor-pointer"
              onClick={() => toggleCard(index)}
            >
              <p className="font-semibold text-lg text-[#242424]">
                {dish.product_name}
              </p>
              <span>{openIndex === index ? "▲" : "▼"}</span>
            </div>

            {/* Collapsible body */}
            {openIndex === index && (
              <div className="mt-4 space-y-3">
                {dish.variations?.map((variation, vIndex) => (
                  <div
                    key={vIndex}
                    className="flex flex-col border border-[#E1E1E1] rounded-[15px] p-3 bg-[#FAFAFA]"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={variation.images[0]}
                        alt={variation.product_variation_name}
                        className="w-[80px] h-[80px] rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#242424]">
                          {variation.product_variation_name}
                        </p>
                        <p className="text-sm font-semibold text-[#242424] mt-2">
                          ₹ {variation.sales_price}{" "}
                          <span className="line-through text-[#C1C1C1]">
                            ₹ {variation.purchase_price}
                          </span>
                        </p>

                        {quantity === 0 ? (
                          <button
                            className="mt-2 px-4 py-1  text-green-500  border rounded-full"
                            onClick={() => handleAdd(variation)}

                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 mt-2 border rounded-full">
                            <button
                              className="px-2 py-1 text-green-500"
                              onClick={handleDecrement}
                            >
                              −
                            </button>
                            <span className="text-green-500 font-semibold">{quantity}</span>
                            <button
                              className="px-2 py-1 text-green-500"
                              onClick={handleIncrement}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-[#6B6B6B] mt-3">
                      {variation.description}
                    </p>
                  </div>
                ))}
              </div>

            )}
          </div>
        ))}

      </div>
      <FooterFood />

      {/* Filter Modal */}
      {showFilters && <FilterModal onClose={toggleFilters} onApply={applyFilters} />}

      {showPopup && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          {/* Modal content */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-2xl p-4 shadow-lg z-50">
            {/* Close button with minimal width */}
            <button
              className="absolute -top-12 right-4 text-black text-2xl font-bold bg-white rounded-full px-3 py-1 shadow"
              onClick={() => setShowPopup(false)}
            >
              ✕
            </button>
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={selectedProduct?.images[0]}
                alt="Product Image"
                className="h-8 w-8 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold">
                {`${selectedProduct?.product_category_name} (${selectedProduct?.product_variation_name})`}
              </h3>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto ">
              {selectedProduct?.toppings?.map((topping) => (
                <div key={topping.id} className="flex justify-between items-center border p-2 rounded-full">
                  <span>{topping.name}</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">₹ {topping.price}</span>
                      <input
                        type="checkbox"
                        checked={selectedToppings.includes(topping.id)}
                        onChange={() => handleToppingToggle(topping)}
                        aria-label={`Select ${topping.name}`}
                      />
                    </label>

                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-md font-semibold">Total: ₹ {finalPrice}</p>
              <button
                className="bg-[#5C3FFF] text-white px-4 py-2 rounded-xl"
                onClick={() => {
                  setShowPopup(false);
                  navigate("/cart");
                }}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}




    </div>
  )
}

// filters
function FilterModal({ onClose, onApply }) {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end">
      <div className="bg-[#F8F8F8] w-full p-6 rounded-t-[30px] max-h-[75vh] flex flex-col relative">

        {/* 🔹 Fixed Header */}
        <div className="sticky top-0 left-0 right-0 bg-[#F8F8F8] z-10 flex justify-between items-center">
          <h2 className="text-sm py-3 font-medium bg-[#5C3FFF] rounded-[60px] px-8 text-white">
            Filters
          </h2>
          <img onClick={onClose} src={cross} alt="Close" className="cursor-pointer w-5 h-5" />
        </div>

        {/* 🔹 Scrollable Filter Options */}
        <div className="flex-1 overflow-auto mt-4 mb-12">
          {Object.entries(filters).map(([category, options]) => (
            <div key={category} className="mb-4">
              <h3 className="font-medium text-lg mt-4 text-[#242424]">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {options.map((option) => (
                  <button
                    key={option}
                    className={`text-xs px-3 py-1 rounded-full border ${selectedFilters.includes(option) ? 'bg-[#5C3FFF] text-white' : 'bg-[#F8F8F8] border-[#CCCCCC] text-[#484848]'
                      }`}
                    onClick={() => toggleFilter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 🔹 Fixed Bottom Buttons */}
        <div className="sticky bottom-16 left-0 right-0 bg-white flex flex-col gap-2 mt-6">
          <button
            onClick={() => onApply(selectedFilters)}
            className="w-full px-4 py-2 bg-[#5C3FFF] text-white rounded-[50px]"
          >
            Apply
          </button>
          <button
            onClick={() => setSelectedFilters([])}
            className="text-[#242424] w-full px-4 py-2 border rounded-[50px] bg-[#EEEAFF]"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProductFood;