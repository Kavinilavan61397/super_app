import React, { useState, useEffect } from 'react';
import Footer from '../SubPages/Footer';
import Header from '../SubPages/Header';
import { FaFilter, FaSortAmountUp, FaSortAmountDown, FaHeart, FaEye, FaStar, FaSearch, FaChevronUp, FaChevronDown, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';

// -------------------------------------
// Image Imports for Grocery Categories
// -------------------------------------

// --- Fruits & Vegetables Images ---
import broccoliImage from '../Images/broccoli.jpg';
import carrotImage from '../Images/Carrot.jpg';
import spinachImage from '../Images/spinach.jpg';
import tomatoImage from '../Images/tomato.jpg';
import potatoImage from '../Images/potatoe.jpg';
import onionImage from '../Images/onion.jpg';
import cucumberImage from '../Images/cucumber.jpg';
import bellpepperImage from '../Images/bellpeper.jpg';
import appleImage from '../Images/apple.jpg';
import bananaImage from '../Images/Banana.jpg';
import orangeImage from '../Images/orange.jpg';
import mangoImage from '../Images/mango.jpg';


// --- Dairy & Bakery Images ---
import milkImage from '../Images/milk.webp';
import cheeseImage from '../Images/cheese.jpg';
import yogurtImage from '../Images/yogurt.webp';
import butterImage from '../Images/butter.webp';
import paneerImage from '../Images/paneer.webp';
import curdImage from '../Images/curd.jpeg';
import creamImage from '../Images/cream.webp';
import breadImage from '../Images/bread.png';
import eggImage from '../Images/egg.png';
import pastryImage from '../Images/pastry.png';
import cakeImage from '../Images/cake.png';
import muffinImage from '../Images/muffin.png';

// --- Snacks & Dry Fruits Images ---
import chipsImage from '../Images/potato_chips.png';
import cookiesImage from '../Images/cookies.png';
import chocolateImage from '../Images/chocolate.webp';
import namkeenImage from '../Images/namkeen.jpg';
import biscuitsImage from '../Images/biscuits.png';
import dryFruitsImage from '../Images/dry_fruits.webp';
import tortillaChipsImage from '../Images/tortilla_chips.png';
import chocolateCookiesImage from '../Images/chocolate_cookies.png';
import karaBoondyImage from '../Images/kara_boondy.png';
import creamBiscuitsImage from '../Images/cream_biscuits.png';
import digestiveBiscuitsImage from '../Images/digestive_biscuits.png';


// --- Breakfast & More Images ---
import oatmealImage from '../Images/oatmeal.png';
import cornflakesImage from '../Images/cornflakes.png';
import muesliImage from '../Images/muesli.png';
import granolaImage from '../Images/granola.png';
import cerealImage from '../Images/cereal.png';
import pancakesMixImage from '../Images/pancakes_mix.png';
import honeyImage from '../Images/honey.png';
import jamImage from '../Images/jam.png';
import wafflesImage from '../Images/waffles.png';
import mapleSyrupImage from '../Images/maple_syrup.png';
import coffeeBeansImage from '../Images/coffee_beans.png';
import teaBagsImage from '../Images/tea_bags.png';

// --- Eggs, Meat & Fish Images ---
import chickenBreastImage from '../Images/chicken_breast.png';
import muttonImage from '../Images/mutton.png';
import fishFilletImage from '../Images/fish_fillet.png';
import prawnsImage from '../Images/prawns.png';
import chickenCurryCutImage from '../Images/chicken_curry_cut.png';
import chickenMinceImage from '../Images/chicken_mince.png';
import fishSteakImage from '../Images/fish_steak.png';
import chickenWingsImage from '../Images/chicken_wings.png';  

// --- Masalas, Oils & Dry Fruits Images ---
import garamMasalaImage from '../Images/garam_masala.png';
import oliveOilImage from '../Images/olive_oil.png';
import turmericPowderImage from '../Images/turmeric_powder.png';
import coconutOilImage from '../Images/coconut_oil.png';
import almondImage from '../Images/almond.png';
import redChilliPowderImage from '../Images/red_chilli_powder.png';
import cashewImage from '../Images/cashew.png';
import cuminPowderImage from '../Images/cumin_powder.png';
import raisinsImage from '../Images/raisins.png';

// --- Atta, Rice, Dals & Sugar Images ---
import riceImage from '../Images/rice.png';
import basmatiRiceImage from '../Images/basmati_rice.png';
import toorDalImage from '../Images/toor_dal.png';
import sugarImage from '../Images/sugar.png';
import moongDalImage from '../Images/moong_dal.png';
import multigrainAttaImage from '../Images/multigrain_atta.png';
import jaggeryImage from '../Images/jaggery.png';
import saltImage from '../Images/salt.png';
import brownSugarImage from '../Images/brown_sugar.png';

// --- Hot & Cold Beverages Images ---
import greenTeaImage from '../Images/green_tea.png';
import coffeeImage from '../Images/coffee.png';
import juiceImage from '../Images/juice.png';
import energyDrinkImage from '../Images/energy_drink.png';
import blackTeaImage from '../Images/black_tea.png';
import lemonadeImage from '../Images/lemonade.png';
import cappuccinoImage from '../Images/cappuccino.png';
import smoothieImage from '../Images/smoothie.png';

// --- Instant & Frozen Foods Images ---
import noodlesImage from '../Images/noodles.png';
import readyMealsImage from '../Images/ready_meals.png';
import frozenSnacksImage from '../Images/frozen_snacks.png';
import pastaImage from '../Images/pasta.png';
import soupsImage from '../Images/soups.png';
import frozenParathasImage from '../Images/frozen_parathas.png';
import frozenMealsImage from '../Images/frozen_meals.png';

// --- Chocolates & Ice Creams Images ---
import vanillaIceCreamImage from '../Images/vanilla_ice_cream.png';
import trufflesImage from '../Images/truffles.png';
import strawberryIceCreamImage from '../Images/strawberry_ice_cream.png';
import chocolateIceCreamImage from '../Images/chocolate_ice_cream.png';
import assortedChocolatesImage from '../Images/assorted_chocolates.png';
import mintIceCreamImage from '../Images/mint_ice_cream.png';
import whiteChocolateImage from '../Images/white_chocolate.png';
import chocolateBarsImage from '../Images/chocolate_bars.png';
import darkChocolateImage from '../Images/dark_chocolate.png';

// Default placeholder image for items without specific images
const defaultImage = 'https://via.placeholder.com/300x200?text=Image+Coming+Soon';


// Fruits & Vegetables
const fruitsAndVegetables = [
  { id: 1, name: 'Broccoli', originalPrice: 100, discountedPrice: 80, image: broccoliImage, description: 'Fresh green broccoli, rich in vitamins.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits & Vegetables' },
  { id: 2, name: 'Apple', originalPrice: 200, discountedPrice: 150, image: appleImage, description: 'Fresh red apples, perfect for snacking.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits & Vegetables' },
  { id: 3, name: 'Carrot', originalPrice: 60, discountedPrice: 50, image: carrotImage, description: 'Crunchy orange carrots, perfect for salads.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Fruits & Vegetables' },
  { id: 4, name: 'Banana', originalPrice: 80, discountedPrice: 60, image: bananaImage, description: 'Ripe yellow bananas, great for smoothies.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Fruits & Vegetables' },
  { id: 5, name: 'Tomato', originalPrice: 50, discountedPrice: 45, image: tomatoImage, description: 'Red ripe tomatoes, great for sauces.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits & Vegetables' },
  { id: 6, name: 'Spinach', originalPrice: 70, discountedPrice: 60, image: spinachImage, description: 'Fresh spinach leaves, high in iron.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Fruits & Vegetables' },
  { id: 7, name: 'Potato', originalPrice: 40, discountedPrice: 35, image: potatoImage, description: 'Versatile potatoes, good for all dishes.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Fruits & Vegetables' },
  { id: 8, name: 'Onion', originalPrice: 50, discountedPrice: 40, image: onionImage, description: 'Pungent onions, essential for cooking.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Fruits & Vegetables' },
  { id: 9, name: 'Cucumber', originalPrice: 30, discountedPrice: 25, image: cucumberImage, description: 'Crisp cucumbers, refreshing for salads.', rating: 4.2, isBestSeller: true, quantity: 1, category: 'Fruits & Vegetables' },
  { id: 10, name: 'Bell Pepper', originalPrice: 90, discountedPrice: 75, image: bellpepperImage, description: 'Colorful bell peppers, sweet and crunchy.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Fruits & Vegetables' },
  { id: 11, name: 'Mango', originalPrice: 250, discountedPrice: 220, image: mangoImage, description: 'Sweet and juicy mangoes, seasonal delight.', rating: 4.7, isBestSeller: true, quantity: 1, category: 'Fruits & Vegetables' },
  { id: 12, name: 'Orange', originalPrice: 120, discountedPrice: 100, image: orangeImage, description: 'Citrusy oranges, rich in Vitamin C.', rating: 4.4, isBestSeller: false, quantity: 1, category: 'Fruits & Vegetables' },
];

// Bakery, Cakes & Dairy
const bakeryCakesDairy = [
  { id: 1, name: 'Milk', originalPrice: 60, discountedPrice: 55, image: milkImage, description: 'Fresh cow milk, pasteurized and homogenized.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Bakery, Cakes & Dairy' },
  { id: 2, name: 'Cheese Block', originalPrice: 300, discountedPrice: 280, image: cheeseImage, description: 'Cheddar cheese block, perfect for sandwiches.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Bakery, Cakes & Dairy' },
  { id: 3, name: 'Yogurt', originalPrice: 40, discountedPrice: 35, image: yogurtImage, description: 'Plain yogurt, rich in probiotics.', rating: 4.0, isBestSeller: true, quantity: 1, category: 'Bakery, Cakes & Dairy' },
  { id: 4, name: 'Butter', originalPrice: 120, discountedPrice: 110, image: butterImage, description: 'Unsalted butter, great for cooking and baking.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Bakery, Cakes & Dairy' },
  { id: 5, name: 'Paneer', originalPrice: 200, discountedPrice: 180, image: paneerImage, description: 'Fresh homemade paneer, soft and creamy.', rating: 4.7, isBestSeller: false, quantity: 1, category: 'Bakery, Cakes & Dairy' },
  { id: 6, name: 'Curd', originalPrice: 50, discountedPrice: 45, image: curdImage, description: 'Homemade curd, rich and creamy.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Bakery, Cakes & Dairy' },
  { id: 7, name: 'Bread', originalPrice: 40, discountedPrice: 35, image: breadImage, description: 'Freshly baked bread, soft and delicious.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Bakery, Cakes & Dairy' },
  { id: 8, name: 'Eggs', originalPrice: 120, discountedPrice: 100, image: eggImage, description: 'Farm fresh eggs, rich in protein.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Bakery, Cakes & Dairy' },
  { id: 9, name: 'Cream', originalPrice: 80, discountedPrice: 70, image: creamImage, description: 'Thick fresh cream, perfect for desserts.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Bakery, Cakes & Dairy' },
  { id: 10, name: 'Pastries', originalPrice: 150, discountedPrice: 130, image: pastryImage, description: 'Assorted pastries, sweet treats.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Bakery, Cakes & Dairy' },
  { id: 11, name: 'Cake', originalPrice: 400, discountedPrice: 350, image: cakeImage, description: 'Freshly baked cake.', rating: 4.6, isBestSeller: false, quantity: 1, category: 'Bakery, Cakes & Dairy' },
  { id: 12, name: 'Muffins', originalPrice: 70, discountedPrice: 60, image: muffinImage, description: 'Delicious chocolate muffins.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Bakery, Cakes & Dairy' },
];

// Breakfast & More
const breakfastAndMore = [
  { id: 1, name: 'Oatmeal', originalPrice: 150, discountedPrice: 130, image: oatmealImage, description: 'Healthy breakfast option, rich in fiber.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Breakfast & More' },
  { id: 2, name: 'Corn Flakes', originalPrice: 200, discountedPrice: 180, image: cornflakesImage, description: 'Crispy corn flakes, perfect with milk.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Breakfast & More' },
  { id: 3, name: 'Muesli', originalPrice: 250, discountedPrice: 220, image: muesliImage, description: 'Nutritious muesli with dried fruits.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Breakfast & More' },
  { id: 4, name: 'Granola', originalPrice: 180, discountedPrice: 160, image: granolaImage, description: 'Crunchy granola with nuts and honey.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Breakfast & More' },
  { id: 5, name: 'Cereal', originalPrice: 220, discountedPrice: 200, image: cerealImage, description: 'Mixed grain cereal, healthy breakfast choice.', rating: 4.1, isBestSeller: true, quantity: 1, category: 'Breakfast & More' },
  { id: 6, name: 'Pancakes Mix', originalPrice: 120, discountedPrice: 100, image: pancakesMixImage, description: 'Ready mix for fluffy pancakes.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Breakfast & More' },
  { id: 7, name: 'Honey', originalPrice: 180, discountedPrice: 160, image: honeyImage, description: 'Pure natural honey.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Breakfast & More' },
  { id: 8, name: 'Jam', originalPrice: 90, discountedPrice: 80, image: jamImage, description: 'Sweet fruit jam.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Breakfast & More' },
  { id: 9, name: 'Waffles', originalPrice: 100, discountedPrice: 90, image: wafflesImage, description: 'Crispy waffles, perfect with syrup.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Breakfast & More' },
  { id: 10, name: 'Maple Syrup', originalPrice: 160, discountedPrice: 140, image: mapleSyrupImage, description: 'Pure maple syrup.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Breakfast & More' },
  { id: 11, name: 'Coffee Beans', originalPrice: 280, discountedPrice: 250, image: coffeeBeansImage, description: 'Freshly roasted coffee beans.', rating: 4.6, isBestSeller: false, quantity: 1, category: 'Breakfast & More' },
  { id: 12, name: 'Tea Bags', originalPrice: 120, discounted: 100, image: teaBagsImage, description: 'Assorted tea bags.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Breakfast & More' },
];

// Eggs, Meat & Fish
const eggsMeatFish = [
  { id: 1, name: 'Chicken Breast', originalPrice: 300, discountedPrice: 280, image: chickenBreastImage, description: 'Fresh boneless chicken breast.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Eggs, Meat & Fish' },
  { id: 2, name: 'Mutton', originalPrice: 600, discountedPrice: 550, image: muttonImage, description: 'Fresh mutton pieces.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Eggs, Meat & Fish' },
  { id: 3, name: 'Fish Fillet', originalPrice: 400, discountedPrice: 380, image: fishFilletImage, description: 'Fresh fish fillet.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Eggs, Meat & Fish' },
  { id: 4, name: 'Prawns', originalPrice: 500, discountedPrice: 450, image: prawnsImage, description: 'Fresh prawns.', rating: 4.6, isBestSeller: false, quantity: 1, category: 'Eggs, Meat & Fish' },
  { id: 5, name: 'Eggs', originalPrice: 120, discountedPrice: 100, image: eggImage, description: 'Farm fresh eggs.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Eggs, Meat & Fish' },
  { id: 6, name: 'Chicken Curry Cut', originalPrice: 250, discountedPrice: 230, image: chickenCurryCutImage, description: 'Fresh chicken curry cut.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Eggs, Meat & Fish' },
  { id: 9, name: 'Chicken Mince', originalPrice: 280, discountedPrice: 260, image: chickenMinceImage, description: 'Fresh chicken mince.', rating: 4.1, isBestSeller: true, quantity: 1, category: 'Eggs, Meat & Fish' },
  { id: 10, name: 'Fish Steak', originalPrice: 450, discountedPrice: 420, image: fishSteakImage, description: 'Fresh fish steak.', rating: 4.5, isBestSeller: false, quantity: 1, category: 'Eggs, Meat & Fish' },
  { id: 11, name: 'Chicken Wings', originalPrice: 220, discountedPrice: 200, image: chickenWingsImage, description: 'Fresh chicken wings.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Eggs, Meat & Fish' },
  
];

// Masalas, Oils & Dry Fruits
const masalasOilsDryFruits = [
  { id: 1, name: 'Garam Masala', originalPrice: 100, discountedPrice: 90, image: garamMasalaImage, description: 'Aromatic spice blend.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Masalas, Oils & Dry Fruits' },
  { id: 2, name: 'Olive Oil', originalPrice: 400, discountedPrice: 380, image: oliveOilImage, description: 'Extra virgin olive oil.', rating: 4.6, isBestSeller: false, quantity: 1, category: 'Masalas, Oils & Dry Fruits' },
  { id: 3, name: 'Mixed Dry Fruits', originalPrice: 600, discountedPrice: 550, image: dryFruitsImage, description: 'Assorted dry fruits mix.', rating: 4.7, isBestSeller: true, quantity: 1, category: 'Masalas, Oils & Dry Fruits' },
  { id: 4, name: 'Turmeric Powder', originalPrice: 80, discountedPrice: 70, image: turmericPowderImage, description: 'Pure turmeric powder.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Masalas, Oils & Dry Fruits' },
  { id: 5, name: 'Coconut Oil', originalPrice: 300, discountedPrice: 280, image: coconutOilImage, description: 'Pure coconut oil.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Masalas, Oils & Dry Fruits' },
  { id: 6, name: 'Almonds', originalPrice: 500, discountedPrice: 480, image: almondImage, description: 'Premium quality almonds.', rating: 4.5, isBestSeller: false, quantity: 1, category: 'Masalas, Oils & Dry Fruits' },
  { id: 7, name: 'Red Chilli Powder', originalPrice: 90, discountedPrice: 80, image: redChilliPowderImage, description: 'Spicy red chilli powder.', rating: 4.2, isBestSeller: true, quantity: 1, category: 'Masalas, Oils & Dry Fruits' },
  { id: 9, name: 'Cashews', originalPrice: 550, discountedPrice: 520, image: cashewImage, description: 'Premium quality cashews.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Masalas, Oils & Dry Fruits' },
  { id: 10, name: 'Cumin Powder', originalPrice: 70, discountedPrice: 60, image: cuminPowderImage, description: 'Aromatic cumin powder.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Masalas, Oils & Dry Fruits' },
  { id: 12, name: 'Raisins', originalPrice: 180, discountedPrice: 160, image: raisinsImage, description: 'Sweet and juicy raisins.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Masalas, Oils & Dry Fruits' },
];

// Atta, Rice, Dals & Sugar
const attaRiceDalsSugar = [
  { id: 1, name: 'Rice', originalPrice: 80, discountedPrice: 70, image: riceImage, description: 'Fine white rice.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Atta, Rice, Dals & Sugar' },
  { id: 2, name: 'Basmati Rice', originalPrice: 120, discountedPrice: 110, image: basmatiRiceImage, description: 'Premium basmati rice.', rating: 4.6, isBestSeller: false, quantity: 1, category: 'Atta, Rice, Dals & Sugar' },
  { id: 3, name: 'Toor Dal', originalPrice: 100, discountedPrice: 90, image: toorDalImage, description: 'Yellow toor dal.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Atta, Rice, Dals & Sugar' },
  { id: 4, name: 'Sugar', originalPrice: 50, discountedPrice: 45, image: sugarImage, description: 'Refined sugar.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Atta, Rice, Dals & Sugar' },
  { id: 5, name: 'Moong Dal', originalPrice: 90, discountedPrice: 80, image: moongDalImage, description: 'Yellow moong dal.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Atta, Rice, Dals & Sugar' },
  { id: 7, name: 'Multigrain Atta', originalPrice: 100, discountedPrice: 90, image: multigrainAttaImage, description: 'Nutritious multigrain atta.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Atta, Rice, Dals & Sugar' },
  { id: 9, name: 'Jaggery', originalPrice: 70, discountedPrice: 65, image: jaggeryImage, description: 'Natural jaggery.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Atta, Rice, Dals & Sugar' },
  { id: 10, name: 'Salt', originalPrice: 40, discountedPrice: 35, image: saltImage, description: 'Organic salt.', rating: 4.6, isBestSeller: false, quantity: 1, category: 'Atta, Rice, Dals & Sugar' },
  { id: 12, name: 'Brown Sugar', originalPrice: 60, discountedPrice: 55, image: brownSugarImage, description: 'Natural brown sugar.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Atta, Rice, Dals & Sugar' },
];

// Chips, Biscuits & Namkeen
const chipsBiscuitsNamkeen = [
  { id: 1, name: 'Potato Chips', originalPrice: 20, discountedPrice: 18, image: chipsImage, description: 'Crispy potato chips.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Chips, Biscuits & Namkeen' },
  { id: 2, name: 'Cookies', originalPrice: 30, discountedPrice: 25, image: cookiesImage, description: 'Sweet cookies.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Chips, Biscuits & Namkeen' },
  { id: 3, name: 'Mixed Namkeen', originalPrice: 100, discountedPrice: 90, image: namkeenImage, description: 'Assorted namkeen mix.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Chips, Biscuits & Namkeen' },
  { id: 4, name: 'Biscuits', originalPrice: 25, discountedPrice: 20, image: biscuitsImage, description: 'Crispy biscuits.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Chips, Biscuits & Namkeen' },
  { id: 5, name: 'Tortilla Chips', originalPrice: 40, discountedPrice: 35, image: tortillaChipsImage, description: 'Crispy tortilla chips.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Chips, Biscuits & Namkeen' },
  { id: 6, name: 'Chocolate Cookies', originalPrice: 35, discountedPrice: 30, image: chocolateCookiesImage, description: 'Chocolate chip cookies.', rating: 4.5, isBestSeller: false, quantity: 1, category: 'Chips, Biscuits & Namkeen' },
  { id: 7, name: 'Kara Boondy', originalPrice: 80, discountedPrice: 70, image: karaBoondyImage, description: 'Spicy Kara Boondy.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Chips, Biscuits & Namkeen' },
  { id: 8, name: 'Cream Biscuits', originalPrice: 30, discountedPrice: 25, image: creamBiscuitsImage, description: 'Cream-filled biscuits.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Chips, Biscuits & Namkeen' }, 
  { id: 12, name: 'Digestive Biscuits', originalPrice: 35, discountedPrice: 30, image: digestiveBiscuitsImage, description: 'Healthy digestive biscuits.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Chips, Biscuits & Namkeen' },
];

// Hot & Cold Beverages
const hotColdBeverages = [
  { id: 1, name: 'Green Tea', originalPrice: 200, discountedPrice: 180, image: greenTeaImage, description: 'Organic green tea.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Hot & Cold Beverages' },
  { id: 2, name: 'Coffee', originalPrice: 300, discountedPrice: 280, image: coffeeImage, description: 'Premium coffee beans.', rating: 4.6, isBestSeller: false, quantity: 1, category: 'Hot & Cold Beverages' },
  { id: 3, name: 'Juice', originalPrice: 100, discountedPrice: 90, image: juiceImage, description: 'Fresh fruit juice.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Hot & Cold Beverages' },
  { id: 4, name: 'Energy Drink', originalPrice: 80, discountedPrice: 70, image: energyDrinkImage, description: 'Refreshing energy drink.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Hot & Cold Beverages' },
  { id: 7, name: 'Black Tea', originalPrice: 180, discountedPrice: 160, image: blackTeaImage, description: 'Strong black tea.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Hot & Cold Beverages' },
  { id: 9, name: 'Lemonade', originalPrice: 70, discountedPrice: 60, image: lemonadeImage, description: 'Fresh lemonade.', rating: 4.2, isBestSeller: true, quantity: 1, category: 'Hot & Cold Beverages' },
  { id: 11, name: 'Cappuccino', originalPrice: 250, discountedPrice: 230, image: cappuccinoImage, description: 'Rich cappuccino mix.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Hot & Cold Beverages' },
  { id: 12, name: 'Smoothie', originalPrice: 110, discountedPrice: 100, image: smoothieImage, description: 'Fruit smoothie mix.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Hot & Cold Beverages' },
];

// Instant & Frozen Foods
const instantFrozenFoods = [
  { id: 2, name: 'Noodles', originalPrice: 50, discountedPrice: 45, image: noodlesImage, description: 'Instant noodles.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Instant & Frozen Foods' },
  { id: 4, name: 'Ready Meals', originalPrice: 180, discountedPrice: 160, image: readyMealsImage, description: 'Pre-cooked ready meals.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Instant & Frozen Foods' },
  { id: 5, name: 'Frozen Snacks', originalPrice: 120, discountedPrice: 100, image: frozenSnacksImage, description: 'Assorted frozen snacks.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Instant & Frozen Foods' },
  { id: 6, name: 'Pasta', originalPrice: 80, discountedPrice: 70, image: pastaImage, description: 'Instant pasta.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Instant & Frozen Foods' },
  { id: 8, name: 'Soups', originalPrice: 60, discountedPrice: 50, image: soupsImage, description: 'Instant soup mix.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Instant & Frozen Foods' },
  { id: 11, name: 'Frozen Parathas', originalPrice: 120, discountedPrice: 100, image: frozenParathasImage, description: 'Ready to cook parathas.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Instant & Frozen Foods' },
  { id: 12, name: 'Frozen Meals', originalPrice: 160, discountedPrice: 140, image: frozenMealsImage, description: 'Complete frozen meals.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Instant & Frozen Foods' },
];

// Chocolates & Ice Creams
const chocolatesIceCreams = [
  { id: 1, name: 'Dark Chocolate', originalPrice: 150, discountedPrice: 130, image: darkChocolateImage, description: 'Rich dark chocolate.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Chocolates & Ice Creams' },
  { id: 2, name: 'Vanilla Ice Cream', originalPrice: 200, discountedPrice: 180, image: vanillaIceCreamImage, description: 'Creamy vanilla ice cream.', rating: 4.5, isBestSeller: false, quantity: 1, category: 'Chocolates & Ice Creams' },
  { id: 3, name: 'Truffles', originalPrice: 300, discountedPrice: 280, image: trufflesImage, description: 'Assorted chocolate truffles.', rating: 4.7, isBestSeller: true, quantity: 1, category: 'Chocolates & Ice Creams' },
  { id: 4, name: 'Strawberry Ice Cream', originalPrice: 180, discountedPrice: 160, image: strawberryIceCreamImage, description: 'Fruity strawberry ice cream.', rating: 4.4, isBestSeller: false, quantity: 1, category: 'Chocolates & Ice Creams' },
  { id: 6, name: 'Chocolate Ice Cream', originalPrice: 190, discountedPrice: 170, image: chocolateIceCreamImage, description: 'Rich chocolate ice cream.', rating: 4.5, isBestSeller: false, quantity: 1, category: 'Chocolates & Ice Creams' },
  { id: 7, name: 'Assorted Chocolates', originalPrice: 250, discountedPrice: 230, image: assortedChocolatesImage, description: 'Mixed chocolate box.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Chocolates & Ice Creams' },
  { id: 8, name: 'Mint Ice Cream', originalPrice: 170, discountedPrice: 150, image: mintIceCreamImage, description: 'Refreshing mint ice cream.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Chocolates & Ice Creams' },
  { id: 9, name: 'White Chocolate', originalPrice: 140, discountedPrice: 120, image: whiteChocolateImage, description: 'Sweet white chocolate.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Chocolates & Ice Creams' },
  { id: 11, name: 'Chocolate Bars', originalPrice: 100, discountedPrice: 90, image: chocolateBarsImage, description: 'Assorted chocolate bars.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Chocolates & Ice Creams' },
];

const GroceryCard = ({ item, addToCart, addToWishlist, cartItems, wishlistItems }) => {
  const [quantity, setQuantity] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showQuickViewModal, setShowQuickViewModal] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    } else {
      alert('Please upload a valid image file (max 5MB).');
    }
  };

  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  const discountPercentage = Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100);
  
  // Check if item is in cart
  const cartItem = cartItems.find(
    cartItem => cartItem.id === item.id && cartItem.category === item.category
  );
  const isInCart = !!cartItem;
  
  // Check if item is in wishlist
  const wishlistItem = wishlistItems.find(
    wishlistItem => wishlistItem.id === item.id && wishlistItem.category === item.category
  );
  const isInWishlist = !!wishlistItem;

  // Set initial quantity based on cart or wishlist
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else if (wishlistItem) {
      setQuantity(wishlistItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem, wishlistItem]);

  const openQuickView = () => setShowQuickViewModal(true);
  const closeQuickView = () => setShowQuickViewModal(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img
          src={item.image }
          alt={`${item.name} - ${item.description}`}
          className="w-full aspect-square object-cover"
          onError={(e) => {
            e.target.onerror = null;

            e.target.alt = `${item.name} - Image not available`;
          }}
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            className={`p-1 rounded-full shadow-md ${
              isInWishlist 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => addToWishlist(item)}
            title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <FaHeart className="w-5 h-5" />
          </button>
          <button
            className="p-1 rounded-full shadow-md bg-white text-gray-500 hover:text-gray-700"
            onClick={openQuickView}
            title="Quick View"
          >
            <FaEye className="w-5 h-5" />
          </button>
        </div>
        
        {item.isBestSeller && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Best Seller
          </span>
        )}
      </div>
      
      <div className="p-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 w-3 h-3" />
              <span className="text-xs text-gray-600 ml-0.5">{item.rating}</span>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mb-1 line-clamp-1">{item.description}</p>
        
        <div className="flex items-center space-x-2 mb-1">
          <p className="text-base font-bold text-[#00BB1C]">₹{item.discountedPrice.toFixed(2)}</p>
          <p className="text-xs text-gray-400 line-through">₹{item.originalPrice.toFixed(2)}</p>
          <span className="text-xs text-green-600">{discountPercentage}% off</span>
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            className={`text-white text-sm font-medium py-0.5 px-2 rounded-md whitespace-nowrap w-24 ${
              isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00BB1C] hover:bg-[#009B16]'
            }`}
            onClick={() => addToCart(item, quantity)}
            disabled={isInCart}
          >
            {isInCart ? 'Added to Cart' : 'Add to Cart'}
          </button>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-xs font-medium text-gray-700">Qty:</span>
            <select
              className="w-16 px-2 py-1 border rounded"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={isInCart}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickViewModal && (
        <QuickViewModal item={item} onClose={closeQuickView} addToCart={addToCart} cartItems={cartItems} />
      )}
    </motion.div>
  );
};

// Quick View Modal Component
const QuickViewModal = ({ item, onClose, addToCart, cartItems }) => {
  const [quantity, setQuantity] = useState(1);

  const isInCart = cartItems.some(cartItem => cartItem.id === item.id && cartItem.category === item.category);

  // Sync quantity with cart if item is already in cart
  useEffect(() => {
    const cartItem = cartItems.find(ci => ci.id === item.id && ci.category === item.category);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItems, item]);

  const handleAddToCart = () => {
    addToCart(item, quantity);
    // Optionally close modal or give feedback
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-2 pt-8 z-50 md:items-center md:pt-0">
      <div className="bg-white rounded-lg shadow-xl max-w-xs md:max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all sm:scale-100 sm:w-full sm:mx-auto">
        <div className="p-3 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Quick View</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2 flex-shrink-0">
              <img src={item.image || defaultImage} alt={`${item.name} - ${item.description}`} className="w-full h-auto rounded-md object-cover aspect-square" />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
              <div className="flex items-center mb-1"> 
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">{item.rating}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2 text-justify">{item.description}</p>
              <div className="flex items-center space-x-2 mb-2"> 
                <p className="text-xl font-bold text-[#00BB1C]">₹{item.discountedPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-400 line-through">₹{item.originalPrice.toFixed(2)}</p>
                <span className="text-sm text-green-600">{Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)}% off</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap justify-end">
                <button
                  className={`text-white font-medium py-1 px-3 rounded-md text-sm w-24 flex-shrink-0 ${isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00BB1C] hover:bg-[#009B16]'}`}
                  onClick={handleAddToCart}
                  disabled={isInCart}
                >
                  {isInCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
                <div className="flex items-center border rounded-full px-2 py-1 flex-shrink-0">
                  <span className="text-xs font-medium text-gray-700 mr-1">Qty:</span>
                  <select
                    className="bg-transparent outline-none text-xs w-full"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    disabled={isInCart}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Groceries() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [randomizedItems, setRandomizedItems] = useState([]);
  const [isFilterMinimized, setIsFilterMinimized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsRecording(false);
      }
    }
  };
  
  // Main filter states
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [minRating, setMinRating] = useState(0);
  const [showBestSellersOnly, setShowBestSellersOnly] = useState(false);
  
  // Temporary filter states for the filter panel
  const [tempFilters, setTempFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    minRating: 0,
    showBestSellersOnly: false
  });

  // Update tempFilters when filter panel is opened
  useEffect(() => {
    if (showFilters) {
      setTempFilters({
        priceRange: { ...priceRange },
        minRating,
        showBestSellersOnly
      });
    }
  }, [showFilters]);

  // Apply filters function
  const applyFilters = () => {
    setPriceRange(tempFilters.priceRange);
    setMinRating(tempFilters.minRating);
    setShowBestSellersOnly(tempFilters.showBestSellersOnly);
    // Close the filter panel after applying
    setShowFilters(false);
  };

  // Clear all filters function
  const clearAllFilters = () => {
    const defaultFilters = {
      priceRange: { min: 0, max: 1000 },
      minRating: 0,
      showBestSellersOnly: false
    };
    setTempFilters(defaultFilters);
    setPriceRange(defaultFilters.priceRange);
    setMinRating(defaultFilters.minRating);
    setShowBestSellersOnly(defaultFilters.showBestSellersOnly);
  };

  // Filter items based on all criteria
  const filteredItems = randomizedItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = item.discountedPrice >= priceRange.min && item.discountedPrice <= priceRange.max;
    const matchesRating = item.rating >= minRating;
    const matchesBestSeller = !showBestSellersOnly || item.isBestSeller;
    
    return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesBestSeller;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOption === 'price-low') return a.discountedPrice - b.discountedPrice;
    if (sortOption === 'price-high') return b.discountedPrice - a.discountedPrice;
    if (sortOption === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('GcartItems')) || [];
    const storedWishlist = JSON.parse(localStorage.getItem('GwishlistItems')) || [];
    setCartItems(storedCart);
    setWishlistItems(storedWishlist);
  }, []);

  // Listen for storage changes from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cartItems') {
        setCartItems(JSON.parse(e.newValue) || []);
      } else if (e.key === 'wishlistItems') {
        setWishlistItems(JSON.parse(e.newValue) || []);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Randomize items only on initial load
  useEffect(() => {
    const allItems = [
      ...fruitsAndVegetables,
      ...bakeryCakesDairy,
      ...breakfastAndMore,
      ...eggsMeatFish,
      ...masalasOilsDryFruits,
      ...attaRiceDalsSugar,
      ...chipsBiscuitsNamkeen,
      ...hotColdBeverages,
      ...instantFrozenFoods,
      ...chocolatesIceCreams
    ];
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    setRandomizedItems(shuffled);
  }, []);

  const addToCart = (item, quantity) => {
    const currentCart = JSON.parse(localStorage.getItem('GcartItems')) || [];
    const existingItemIndex = currentCart.findIndex(
      cartItem => cartItem.id === item.id && cartItem.category === item.category
    );

    let updatedCart;
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      updatedCart = currentCart.map((cartItem, index) => 
        index === existingItemIndex 
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      );
    } else {
      // Add new item
      updatedCart = [...currentCart, { ...item, quantity }];
    }

    // Update localStorage and state
    localStorage.setItem('GcartItems', JSON.stringify(updatedCart));
    setCartItems(updatedCart);

    // Dispatch storage event for other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'cartItems',
      newValue: JSON.stringify(updatedCart)
    }));

    // Show success message
    
  };

  const addToWishlist = (item) => {
    const currentWishlist = JSON.parse(localStorage.getItem('GwishlistItems')) || [];
    const currentCart = JSON.parse(localStorage.getItem('GcartItems')) || [];
    
    // Check if item is in cart
    const cartItem = currentCart.find(
      cartItem => cartItem.id === item.id && cartItem.category === item.category
    );
    
    const isInWishlist = currentWishlist.some(
      wishlistItem => wishlistItem.id === item.id && wishlistItem.category === item.category
    );

    let updatedWishlist;
    if (isInWishlist) {
      // Remove from wishlist
      updatedWishlist = currentWishlist.filter(
        wishlistItem => !(wishlistItem.id === item.id && wishlistItem.category === item.category)
      );
      
    } else {
      // Add to wishlist with cart quantity if it exists in cart
      const wishlistItem = {
        ...item,
        quantity: cartItem ? cartItem.quantity : 1,
        inCart: !!cartItem // Add flag to indicate if item is in cart
      };
      updatedWishlist = [...currentWishlist, wishlistItem];
     
    }

    // Update localStorage and state
    localStorage.setItem('GwishlistItems', JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist);

    // Dispatch storage event for other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'wishlistItems',
      newValue: JSON.stringify(updatedWishlist)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for fruits and vegetables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BB1C]"
                />
                <button
                  onClick={toggleRecording}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                    isRecording 
                      ? 'text-red-500 hover:text-red-600 animate-pulse' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Start Voice Search'}
                >
                  {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <FaFilter />
                  <span>Filters</span>
                </button>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BB1C]"
                >
                  <option value="">Sort by</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setSelectedCategory('Fruits & Vegetables')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Fruits & Vegetables'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fruits & Vegetables
              </button>
              <button
                onClick={() => setSelectedCategory('Bakery, Cakes & Dairy')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Bakery, Cakes & Dairy'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bakery, Cakes & Dairy
              </button>
              <button
                onClick={() => setSelectedCategory('Breakfast & More')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Breakfast & More'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Breakfast & More
              </button>
              <button
                onClick={() => setSelectedCategory('Eggs, Meat & Fish')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Eggs, Meat & Fish'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Eggs, Meat & Fish
              </button>
              <button
                onClick={() => setSelectedCategory('Masalas, Oils & Dry Fruits')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Masalas, Oils & Dry Fruits'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Masalas, Oils & Dry Fruits
              </button>
              <button
                onClick={() => setSelectedCategory('Atta, Rice, Dals & Sugar')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Atta, Rice, Dals & Sugar'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Atta, Rice, Dals & Sugar
              </button>
              <button
                onClick={() => setSelectedCategory('Chips, Biscuits & Namkeen')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Chips, Biscuits & Namkeen'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Chips, Biscuits & Namkeen
              </button>
              <button
                onClick={() => setSelectedCategory('Hot & Cold Beverages')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Hot & Cold Beverages'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hot & Cold Beverages
              </button>
              <button
                onClick={() => setSelectedCategory('Instant & Frozen Foods')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Instant & Frozen Foods'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Instant & Frozen Foods
              </button>
              <button
                onClick={() => setSelectedCategory('Chocolates & Ice Creams')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Chocolates & Ice Creams'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Chocolates & Ice Creams
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 p-4 border rounded-lg bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsFilterMinimized(!isFilterMinimized)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      {isFilterMinimized ? <FaChevronDown /> : <FaChevronUp />}
                    </button>
                  </div>
                </div>

                {!isFilterMinimized && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Price Range Filter */}
                      <div>
                        <h3 className="font-medium mb-2">Price Range</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={tempFilters.priceRange.min}
                              onChange={(e) => setTempFilters(prev => ({
                                ...prev,
                                priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                              }))}
                              className="w-24 px-2 py-1 border rounded"
                              placeholder="Min"
                              min="0"
                            />
                            <span>to</span>
                            <input
                              type="number"
                              value={tempFilters.priceRange.max}
                              onChange={(e) => setTempFilters(prev => ({
                                ...prev,
                                priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                              }))}
                              className="w-24 px-2 py-1 border rounded"
                              placeholder="Max"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Rating Filter */}
                      <div>
                        <h3 className="font-medium mb-2">Minimum Rating</h3>
                        <select
                          value={tempFilters.minRating}
                          onChange={(e) => setTempFilters(prev => ({
                            ...prev,
                            minRating: Number(e.target.value)
                          }))}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BB1C]"
                        >
                          <option value={0}>Any Rating</option>
                          <option value={4}>4★ & above</option>
                          <option value={3}>3★ & above</option>
                          <option value={2}>2★ & above</option>
                          <option value={1}>1★ & above</option>
                        </select>
                      </div>

                      {/* Best Sellers Filter */}
                      <div>
                        <h3 className="font-medium mb-2">Best Sellers</h3>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={tempFilters.showBestSellersOnly}
                            onChange={(e) => setTempFilters(prev => ({
                              ...prev,
                              showBestSellersOnly: e.target.checked
                            }))}
                            className="rounded text-[#00BB1C] focus:ring-[#00BB1C]"
                          />
                          <span>Show Best Sellers Only</span>
                        </label>
                      </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={clearAllFilters}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Clear All Filters
                      </button>
                      <button
                        onClick={applyFilters}
                        className="px-6 py-2 bg-[#00BB1C] text-white rounded-lg hover:bg-[#009B16] transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
            {sortedItems.map((item) => (
              <GroceryCard
                key={`${item.category}-${item.id}`}
                item={item}
                addToCart={addToCart}
                addToWishlist={addToWishlist}
                cartItems={cartItems}
                wishlistItems={wishlistItems}
              />
            ))}
          </div>

          {sortedItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No items found matching your criteria.</p>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Groceries; 