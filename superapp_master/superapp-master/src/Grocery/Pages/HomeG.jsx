import React, { useState, useEffect } from 'react';
import Footer from '../SubPages/Footer';
import Header from '../SubPages/Header';
import { FaFilter, FaSortAmountUp, FaSortAmountDown, FaHeart, FaEye, FaStar, FaSearch, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Import all vegetable images
import broccoliImage from '../Images/broccoli.jpg';
import carrotImage from '../Images/Carrot.jpg';
import spinachImage from '../Images/spinach.jpg';
import tomatoImage from '../Images/tomato.jpg';
import potatoImage from '../Images/potatoe.jpg';
import onionImage from '../Images/onion.jpg';
import cucumberImage from '../Images/cucumber.jpg';
import bellpepperImage from '../Images/bellpeper.jpg';
import cabbageImage from '../Images/cabbage.jpg';
import cornImage from '../Images/corn.jpg';
import eggplantImage from '../Images/Eggplant.jpg';
import asparagusImage from '../Images/asparagus.jpg';
import greenbeanImage from '../Images/greenbean.jpg';
import peaImage from '../Images/pea.jpg';
import kaleImage from '../Images/kale.jpg';
import mushroomImage from '../Images/mushroom.jpg';
import pumpkinImage from '../Images/pumpkin.jpg';
import sweetpotatoImage from '../Images/sweetpotato.jpg';
import cauliflowerImage from '../Images/cauliflower.jpg';
import radishImage from '../Images/radish.jpg';
import beetrootImage from '../Images/beetroot.jpg';
import bottleGourdImage from '../Images/bottlegourd.jpg';
import ivyGourdImage from '../Images/ivygourd.jpg';
import curryLeavesImage from '../Images/curryleaves.jpg';
import clusterBeansImage from '../Images/clusterbeans.jpg';
import bitterGourdImage from '../Images/Bittergourd.jpg';
import drumstickImage from '../Images/drumstick.jpg';
import fenugreekLeavesImage from '../Images/FenugreekLeaves.jpg';
import amaranthLeavesImage from '../Images/Amaranthleaves.jpg';
import ridgeGourdImage from '../Images/ridgegourd.jpg';
import snakeGourdImage from '../Images/Snake Gourd.jpg';
import spongeGourdImage from '../Images/SpongeGourd.jpg';
import BrinjalImage from '../Images/Brinjal.jpg';
import dillLeavesImage from '../Images/dillleaves.jpg';
import okraImage from '../Images/Okra.jpg';
import turnipImage from '../Images/Turnip.jpg';

// Import all fruit images
import appleImage from '../Images/apple.jpg';
import bananaImage from '../Images/Banana.jpg';
import orangeImage from '../Images/orange.jpg';
import mangoImage from '../Images/mango.jpg';
import pineappleImage from '../Images/pineapple.jpg';
import grapeImage from '../Images/grape.jpg';
import strawberryImage from '../Images/strawberry.jpg';
import watermelonImage from '../Images/watermelon.jpg';
import kiwiImage from '../Images/kiwi.jpg';
import pomegranateImage from '../Images/pomegranate.jpg';
import blueberryImage from '../Images/Blueberries.jpg';
import peachImage from '../Images/peach.jpg';
import cherryImage from '../Images/cherry.jpg';
import pappayaImage from '../Images/pappaya.jpg';
import dragonFruitImage from '../Images/dragonfruit.jpg';
import lemonImage from '../Images/lemon.jpg';
import avocadoImage from '../Images/avocado.jpg';
import plumImage from '../Images/plum.jpg';
import raspberriesImage from '../Images/raspberries.jpg';
import coconutImage from '../Images/coconut.jpg';
import guavaImage from '../Images/guava.jpg';
import pearImage from '../Images/pear.jpg';
import lycheeImage from '../Images/lychee.jpg';
import blackberryImage from '../Images/Blackberry.jpg';
import cantaloupeImage from '../Images/cantaloupe.jpg';
import figImage from '../Images/fig.jpg';
import starfruitImage from '../Images/starfruit.jpg';
import jackfruitImage from '../Images/jackfruit.jpg';
import chikooImage from '../Images/chikoo.jpg';
import custardAppleImage from '../Images/custardapple.jpg';
import woodAppleImage from '../Images/woodapple.jpg';
import jamunImage from '../Images/jamun.jpg';
import jujubeImage from '../Images/jujube.jpg';

// Dairy Images
import milkImage from '../Images/milk.webp';
import cheeseImage from '../Images/cheese.jpg';
import yogurtImage from '../Images/yogurt.webp';
import butterImage from '../Images/butter.webp';
import paneerImage from '../Images/paneer.webp';
import curdImage from '../Images/curd.jpeg';
import creamImage from '../Images/cream.webp';
import greekYogurtImage from '../Images/greek_yogurt.webp';
import cottageCheeseImage from '../Images/cottage_cheese.webp';
import sourCreamImage from '../Images/sour_cream.webp';
import whippedCreamImage from '../Images/whipped_cream.jpg';
import gheeImage from '../Images/ghee.webp';
import condensedMilkImage from '../Images/condensed_milk.webp';
import buttermilkImage from '../Images/buttermilk.jpg';
import flavoredMilkImage from '../Images/flavored_milk.webp';

// Snacks Images
import chipsImage from '../Images/chips.webp';
import cookiesImage from '../Images/cookies.webp';
import chocolateImage from '../Images/chocolate.webp';
import namkeenImage from '../Images/namkeen.webp';
import biscuitsImage from '../Images/biscuits.webp';
import dryFruitsImage from '../Images/dry_fruits.webp';
import energyBarImage from '../Images/energy_bar.webp';
import popcornImage from '../Images/popcorn.webp';
import pretzelsImage from '../Images/pretzels.webp';
import trailMixImage from '../Images/trail_mix.webp';
import riceCakesImage from '../Images/rice_cakes.webp';
import granolaBarImage from '../Images/granola_bar.jpg';
import fruitSnacksImage from '../Images/fruit_snacks.webp';
import nutsMixImage from '../Images/nuts_mix.webp';
import vegetableCrispsImage from '../Images/vegetable_crisps.webp';

const vegetables = [
  { id: 1, name: 'Broccoli', originalPrice: 100, discountedPrice: 80, image: broccoliImage, description: 'Fresh green broccoli, rich in vitamins.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 2, name: 'Carrot', originalPrice: 60, discountedPrice: 50, image: carrotImage, description: 'Crunchy orange carrots, perfect for salads.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 3, name: 'Spinach', originalPrice: 40, discountedPrice: 35, image: spinachImage, description: 'Leafy green spinach, ideal for smoothies.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 4, name: 'Tomato', originalPrice: 50, discountedPrice: 45, image: tomatoImage, description: 'Red ripe tomatoes, great for sauces.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 5, name: 'Potato', originalPrice: 30, discountedPrice: 25, image: potatoImage, description: 'Versatile potatoes, perfect for mashing or frying.', rating: 4.0, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 6, name: 'Onion', originalPrice: 35, discountedPrice: 30, image: onionImage, description: 'Pungent onions, a staple for many dishes.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 7, name: 'Cucumber', originalPrice: 45, discountedPrice: 40, image: cucumberImage, description: 'Cool cucumbers, refreshing in salads.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 8, name: 'Bell Pepper', originalPrice: 70, discountedPrice: 60, image: bellpepperImage, description: 'Colorful bell peppers, good for stir-fries.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 9, name: 'Cabbage', originalPrice: 55, discountedPrice: 48, image: cabbageImage, description: 'Green cabbage, great for coleslaw and stir-fries.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 10, name: 'Snake Gourd', originalPrice: 50, discountedPrice: 42, image: snakeGourdImage, description: 'Long snake gourd, great for stir-fries or curries.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Vegetables'  },
  { id: 11, name: 'Corn', originalPrice: 40, discountedPrice: 32, image: cornImage, description: 'Sweet corn on the cob, a summer favorite.', rating: 4.5, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 12, name: 'Eggplant', originalPrice: 75, discountedPrice: 65, image: eggplantImage, description: 'Purple eggplant, delicious in curries and baked dishes.', rating: 4.1, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 13, name: 'Asparagus', originalPrice: 90, discountedPrice: 75, image: asparagusImage, description: 'Green asparagus spears, great roasted or steamed.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 14, name: 'Green Bean', originalPrice: 50, discountedPrice: 40, image: greenbeanImage, description: 'Crisp green beans, perfect as a side dish.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 15, name: 'Pea', originalPrice: 45, discountedPrice: 38, image: peaImage, description: 'Sweet green peas, a versatile addition to many meals.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 16, name: 'Kale', originalPrice: 60, discountedPrice: 50, image: kaleImage, description: 'Nutrient-rich kale, excellent for salads or chips.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 17, name: 'Mushroom', originalPrice: 80, discountedPrice: 70, image: mushroomImage, description: 'Earthy mushrooms, ideal for stir-fries and pasta.', rating: 4.2, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 18, name: 'Dill Leaves', originalPrice: 30, discountedPrice: 25, image: dillLeavesImage, description: 'Fragrant dill leaves, great for suva bhaji or dal.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Vegetables'  },
  { id: 19, name: 'Okra', originalPrice: 45, discountedPrice: 38, image: okraImage, description: 'Tender okra, ideal for bhindi masala or frying.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Vegetables'  },
  { id: 20, name: 'Pumpkin', originalPrice: 70, discountedPrice: 60, image: pumpkinImage, description: 'Sweet and nutritious pumpkin, great for soups or baking.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 21, name: 'Sweet Potato', originalPrice: 55, discountedPrice: 45, image: sweetpotatoImage, description: 'Naturally sweet and healthy sweet potatoes.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 22, name: 'Cauliflower', originalPrice: 65, discountedPrice: 55, image: cauliflowerImage, description: 'Mild cauliflower, perfect for roasting or mashing.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 23, name: 'Turnip', originalPrice: 40, discountedPrice: 35, image: turnipImage, description: 'Mild turnips, great for stews or roasting.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Vegetables'  },   
  { id: 24, name: 'Radish', originalPrice: 35, discountedPrice: 30, image: radishImage, description: 'Crisp, peppery radishes, ideal for salads.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 25, name: 'Beetroot', originalPrice: 60, discountedPrice: 50, image: beetrootImage, description: 'Sweet and earthy beetroot, great for roasting.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 26, name: 'Bottle Gourd', originalPrice: 50, discountedPrice: 45, image: bottleGourdImage, description: 'Mild bottle gourd, ideal for lauki curry or soup.', rating: 4.2, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 27, name: 'Ivy Gourd', originalPrice: 45, discountedPrice: 40, image: ivyGourdImage, description: 'Crisp ivy gourd, perfect for tindora fry.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 28, name: 'Curry Leaves', originalPrice: 30, discountedPrice: 25, image: curryLeavesImage, description: 'Aromatic curry leaves, essential for tempering.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 29, name: 'Cluster Beans', originalPrice: 55, discountedPrice: 48, image: clusterBeansImage, description: 'Nutty cluster beans, great for guar phali sabzi.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 30, name: 'Bitter Gourd', originalPrice: 50, discountedPrice: 42, image: bitterGourdImage, description: 'Bitter gourd, perfect for karela sabzi or stuffed dishes.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Vegetables' },
  { id: 31, name: 'Drumstick', originalPrice: 60, discountedPrice: 50, image: drumstickImage, description: 'Nutritious drumsticks, great for sambar or curry.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Vegetables'  },
  { id: 32, name: 'Brinjal (Green)', originalPrice: 50, discountedPrice: 45, image: BrinjalImage, description: 'Green brinjal, ideal for bharwa baingan or curries.', rating: 4.2, isBestSeller: true, quantity: 1, category: 'Vegetables'  },
  { id: 33, name: 'Sponge Gourd', originalPrice: 45, discountedPrice: 38, image: spongeGourdImage, description: 'Soft sponge gourd, great for gilki sabzi or soups.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Vegetables'  },
  { id: 34, name: 'Fenugreek Leaves', originalPrice: 35, discountedPrice: 30, image: fenugreekLeavesImage, description: 'Aromatic fenugreek leaves, ideal for methi paratha or curry.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Vegetables' },
  { id: 35, name: 'Amaranth Leaves', originalPrice: 40, discountedPrice: 35, image: amaranthLeavesImage, description: 'Nutritious amaranth leaves, great for stir-fries or dal.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Vegetables'  },
  { id: 36, name: 'Ridge Gourd', originalPrice: 55, discountedPrice: 48, image: ridgeGourdImage, description: 'Juicy ridge gourd, great for turai curry or chutney.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Vegetables'  },
];

const fruits = [
  { id: 1, name: 'Apple', originalPrice: 200, discountedPrice: 150, image: appleImage, description: 'Fresh red apples, perfect for snacking.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 2, name: 'Banana', originalPrice: 80, discountedPrice: 60, image: bananaImage, description: 'Ripe yellow bananas, great for smoothies.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 3, name: 'Orange', originalPrice: 120, discountedPrice: 90, image: orangeImage, description: 'Juicy oranges, rich in vitamin C.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 4, name: 'Mango', originalPrice: 250, discountedPrice: 200, image: mangoImage, description: 'Sweet and juicy mangoes, perfect for desserts.', rating: 4.7, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 5, name: 'Pineapple', originalPrice: 150, discountedPrice: 120, image: pineappleImage, description: 'Tropical pineapples, great for juicing.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 6, name: 'Grapes', originalPrice: 180, discountedPrice: 140, image: grapeImage, description: 'Seedless green grapes, sweet and crisp.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 7, name: 'Strawberry', originalPrice: 300, discountedPrice: 250, image: strawberryImage, description: 'Fresh strawberries, ideal for smoothies and desserts.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 8, name: 'Watermelon', originalPrice: 100, discountedPrice: 80, image: watermelonImage, description: 'Juicy watermelons, perfect for hydration.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 9, name: 'Kiwi', originalPrice: 220, discountedPrice: 180, image: kiwiImage, description: 'Tangy kiwis, packed with vitamins.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 10, name: 'Pomegranate', originalPrice: 260, discountedPrice: 210, image: pomegranateImage, description: 'Rich pomegranates, full of antioxidants.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 11, name: 'Blueberry', originalPrice: 350, discountedPrice: 300, image: blueberryImage, description: 'Sweet blueberries, great for baking.', rating: 4.4, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 12, name: 'Peach', originalPrice: 190, discountedPrice: 150, image: peachImage, description: 'Juicy peaches, perfect for summer snacks.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 13, name: 'Cherry', originalPrice: 320, discountedPrice: 270, image: cherryImage, description: 'Sweet and tart cherries, perfect for snacking.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 14, name: 'Papaya', originalPrice: 140, discountedPrice: 110, image: pappayaImage, description: 'Tropical papaya, great for digestion.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 15, name: 'Dragon Fruit', originalPrice: 280, discountedPrice: 230, image: dragonFruitImage, description: 'Exotic dragon fruit, vibrant and refreshing.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 16, name: 'Lemon', originalPrice: 90, discountedPrice: 70, image: lemonImage, description: 'Zesty lemons, ideal for beverages and cooking.', rating: 4.0, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 17, name: 'Avocado', originalPrice: 200, discountedPrice: 160, image: avocadoImage, description: 'Creamy avocados, perfect for salads and spreads.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 18, name: 'Plum', originalPrice: 170, discountedPrice: 130, image: plumImage, description: 'Juicy plums, great for snacking or baking.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 19, name: 'Raspberry', originalPrice: 340, discountedPrice: 290, image: raspberriesImage, description: 'Tart raspberries, ideal for desserts and smoothies.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 20, name: 'Coconut', originalPrice: 110, discountedPrice: 90, image: coconutImage, description: 'Fresh coconuts, perfect for hydration and cooking.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 21, name: 'Guava', originalPrice: 130, discountedPrice: 100, image: guavaImage, description: 'Sweet and aromatic guavas, great for snacking.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 22, name: 'Pear', originalPrice: 160, discountedPrice: 120, image: pearImage, description: 'Juicy pears, perfect for fresh eating or baking.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 23, name: 'Lychee', originalPrice: 270, discountedPrice: 220, image: lycheeImage, description: 'Sweet and floral lychees, ideal for desserts.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 24, name: 'Blackberry', originalPrice: 330, discountedPrice: 280, image: blackberryImage, description: 'Juicy blackberries, perfect for desserts and smoothies.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 25, name: 'Cantaloupe', originalPrice: 130, discountedPrice: 100, image: cantaloupeImage, description: 'Sweet cantaloupes, ideal for refreshing snacks.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 26, name: 'Fig', originalPrice: 240, discountedPrice: 200, image: figImage, description: 'Sweet figs, great for fresh eating or baking.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 27, name: 'Starfruit', originalPrice: 260, discountedPrice: 210, image: starfruitImage, description: 'Tangy starfruit, great for garnishes and snacks.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 28, name: 'Jackfruit', originalPrice: 180, discountedPrice: 140, image: jackfruitImage, description: 'Sweet and versatile jackfruit, ideal for curries and desserts.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 29, name: 'Chikoo', originalPrice: 150, discountedPrice: 120, image: chikooImage, description: 'Creamy and sweet sapota, perfect for milkshakes.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 30, name: 'Custard Apple', originalPrice: 200, discountedPrice: 160, image: custardAppleImage, description: 'Creamy custard apples, great for desserts.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 31, name: 'Wood Apple', originalPrice: 140, discountedPrice: 110, image: woodAppleImage, description: 'Aromatic wood apples, ideal for refreshing juices.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 32, name: 'Jamun', originalPrice: 160, discountedPrice: 130, image: jamunImage, description: 'Nutritious jamun, great for digestion and cooling.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 33, name: 'Jujube', originalPrice: 120, discountedPrice: 90, image: jujubeImage, description: 'Sweet and chewy jujube, perfect with salt and chili.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Fruits' },
];

const dairy = [
  { id: 35, name: 'Milk', originalPrice: 60, discountedPrice: 55, image: milkImage, description: 'Fresh cow milk, pasteurized and homogenized.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Dairy' },
  { id: 36, name: 'Cheese Block', originalPrice: 300, discountedPrice: 280, image: cheeseImage, description: 'Cheddar cheese block, perfect for sandwiches.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Dairy' },
  { id: 37, name: 'Yogurt', originalPrice: 40, discountedPrice: 35, image: yogurtImage, description: 'Plain yogurt, rich in probiotics.', rating: 4.0, isBestSeller: true, quantity: 1, category: 'Dairy' },
  { id: 38, name: 'Butter', originalPrice: 120, discountedPrice: 110, image: butterImage, description: 'Unsalted butter, great for cooking and baking.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Dairy' },
  { id: 39, name: 'Paneer', originalPrice: 200, discountedPrice: 180, image: paneerImage, description: 'Fresh homemade paneer, soft and creamy.', rating: 4.7, isBestSeller: false, quantity: 1, category: 'Dairy' },
  { id: 40, name: 'Curd', originalPrice: 30, discountedPrice: 28, image: curdImage, description: 'Homemade style curd, thick and delicious.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Dairy' },
  { id: 41, name: 'Fresh Cream', originalPrice: 90, discountedPrice: 85, image: creamImage, description: 'Rich and creamy fresh cream, ideal for desserts.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Dairy' },
  { id: 49, name: 'Greek Yogurt', originalPrice: 70, discountedPrice: 65, image: greekYogurtImage, description: 'Thick and creamy Greek yogurt, high in protein.', rating: 4.8, isBestSeller: true, quantity: 1, category: 'Dairy' },
  { id: 50, name: 'Cottage Cheese', originalPrice: 150, discountedPrice: 135, image: cottageCheeseImage, description: 'Low-fat cottage cheese, great for healthy snacks.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Dairy' },
  { id: 51, name: 'Sour Cream', originalPrice: 80, discountedPrice: 75, image: sourCreamImage, description: 'Tangy sour cream, perfect for dips and toppings.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Dairy' },
  { id: 52, name: 'Whipped Cream', originalPrice: 100, discountedPrice: 95, image: whippedCreamImage, description: 'Light whipped cream, ideal for desserts and coffee.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Dairy' },
  { id: 53, name: 'Ghee', originalPrice: 400, discountedPrice: 380, image: gheeImage, description: 'Clarified butter, aromatic and rich in flavor.', rating: 4.7, isBestSeller: true, quantity: 1, category: 'Dairy' },
  { id: 54, name: 'Condensed Milk', originalPrice: 180, discountedPrice: 165, image: condensedMilkImage, description: 'Sweetened condensed milk, perfect for desserts.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Dairy' },
  { id: 55, name: 'Buttermilk', originalPrice: 40, discountedPrice: 35, image: buttermilkImage, description: 'Refreshing buttermilk, great for digestion.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Dairy' },
  { id: 56, name: 'Flavored Milk', originalPrice: 60, discountedPrice: 50, image: flavoredMilkImage, description: 'Delicious flavored milk, perfect for kids and adults.', rating: 4.0, isBestSeller: true, quantity: 1, category: 'Dairy' },
];

const snacks = [
  { id: 42, name: 'Potato Chips', originalPrice: 50, discountedPrice: 45, image: chipsImage, description: 'Crispy potato chips, salted.', rating: 4.0, isBestSeller: true, quantity: 1, category: 'Snacks' },
  { id: 43, name: 'Chocolate Cookies', originalPrice: 80, discountedPrice: 70, image: cookiesImage, description: 'Delicious chocolate chip cookies.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Snacks' },
  { id: 44, name: 'Dark Chocolate Bar', originalPrice: 150, discountedPrice: 130, image: chocolateImage, description: 'Rich dark chocolate bar, 70% cocoa.', rating: 4.6, isBestSeller: false, quantity: 1, category: 'Snacks' },
  { id: 45, name: 'Aloo Bhujia', originalPrice: 70, discountedPrice: 60, image: namkeenImage, description: 'Spicy potato snack mix.', rating: 4.1, isBestSeller: true, quantity: 1, category: 'Snacks' },
  { id: 46, name: 'Oatmeal Biscuits', originalPrice: 90, discountedPrice: 80, image: biscuitsImage, description: 'Healthy oatmeal biscuits.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Snacks' },
  { id: 47, name: 'Mixed Dry Fruits', originalPrice: 500, discountedPrice: 450, image: dryFruitsImage, description: 'Assorted dry fruits, perfect for a healthy snack.', rating: 4.7, isBestSeller: true, quantity: 1, category: 'Snacks' },
  { id: 48, name: 'Energy Bar', originalPrice: 100, discountedPrice: 90, image: energyBarImage, description: 'Protein-rich energy bar for quick boosts.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Snacks' },
  { id: 57, name: 'Popcorn', originalPrice: 60, discountedPrice: 50, image: popcornImage, description: 'Light and airy popcorn, salted.', rating: 3.9, isBestSeller: false, quantity: 1, category: 'Snacks' },
  { id: 58, name: 'Pretzels', originalPrice: 70, discountedPrice: 60, image: pretzelsImage, description: 'Crunchy pretzels, lightly salted.', rating: 4.0, isBestSeller: true, quantity: 1, category: 'Snacks' },
  { id: 59, name: 'Trail Mix', originalPrice: 250, discountedPrice: 220, image: trailMixImage, description: 'Nutritious trail mix with nuts and dried fruits.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Snacks' },
  { id: 60, name: 'Rice Cakes', originalPrice: 80, discountedPrice: 70, image: riceCakesImage, description: 'Plain rice cakes, light and crispy.', rating: 3.8, isBestSeller: false, quantity: 1, category: 'Snacks' },
  { id: 61, name: 'Granola Bar', originalPrice: 120, discountedPrice: 100, image: granolaBarImage, description: 'Wholesome granola bar, perfect for on-the-go.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Snacks' },
  { id: 62, name: 'Fruit Snacks', originalPrice: 90, discountedPrice: 80, image: fruitSnacksImage, description: 'Chewy fruit flavored snacks.', rating: 3.7, isBestSeller: false, quantity: 1, category: 'Snacks' },
  { id: 63, name: 'Nuts Mix', originalPrice: 300, discountedPrice: 270, image: nutsMixImage, description: 'Premium mixed nuts, roasted and salted.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Snacks' },
  { id: 64, name: 'Vegetable Crisps', originalPrice: 110, discountedPrice: 95, image: vegetableCrispsImage, description: 'Crispy mixed vegetable crisps, healthy alternative.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Snacks' },
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
        <img src={item.image} alt={item.name} className="w-full aspect-square object-cover" />
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
              <img src={item.image} alt={item.name} className="w-full h-auto rounded-md object-cover aspect-square" />
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
    const allItems = [...vegetables, ...fruits, ...dairy, ...snacks];
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    setRandomizedItems(shuffled);
  }, []); // Empty dependency array means this runs only once on mount

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
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BB1C]"
                />
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
                onClick={() => setSelectedCategory('Vegetables')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Vegetables'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Vegetables
              </button>
              <button
                onClick={() => setSelectedCategory('Fruits')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Fruits'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fruits
              </button>
              <button
                onClick={() => setSelectedCategory('Dairy')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Dairy'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dairy
              </button>
              <button
                onClick={() => setSelectedCategory('Snacks')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Snacks'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Snacks
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