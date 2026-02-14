"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Card from "./Card";
import { LEARNING_THEMES } from "@/data/learningThemes";
import { speak } from "@/utils/speech";
import { playFlipSound, playCorrectSound, playWrongSound, playStreakSound, setSoundEnabled, setSoundVolume } from "@/utils/sounds";

const EMOJI_LABELS = {
    en: {
        // Farm
        '🐄': 'Cow', '🐔': 'Chicken', '🦢': 'Swan', '🐑': 'Sheep',
        '🐴': 'Horse', '🐇': 'Rabbit', '🐈': 'Cat', '🐓': 'Rooster',
        '🦆': 'Duck', '🐐': 'Goat', '🐎': 'Pony', '🐈‍⬛': 'Black Cat',
        '🐏': 'Ram', '🦃': 'Turkey', '🕊️': 'Dove', '🐂': 'Ox',
        '🐃': 'Buffalo', '🐮': 'Cow Face', '🐣': 'Chick', '🦜': 'Parrot',
        '🦙': 'Llama', '🐪': 'Camel', '🦚': 'Peacock', '🦤': 'Dodo',
        // Garden
        '🌻': 'Sunflower', '🌷': 'Tulip', '🌹': 'Rose', '🌺': 'Hibiscus',
        '🌸': 'Blossom', '🌼': 'Daisy', '🏵️': 'Rosette', '🪻': 'Hyacinth',
        '🌾': 'Rice', '🌰': 'Chestnut', '🌿': 'Herb', '🌵': 'Cactus',
        '🥀': 'Wilted', '🪴': 'Plant', '🌱': 'Seedling', '🍃': 'Leaf',
        '🌳': 'Tree', '🌴': 'Palm', '🪹': 'Nest', '🍁': 'Maple',
        '🍂': 'Fallen Leaf', '🪺': 'Eggs', '🪷': 'Lotus', '🫘': 'Beans',
        // Fruits
        '🍎': 'Apple', '🍌': 'Banana', '🍇': 'Grapes', '🍊': 'Orange',
        '🍓': 'Strawberry', '🍉': 'Watermelon', '🍑': 'Peach', '🍒': 'Cherry',
        '🥝': 'Kiwi', '🍍': 'Pineapple', '🥭': 'Mango', '🫐': 'Blueberry',
        '🍋': 'Lemon', '🥥': 'Coconut', '🍈': 'Melon', '🍐': 'Pear',
        '🫒': 'Olive', '🥑': 'Avocado', '🍅': 'Tomato', '🫑': 'Pepper',
        '🥒': 'Cucumber', '🌽': 'Corn', '🥕': 'Carrot', '🍆': 'Eggplant',
        // Animals
        '🦊': 'Fox', '🐻': 'Bear', '🐼': 'Panda', '🐨': 'Koala',
        '🐯': 'Tiger', '🦁': 'Lion', '🐵': 'Monkey', '🐘': 'Elephant',
        '🦒': 'Giraffe', '🦓': 'Zebra', '🐆': 'Leopard', '🦘': 'Kangaroo',
        '🦛': 'Hippo', '🦏': 'Rhino', '🐊': 'Crocodile', '🦈': 'Shark',
        '🐋': 'Whale', '🐬': 'Dolphin', '🦅': 'Eagle', '🦉': 'Owl',
        '🦩': 'Flamingo', '🐧': 'Penguin', '🐺': 'Wolf', '🦇': 'Bat',
        // Food
        '🍕': 'Pizza', '🍔': 'Burger', '🌮': 'Taco', '🍜': 'Noodles',
        '🍣': 'Sushi', '🧁': 'Cupcake', '🎂': 'Cake', '🍩': 'Donut',
        '🍪': 'Cookie', '🥐': 'Croissant', '🥯': 'Bagel', '🧇': 'Waffle',
        '🥞': 'Pancakes', '🍰': 'Shortcake', '🥧': 'Pie', '🍫': 'Chocolate',
        '☕': 'Coffee', '🧃': 'Juice', '🥤': 'Drink', '🍵': 'Tea',
        '🧈': 'Butter', '🥨': 'Pretzel', '🥖': 'Bread', '🍿': 'Popcorn',
        // Ocean
        '🐙': 'Octopus', '🦑': 'Squid', '🐠': 'Tropical Fish',
        '🐡': 'Blowfish', '🐳': 'Spouting Whale', '🦐': 'Shrimp',
        '🦞': 'Lobster', '🦀': 'Crab', '🐚': 'Shell',
        '🪸': 'Coral', '🦭': 'Seal', '🪼': 'Jellyfish',
        '🦦': 'Otter', '🐢': 'Turtle', '🦪': 'Oyster',
        '🌊': 'Wave', '🏝️': 'Island', '🐟': 'Fish',
        '⚓': 'Anchor', '🚢': 'Ship', '🧜': 'Merperson',
        // Sports
        '⚽': 'Football', '🏀': 'Basketball', '🏈': 'Rugby Ball', '⚾': 'Baseball',
        '🎾': 'Tennis', '🏐': 'Volleyball', '🏉': 'Rugby', '🏒': 'Hockey',
        '🏓': 'Ping Pong', '🏸': 'Badminton', '🥊': 'Boxing', '🥋': 'Martial Arts',
        '🥅': 'Goal', '🏹': 'Archery', '🥇': 'Gold', '🥈': 'Silver',
        '🥉': 'Bronze', '🏅': 'Medal', '🎿': 'Skiing', '🛷': 'Sled',
        '⛸️': 'Ice Skate', '🥏': 'Frisbee', '🪃': 'Boomerang', '🏏': 'Cricket',
        // Flags
        '🏁': 'Finish', '🚩': 'Flag', '🇲🇾': 'Malaysia', '🏴': 'Black Flag',
        '🏳️': 'White Flag', '🇺🇸': 'USA', '🇬🇧': 'UK', '🇫🇷': 'France',
        '🇩🇪': 'Germany', '🇯🇵': 'Japan', '🇰🇷': 'Korea', '🇨🇳': 'China',
        '🇮🇳': 'India', '🇧🇷': 'Brazil', '🇦🇺': 'Australia', '🇨🇦': 'Canada',
        '🇮🇹': 'Italy', '🇪🇸': 'Spain', '🇲🇽': 'Mexico', '🇹🇷': 'Turkey',
        '🇮🇩': 'Indonesia', '🇸🇦': 'Saudi', '🇪🇬': 'Egypt', '🇿🇦': 'S. Africa',
        // Transport
        '🚗': 'Car', '🚕': 'Taxi', '🚌': 'Bus', '🚎': 'Trolley',
        '🏎️': 'Race Car', '🚓': 'Police', '🚑': 'Ambulance', '🚒': 'Fire Truck',
        '🚐': 'Minibus', '🛻': 'Pickup', '🚚': 'Truck', '🚛': 'Lorry',
        '🚜': 'Tractor', '🏍️': 'Motorcycle', '🛵': 'Scooter', '🚲': 'Bicycle',
        '🛴': 'Kick Scooter', '🚂': 'Train', '🚆': 'Railway', '🚇': 'Metro',
        '🚈': 'Light Rail', '✈️': 'Airplane', '🚁': 'Helicopter', '🛶': 'Canoe',
    },
    id: {
        // Farm
        '🐄': 'Sapi', '🐔': 'Ayam', '🦢': 'Angsa', '🐑': 'Domba',
        '🐴': 'Kuda', '🐇': 'Kelinci', '🐈': 'Kucing', '🐓': 'Ayam Jantan',
        '🦆': 'Bebek', '🐐': 'Kambing', '🐎': 'Kuda Poni', '🐈‍⬛': 'Kucing Hitam',
        '🐏': 'Domba Jantan', '🦃': 'Kalkun', '🕊️': 'Merpati', '🐂': 'Banteng',
        '🐃': 'Kerbau', '🐮': 'Muka Sapi', '🐣': 'Anak Ayam', '🦜': 'Burung Beo',
        '🦙': 'Llama', '🐪': 'Unta', '🦚': 'Merak', '🦤': 'Dodo',
        // Garden
        '🌻': 'Bunga Matahari', '🌷': 'Tulip', '🌹': 'Mawar', '🌺': 'Kembang Sepatu',
        '🌸': 'Sakura', '🌼': 'Aster', '🏵️': 'Roset', '🪻': 'Hyacinth',
        '🌾': 'Padi', '🌰': 'Kastanye', '🌿': 'Herba', '🌵': 'Kaktus',
        '🥀': 'Layu', '🪴': 'Tanaman', '🌱': 'Tunas', '🍃': 'Daun',
        '🌳': 'Pohon', '🌴': 'Palem', '🪹': 'Sarang', '🍁': 'Maple',
        '🍂': 'Daun Gugur', '🪺': 'Telur', '🪷': 'Teratai', '🫘': 'Kacang',
        // Fruits
        '🍎': 'Apel', '🍌': 'Pisang', '🍇': 'Anggur', '🍊': 'Jeruk',
        '🍓': 'Stroberi', '🍉': 'Semangka', '🍑': 'Persik', '🍒': 'Ceri',
        '🥝': 'Kiwi', '🍍': 'Nanas', '🥭': 'Mangga', '🫐': 'Blueberry',
        '🍋': 'Lemon', '🥥': 'Kelapa', '🍈': 'Melon', '🍐': 'Pir',
        '🫒': 'Zaitun', '🥑': 'Alpukat', '🍅': 'Tomat', '🫑': 'Paprika',
        '🥒': 'Mentimun', '🌽': 'Jagung', '🥕': 'Wortel', '🍆': 'Terong',
        // Animals
        '🦊': 'Rubah', '🐻': 'Beruang', '🐼': 'Panda', '🐨': 'Koala',
        '🐯': 'Harimau', '🦁': 'Singa', '🐵': 'Monyet', '🐘': 'Gajah',
        '🦒': 'Jerapah', '🦓': 'Zebra', '🐆': 'Macan Tutul', '🦘': 'Kanguru',
        '🦛': 'Kuda Nil', '🦏': 'Badak', '🐊': 'Buaya', '🦈': 'Hiu',
        '🐋': 'Paus', '🐬': 'Lumba-lumba', '🦅': 'Elang', '🦉': 'Burung Hantu',
        '🦩': 'Flamingo', '🐧': 'Penguin', '🐺': 'Serigala', '🦇': 'Kelelawar',
        // Food
        '🍕': 'Pizza', '🍔': 'Burger', '🌮': 'Taco', '🍜': 'Mie',
        '🍣': 'Sushi', '🧁': 'Cupcake', '🎂': 'Kue', '🍩': 'Donat',
        '🍪': 'Kukis', '🥐': 'Croissant', '🥯': 'Bagel', '🧇': 'Wafel',
        '🥞': 'Panekuk', '🍰': 'Kue Pendek', '🥧': 'Pai', '🍫': 'Cokelat',
        '☕': 'Kopi', '🧃': 'Jus', '🥤': 'Minuman', '🍵': 'Teh',
        '🧈': 'Mentega', '🥨': 'Pretzel', '🥖': 'Roti', '🍿': 'Popcorn',
        // Ocean
        '🐙': 'Gurita', '🦑': 'Cumi', '🐠': 'Ikan Tropis',
        '🐡': 'Ikan Buntal', '🐳': 'Paus Biru', '🦐': 'Udang',
        '🦞': 'Lobster', '🦀': 'Kepiting', '🐚': 'Kerang',
        '🪸': 'Karang', '🦭': 'Anjing Laut', '🪼': 'Ubur-ubur',
        '🦦': 'Berang-berang', '🐢': 'Kura-kura', '🦪': 'Tiram',
        '🌊': 'Ombak', '🏝️': 'Pulau', '🐟': 'Ikan',
        '⚓': 'Jangkar', '🚢': 'Kapal', '🧜': 'Duyung',
        // Sports
        '⚽': 'Sepak Bola', '🏀': 'Basket', '🏈': 'Rugby', '⚾': 'Bisbol',
        '🎾': 'Tenis', '🏐': 'Voli', '🏉': 'Rugby', '🏒': 'Hoki',
        '🏓': 'Tenis Meja', '🏸': 'Bulu Tangkis', '🥊': 'Tinju', '🥋': 'Bela Diri',
        '🥅': 'Gawang', '🏹': 'Panahan', '🥇': 'Emas', '🥈': 'Perak',
        '🥉': 'Perunggu', '🏅': 'Medali', '🎿': 'Ski', '🛷': 'Kereta Luncur',
        '⛸️': 'Sepatu Es', '🥏': 'Frisbee', '🪃': 'Bumerang', '🏏': 'Kriket',
        // Flags
        '🏁': 'Finish', '🚩': 'Bendera', '🇲🇾': 'Malaysia', '🏴': 'Bendera Hitam',
        '🏳️': 'Bendera Putih', '🇺🇸': 'Amerika', '🇬🇧': 'Inggris', '🇫🇷': 'Prancis',
        '🇩🇪': 'Jerman', '🇯🇵': 'Jepang', '🇰🇷': 'Korea', '🇨🇳': 'Tiongkok',
        '🇮🇳': 'India', '🇧🇷': 'Brasil', '🇦🇺': 'Australia', '🇨🇦': 'Kanada',
        '🇮🇹': 'Italia', '🇪🇸': 'Spanyol', '🇲🇽': 'Meksiko', '🇹🇷': 'Turki',
        '🇮🇩': 'Indonesia', '🇸🇦': 'Saudi', '🇪🇬': 'Mesir', '🇿🇦': 'Afrika Selatan',
        // Transport
        '🚗': 'Mobil', '🚕': 'Taksi', '🚌': 'Bus', '🚎': 'Troli',
        '🏎️': 'Mobil Balap', '🚓': 'Polisi', '🚑': 'Ambulans', '🚒': 'Pemadam',
        '🚐': 'Minibus', '🛻': 'Pikap', '🚚': 'Truk', '🚛': 'Truk Besar',
        '🚜': 'Traktor', '🏍️': 'Motor', '🛵': 'Skuter', '🚲': 'Sepeda',
        '🛴': 'Otoped', '🚂': 'Kereta', '🚆': 'Kereta Api', '🚇': 'Metro',
        '🚈': 'Kereta Ringan', '✈️': 'Pesawat', '🚁': 'Helikopter', '🛶': 'Kano',
    },
};

const THEMES = {
    farm: {
        name: "Farm",
        icon: "🐄",
        cards: [
            { src: "🐄", matched: false }, { src: "🐔", matched: false }, { src: "🦢", matched: false }, { src: "🐑", matched: false },
            { src: "🐴", matched: false }, { src: "🐇", matched: false }, { src: "🐈", matched: false }, { src: "🐓", matched: false },
            { src: "🦆", matched: false }, { src: "🐐", matched: false }, { src: "🐎", matched: false }, { src: "🐈‍⬛", matched: false },
            { src: "🐏", matched: false }, { src: "🦃", matched: false }, { src: "🕊️", matched: false }, { src: "🐂", matched: false },
            { src: "🐃", matched: false }, { src: "🐮", matched: false }, { src: "🐣", matched: false }, { src: "🦜", matched: false },
            { src: "🦙", matched: false }, { src: "🐪", matched: false }, { src: "🦚", matched: false }, { src: "🦤", matched: false },
        ]
    },
    garden: {
        name: "Garden",
        icon: "🌻",
        cards: [
            { src: "🌻", matched: false }, { src: "🌷", matched: false }, { src: "🌹", matched: false }, { src: "🌺", matched: false },
            { src: "🌸", matched: false }, { src: "🌼", matched: false }, { src: "🏵️", matched: false }, { src: "🪻", matched: false },
            { src: "🌾", matched: false }, { src: "🌰", matched: false }, { src: "🌿", matched: false }, { src: "🌵", matched: false },
            { src: "🥀", matched: false }, { src: "🪴", matched: false }, { src: "🌱", matched: false }, { src: "🍃", matched: false },
            { src: "🌳", matched: false }, { src: "🌴", matched: false }, { src: "🪹", matched: false }, { src: "🍁", matched: false },
            { src: "🍂", matched: false }, { src: "🪺", matched: false }, { src: "🪷", matched: false }, { src: "🫘", matched: false },
        ]
    },
    fruits: {
        name: "Fruits",
        icon: "🍎",
        cards: [
            { src: "🍎", matched: false }, { src: "🍌", matched: false }, { src: "🍇", matched: false }, { src: "🍊", matched: false },
            { src: "🍓", matched: false }, { src: "🍉", matched: false }, { src: "🍑", matched: false }, { src: "🍒", matched: false },
            { src: "🥝", matched: false }, { src: "🍍", matched: false }, { src: "🥭", matched: false }, { src: "🫐", matched: false },
            { src: "🍋", matched: false }, { src: "🥥", matched: false }, { src: "🍈", matched: false }, { src: "🍐", matched: false },
            { src: "🫒", matched: false }, { src: "🥑", matched: false }, { src: "🍅", matched: false }, { src: "🫑", matched: false },
            { src: "🥒", matched: false }, { src: "🌽", matched: false }, { src: "🥕", matched: false }, { src: "🍆", matched: false },
        ]
    },
    animals: {
        name: "Animals",
        icon: "🦊",
        cards: [
            { src: "🦊", matched: false }, { src: "🐻", matched: false }, { src: "🐼", matched: false }, { src: "🐨", matched: false },
            { src: "🐯", matched: false }, { src: "🦁", matched: false }, { src: "🐵", matched: false }, { src: "🐘", matched: false },
            { src: "🦒", matched: false }, { src: "🦓", matched: false }, { src: "🐆", matched: false }, { src: "🦘", matched: false },
            { src: "🦛", matched: false }, { src: "🦏", matched: false }, { src: "🐊", matched: false }, { src: "🦈", matched: false },
            { src: "🐋", matched: false }, { src: "🐬", matched: false }, { src: "🦅", matched: false }, { src: "🦉", matched: false },
            { src: "🦩", matched: false }, { src: "🐧", matched: false }, { src: "🐺", matched: false }, { src: "🦇", matched: false },
        ]
    },
    food: {
        name: "Food",
        icon: "🍕",
        cards: [
            { src: "🍕", matched: false }, { src: "🍔", matched: false }, { src: "🌮", matched: false }, { src: "🍜", matched: false },
            { src: "🍣", matched: false }, { src: "🧁", matched: false }, { src: "🎂", matched: false }, { src: "🍩", matched: false },
            { src: "🍪", matched: false }, { src: "🥐", matched: false }, { src: "🥯", matched: false }, { src: "🧇", matched: false },
            { src: "🥞", matched: false }, { src: "🍰", matched: false }, { src: "🥧", matched: false }, { src: "🍫", matched: false },
            { src: "☕", matched: false }, { src: "🧃", matched: false }, { src: "🥤", matched: false }, { src: "🍵", matched: false },
            { src: "🧈", matched: false }, { src: "🥨", matched: false }, { src: "🥖", matched: false }, { src: "🍿", matched: false },
        ]
    },
    ocean: {
        name: "Ocean",
        icon: "🐙",
        cards: [
            { src: "🐙", matched: false }, { src: "🦑", matched: false }, { src: "🐠", matched: false }, { src: "🐡", matched: false },
            { src: "🐳", matched: false }, { src: "🦐", matched: false }, { src: "🦞", matched: false }, { src: "🦀", matched: false },
            { src: "🐚", matched: false }, { src: "🪸", matched: false }, { src: "🦭", matched: false }, { src: "🪼", matched: false },
            { src: "🦦", matched: false }, { src: "🐢", matched: false }, { src: "🦪", matched: false }, { src: "🌊", matched: false },
            { src: "🏝️", matched: false }, { src: "🐟", matched: false }, { src: "⚓", matched: false }, { src: "🚢", matched: false },
            { src: "🧜", matched: false }, { src: "🐬", matched: false }, { src: "🐋", matched: false }, { src: "🦈", matched: false },
        ]
    },
    sports: {
        name: "Sports",
        icon: "⚽",
        cards: [
            { src: "⚽", matched: false }, { src: "🏀", matched: false }, { src: "🏈", matched: false }, { src: "⚾", matched: false },
            { src: "🎾", matched: false }, { src: "🏐", matched: false }, { src: "🏉", matched: false }, { src: "🏒", matched: false },
            { src: "🏓", matched: false }, { src: "🏸", matched: false }, { src: "🥊", matched: false }, { src: "🥋", matched: false },
            { src: "🥅", matched: false }, { src: "🏹", matched: false }, { src: "🥇", matched: false }, { src: "🥈", matched: false },
            { src: "🥉", matched: false }, { src: "🏅", matched: false }, { src: "🎿", matched: false }, { src: "🛷", matched: false },
            { src: "⛸️", matched: false }, { src: "🥏", matched: false }, { src: "🪃", matched: false }, { src: "🏏", matched: false },
        ]
    },
    flags: {
        name: "Flags",
        icon: "🏁",
        cards: [
            { src: "🏁", matched: false }, { src: "🚩", matched: false }, { src: "🇲🇾", matched: false }, { src: "🏴", matched: false },
            { src: "🏳️", matched: false }, { src: "🇺🇸", matched: false }, { src: "🇬🇧", matched: false }, { src: "🇫🇷", matched: false },
            { src: "🇩🇪", matched: false }, { src: "🇯🇵", matched: false }, { src: "🇰🇷", matched: false }, { src: "🇨🇳", matched: false },
            { src: "🇮🇳", matched: false }, { src: "🇧🇷", matched: false }, { src: "🇦🇺", matched: false }, { src: "🇨🇦", matched: false },
            { src: "🇮🇹", matched: false }, { src: "🇪🇸", matched: false }, { src: "🇲🇽", matched: false }, { src: "🇹🇷", matched: false },
            { src: "🇮🇩", matched: false }, { src: "🇸🇦", matched: false }, { src: "🇪🇬", matched: false }, { src: "🇿🇦", matched: false },
        ]
    },
    transport: {
        name: "Transport",
        icon: "🚗",
        cards: [
            { src: "🚗", matched: false }, { src: "🚕", matched: false }, { src: "🚌", matched: false }, { src: "🚎", matched: false },
            { src: "🏎️", matched: false }, { src: "🚓", matched: false }, { src: "🚑", matched: false }, { src: "🚒", matched: false },
            { src: "🚐", matched: false }, { src: "🛻", matched: false }, { src: "🚚", matched: false }, { src: "🚛", matched: false },
            { src: "🚜", matched: false }, { src: "🏍️", matched: false }, { src: "🛵", matched: false }, { src: "🚲", matched: false },
            { src: "🛴", matched: false }, { src: "🚂", matched: false }, { src: "🚆", matched: false }, { src: "🚇", matched: false },
            { src: "🚈", matched: false }, { src: "✈️", matched: false }, { src: "🚁", matched: false }, { src: "🛶", matched: false },
        ]
    },
};

const DIFFICULTIES = {
    Easy: { pairs: 6, cols: 4 },
    Medium: { pairs: 12, cols: 6 },
    Hard: { pairs: 24, cols: 8 },
};

const PLAYER_COLORS = [
    { bg: "bg-red-500", text: "text-red-700", border: "border-red-300" },
    { bg: "bg-sky-500", text: "text-sky-700", border: "border-sky-300" },
    { bg: "bg-amber-500", text: "text-amber-700", border: "border-amber-300" },
    { bg: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-300" },
    { bg: "bg-violet-500", text: "text-violet-700", border: "border-violet-300" },
    { bg: "bg-pink-500", text: "text-pink-700", border: "border-pink-300" },
    { bg: "bg-teal-500", text: "text-teal-700", border: "border-teal-300" },
    { bg: "bg-orange-500", text: "text-orange-700", border: "border-orange-300" },
    { bg: "bg-indigo-500", text: "text-indigo-700", border: "border-indigo-300" },
    { bg: "bg-lime-500", text: "text-lime-700", border: "border-lime-300" },
];

const ALL_THEMES = { ...THEMES, ...LEARNING_THEMES };

const MAX_PLAYERS = 20;


const SAVE_KEY = 'memo-game-state';

function loadSavedGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return null;
}

function clearSavedGame() {
    try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
}

const RECENT_GAMES_KEY = 'memo-recent-games';
const MAX_RECENT_GAMES = 50;

function loadRecentGames() {
    try {
        const saved = localStorage.getItem(RECENT_GAMES_KEY);
        if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return [];
}

function saveRecentGame(entry) {
    try {
        const games = loadRecentGames();
        games.unshift(entry);
        if (games.length > MAX_RECENT_GAMES) games.length = MAX_RECENT_GAMES;
        localStorage.setItem(RECENT_GAMES_KEY, JSON.stringify(games));
        return games;
    } catch { /* ignore */ }
    return [];
}

export default function GameBoard() {
    const [gameState, setGameState] = useState("setup");
    const [cards, setCards] = useState([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [disabled, setDisabled] = useState(false);

    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    const [difficulty, setDifficulty] = useState("Easy");
    const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2"]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [scores, setScores] = useState([0, 0]);
    const [theme, setTheme] = useState("farm");
    const [turnTimerEnabled, setTurnTimerEnabled] = useState(false);
    const [turnTimerSeconds, setTurnTimerSeconds] = useState(30);
    const [soundEnabled, setSoundEnabledState] = useState(true);
    const [soundVolume, setSoundVolumeState] = useState(100);
    const [matchKeepsTurn, setMatchKeepsTurn] = useState(true);
    const [showCardNumbers, setShowCardNumbers] = useState(true);
    const [showNames, setShowNames] = useState(true);
    const [speakOnFlip, setSpeakOnFlip] = useState(false);
    const [cardLang, setCardLang] = useState("en");
    const [flipCounts, setFlipCounts] = useState({});
    const [showFlipCount, setShowFlipCount] = useState(false);
    const [cardEntryKey, setCardEntryKey] = useState(0);
    const [turnTimeLeft, setTurnTimeLeft] = useState(null);
    const turnTimerRef = useRef(null);
    const [streak, setStreak] = useState(0);
    const [streakDisplay, setStreakDisplay] = useState(null);
    const lastMatchedStreakRef = useRef(0);

    const [bestScore, setBestScore] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [historyTab, setHistoryTab] = useState("best");
    const [recentGames, setRecentGames] = useState([]);

    // On mount: load best scores + sound setting + restore saved game if exists
    useEffect(() => {
        try {
            const savedSound = localStorage.getItem('flipmatch-sound-enabled');
            if (savedSound !== null) {
                const val = savedSound === 'true';
                setSoundEnabledState(val);
                setSoundEnabled(val);
            }
            const savedVolume = localStorage.getItem('flipmatch-sound-volume');
            if (savedVolume !== null) {
                const vol = Number(savedVolume);
                setSoundVolumeState(vol);
                setSoundVolume(vol / 100);
            }
        } catch { /* ignore */ }

        try {
            const savedMatchKeepsTurn = localStorage.getItem('flipmatch-match-keeps-turn');
            if (savedMatchKeepsTurn !== null) {
                setMatchKeepsTurn(savedMatchKeepsTurn === 'true');
            }
            const savedCardNumbers = localStorage.getItem('flipmatch-show-card-numbers');
            if (savedCardNumbers !== null) {
                setShowCardNumbers(savedCardNumbers === 'true');
            }
            const savedShowNames = localStorage.getItem('flipmatch-show-names');
            if (savedShowNames !== null) {
                setShowNames(savedShowNames === 'true');
            }
            const savedSpeakOnFlip = localStorage.getItem('flipmatch-speak-on-flip');
            if (savedSpeakOnFlip !== null) {
                setSpeakOnFlip(savedSpeakOnFlip === 'true');
            }
            const savedCardLang = localStorage.getItem('flipmatch-card-lang');
            if (savedCardLang === 'id' || savedCardLang === 'en') {
                setCardLang(savedCardLang);
            }
            const savedFlipCount = localStorage.getItem('flipmatch-show-flip-count');
            if (savedFlipCount !== null) {
                setShowFlipCount(savedFlipCount === 'true');
            }
        } catch { /* ignore */ }

        try {
            const saved = localStorage.getItem('memo-best-scores');
            if (saved) setBestScore(JSON.parse(saved));
        } catch { /* ignore */ }

        setRecentGames(loadRecentGames());

        const sg = loadSavedGame();
        if (sg?.gameState === "playing") {
            // Restore all game state
            setGameState("playing");
            setCards(sg.cards);
            setTurns(sg.turns);
            setDifficulty(sg.difficulty);
            setTheme(sg.theme);
            setPlayerNames(sg.playerNames);
            setCurrentPlayerIndex(sg.currentPlayerIndex);
            setScores(sg.scores);
            setElapsedTime(sg.elapsedTime || 0);
            setTurnTimerEnabled(sg.turnTimerEnabled || false);
            setTurnTimerSeconds(sg.turnTimerSeconds || 30);
            if (sg.matchKeepsTurn !== undefined) setMatchKeepsTurn(sg.matchKeepsTurn);
            if (sg.showCardNumbers !== undefined) setShowCardNumbers(sg.showCardNumbers);
            if (sg.showNames !== undefined) setShowNames(sg.showNames);

            // Resume elapsed timer from saved offset
            const resumeOffset = sg.elapsedTime || 0;
            const now = Date.now();
            startTimeRef.current = now - resumeOffset;
            timerRef.current = setInterval(() => {
                setElapsedTime(Date.now() - (now - resumeOffset));
            }, 100);

            // Resume turn timer
            if (sg.turnTimerEnabled) {
                setTurnTimeLeft(sg.turnTimerSeconds);
                const startedAt = Date.now();
                turnTimerRef.current = setInterval(() => {
                    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
                    const remaining = sg.turnTimerSeconds - elapsed;
                    if (remaining <= 0) {
                        clearInterval(turnTimerRef.current);
                        turnTimerRef.current = null;
                        setTurnTimeLeft(0);
                    } else {
                        setTurnTimeLeft(remaining);
                    }
                }, 250);
            }
        }
    }, []);

    const saveBestScore = useCallback((time, moves, diff) => {
        const key = `${theme}-${diff}-${playerNames.length}p`;
        const newBest = { ...bestScore };
        const current = newBest[key];
        if (!current || moves < current.moves || (moves === current.moves && time < current.time)) {
            newBest[key] = { moves, time, date: Date.now() };
            setBestScore(newBest);
            try { localStorage.setItem('memo-best-scores', JSON.stringify(newBest)); } catch { /* ignore */ }
            return true;
        }
        return false;
    }, [bestScore, playerNames.length]);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        const now = Date.now();
        startTimeRef.current = now;
        setElapsedTime(0);
        timerRef.current = setInterval(() => {
            setElapsedTime(Date.now() - now);
        }, 100);
    }, []);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => stopTimer();
    }, [stopTimer]);

    const startTurnTimer = useCallback(() => {
        if (!turnTimerEnabled) return;
        if (turnTimerRef.current) clearInterval(turnTimerRef.current);
        setTurnTimeLeft(turnTimerSeconds);
        const startedAt = Date.now();
        turnTimerRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startedAt) / 1000);
            const remaining = turnTimerSeconds - elapsed;
            if (remaining <= 0) {
                clearInterval(turnTimerRef.current);
                turnTimerRef.current = null;
                setTurnTimeLeft(0);
            } else {
                setTurnTimeLeft(remaining);
            }
        }, 250);
    }, [turnTimerEnabled, turnTimerSeconds]);

    const stopTurnTimer = useCallback(() => {
        if (turnTimerRef.current) {
            clearInterval(turnTimerRef.current);
            turnTimerRef.current = null;
        }
        setTurnTimeLeft(null);
    }, []);

    // Auto-skip turn when turn timer reaches 0
    useEffect(() => {
        if (turnTimeLeft === 0 && gameState === "playing" && !disabled) {
            // Close clue drawer if open
            setClueDrawer(null);
            // If one card is flipped, flip it back
            if (choiceOne && !choiceTwo) {
                setChoiceOne(null);
            }
            setCurrentPlayerIndex((prev) => (prev + 1) % playerNames.length);
            setTurns((prev) => prev + 1);
            startTurnTimer();
        }
    }, [turnTimeLeft]);

    const isLearningTheme = ALL_THEMES[theme]?.mode === "learning";

    const shuffleCards = useCallback(() => {
        const numPairs = DIFFICULTIES[difficulty].pairs;
        const themeData = ALL_THEMES[theme];
        let allCards;

        if (themeData.mode === "learning") {
            // Learning themes: flatten cardA/cardB pairs
            const selectedPairs = themeData.pairs.slice(0, numPairs);
            allCards = selectedPairs.flatMap((pair) => [
                { ...pair.cardA, pairId: pair.pairId, matched: false },
                { ...pair.cardB, pairId: pair.pairId, matched: false },
            ]);
        } else {
            // Classic themes: duplicate each card
            const selectedImages = themeData.cards.slice(0, numPairs);
            allCards = [...selectedImages, ...selectedImages];
        }

        const shuffledCards = allCards
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }));

        setChoiceOne(null);
        setChoiceTwo(null);
        setCards(shuffledCards);
        setTurns(0);
        setDisabled(false);
        setFlipCounts({});
        setCardEntryKey(k => k + 1);
    }, [difficulty, theme]);

    // Auto-save game state to localStorage when playing
    useEffect(() => {
        if (gameState !== "playing") return;
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify({
                gameState, cards, turns, difficulty, theme,
                playerNames, currentPlayerIndex, scores,
                elapsedTime, turnTimerEnabled, turnTimerSeconds, matchKeepsTurn,
                showCardNumbers, showNames,
            }));
        } catch { /* ignore */ }
    }, [gameState, cards, turns, currentPlayerIndex, scores, elapsedTime]);

    const startGame = () => {
        const trimmedNames = playerNames.map((n, i) => n.trim() || `Player ${i + 1}`);
        setPlayerNames(trimmedNames);
        setCurrentPlayerIndex(Math.floor(Math.random() * trimmedNames.length));
        setScores(new Array(trimmedNames.length).fill(0));
        setStreak(0);
        setStreakDisplay(null);
        lastMatchedStreakRef.current = 0;
        shuffleCards();
        setGameState("playing");
        startTimer();
        startTurnTimer();
    };

    const restartGame = () => {
        stopTimer();
        stopTurnTimer();
        setScores(new Array(playerNames.length).fill(0));
        setCurrentPlayerIndex(Math.floor(Math.random() * playerNames.length));
        setStreak(0);
        setStreakDisplay(null);
        lastMatchedStreakRef.current = 0;
        shuffleCards();
        setGameState("playing");
        startTimer();
    };

    const goToSetup = () => {
        stopTimer();
        stopTurnTimer();
        clearSavedGame();
        setGameState("setup");
    };

    const handleChoice = (card) => {
        if (choiceOne && choiceOne.id === card.id) return;
        playFlipSound();
        // Track flip count per card
        setFlipCounts(prev => ({ ...prev, [card.id]: (prev[card.id] || 0) + 1 }));
        // Speak card name on flip (first card only, second card handled by match/mismatch)
        if (speakOnFlip && !isLearningTheme && !choiceOne) {
            const label = EMOJI_LABELS[cardLang][card.src];
            if (label) {
                setTimeout(() => speak(label, cardLang === "id" ? "id-ID" : "en-US"), 400);
            }
        }
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    };

    const [matchFeedback, setMatchFeedback] = useState(null);
    const [clueDrawer, setClueDrawer] = useState(null);

    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true);
            // Use pairId for learning themes, src for classic themes
            const isMatch = choiceOne.pairId
                ? choiceOne.pairId === choiceTwo.pairId
                : choiceOne.src === choiceTwo.src;

            if (isMatch) {
                playCorrectSound();
                const newStreak = streak + 1;
                setStreak(newStreak);
                lastMatchedStreakRef.current = newStreak;

                // Show streak toast + play streak sound for 2+ consecutive matches
                if (newStreak >= 2) {
                    setStreakDisplay(newStreak);
                    setTimeout(() => setStreakDisplay(null), 1800);
                    playStreakSound(newStreak);
                }

                const matchKey = choiceOne.pairId || choiceOne.src;
                setCards((prevCards) =>
                    prevCards.map((card) => {
                        const cardKey = card.pairId || card.src;
                        return cardKey === matchKey ? { ...card, matched: true, matchStreak: newStreak } : card;
                    })
                );
                setScores(prev => {
                    const newScores = [...prev];
                    newScores[currentPlayerIndex] += 1;
                    return newScores;
                });

                // Classic theme: say "Matched!" when pair found
                if (speakOnFlip && !isLearningTheme) {
                    setTimeout(() => speak(cardLang === "id" ? "Cocok!" : "Matched!", cardLang === "id" ? "id-ID" : "en-US"), 400);
                }

                // Learning mode: TTS + feedback toast
                if (isLearningTheme && choiceOne.pairId) {
                    const themeData = ALL_THEMES[theme];
                    const pair = themeData.pairs.find(p => p.pairId === choiceOne.pairId);
                    if (pair) {
                        // Show feedback toast
                        setMatchFeedback({
                            pairId: pair.pairId,
                            cardA: pair.cardA,
                            cardB: pair.cardB,
                        });
                        setTimeout(() => setMatchFeedback(null), 2500);

                        // Speak the word(s)
                        if (pair.cardA.lang === "en" && pair.cardB.lang === "id") {
                            // EN-ID: speak English, then Indonesian after a delay
                            speak(pair.cardA.src, "en-US");
                            setTimeout(() => speak(pair.cardB.src, "id-ID"), 1200);
                        } else {
                            // Word-Picture / Spelling: speak the English word
                            const textCard = pair.cardA.type === "text" ? pair.cardA : pair.cardB.type === "text" ? pair.cardB : null;
                            speak(textCard ? textCard.src : pair.pairId);
                        }
                    }
                }

                resetTurn(true);
            } else {
                playWrongSound();
                setStreak(0);
                lastMatchedStreakRef.current = 0;
                // Speak second card name on mismatch
                if (speakOnFlip && !isLearningTheme) {
                    const label = EMOJI_LABELS[cardLang][choiceTwo.src];
                    if (label) {
                        setTimeout(() => speak(label, cardLang === "id" ? "id-ID" : "en-US"), 400);
                    }
                }
                setTimeout(() => resetTurn(false), 1000);
            }
        }
    }, [choiceOne, choiceTwo]);

    const resetTurn = (matched) => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setTurns((prevTurns) => prevTurns + 1);
        setDisabled(false);
        if (!matched || !matchKeepsTurn) {
            setCurrentPlayerIndex((prev) => (prev + 1) % playerNames.length);
        }
        startTurnTimer();
    };

    const [isNewBest, setIsNewBest] = useState(false);
    useEffect(() => {
        if (cards.length > 0 && cards.every((card) => card.matched)) {
            stopTimer();
            stopTurnTimer();
            clearSavedGame();
            const newBest = saveBestScore(elapsedTime, turns, difficulty);
            setIsNewBest(newBest);

            // Save to recent games history
            const themeData = THEMES[theme];
            const sortedPlayers = playerNames
                .map((name, i) => ({ name, score: scores[i] }))
                .sort((a, b) => b.score - a.score);

            // Announce winner with speech
            setTimeout(() => {
                if (playerNames.length > 1) {
                    speak(cardLang === "id" ? `${sortedPlayers[0].name} menang!` : `${sortedPlayers[0].name} wins!`, cardLang === "id" ? "id-ID" : "en-US");
                } else {
                    speak(cardLang === "id" ? "Selesai!" : "Completed!", cardLang === "id" ? "id-ID" : "en-US");
                }
            }, 500);
            const updated = saveRecentGame({
                theme,
                themeName: themeData?.name || theme,
                themeIcon: themeData?.icon || "?",
                difficulty,
                moves: turns,
                time: elapsedTime,
                date: Date.now(),
                playerCount: playerNames.length,
                players: sortedPlayers,
                winnerName: playerNames.length > 1 ? sortedPlayers[0].name : null,
            });
            setRecentGames(updated);

            setGameState("finished");
        }
    }, [cards]);

    const newPlayerRef = useRef(null);

    const addPlayer = () => {
        if (playerNames.length < MAX_PLAYERS) {
            setPlayerNames([...playerNames, ""]);
            setTimeout(() => newPlayerRef.current?.focus(), 50);
        }
    };

    const removePlayer = (index) => {
        if (playerNames.length > 1) {
            setPlayerNames(playerNames.filter((_, i) => i !== index));
        }
    };

    const updatePlayerName = (index, name) => {
        const newNames = [...playerNames];
        newNames[index] = name;
        setPlayerNames(newNames);
    };

    const shufflePlayers = () => {
        const shuffled = [...playerNames].sort(() => Math.random() - 0.5);
        setPlayerNames(shuffled);
    };

    const movePlayer = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= playerNames.length) return;
        const newNames = [...playerNames];
        [newNames[index], newNames[newIndex]] = [newNames[newIndex], newNames[index]];
        setPlayerNames(newNames);
    };

    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatRelativeDate = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        if (now.toDateString() === date.toDateString()) return "Today";
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (yesterday.toDateString() === date.toDateString()) return "Yesterday";
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // ─── SETUP SCREEN ───
    if (gameState === "setup") {
        return (
            <div className="flex items-center justify-center w-full min-h-screen p-3 sm:p-5 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-800">

                <div className="w-full max-w-5xl bg-white dark:bg-gray-800/95 rounded-3xl shadow-xl shadow-blue-900/8 p-5 sm:p-8 border border-blue-100 dark:border-gray-700/50">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <img src="/logo-with-background.png" alt="Memo Sprout" className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-md shadow-blue-500/15" />
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                    Memo Sprout
                                </h2>
                                <p className="text-blue-500/70 dark:text-blue-400/60 text-xs sm:text-sm font-medium tracking-wide">Memory Match Game</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setRecentGames(loadRecentGames()); setShowHistory(true); }}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                            title="Game History"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="hidden sm:inline">History</span>
                        </button>
                    </div>

                    {/* Two-column layout: Settings (left) + Players (right) */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">

                        {/* LEFT COLUMN: Game Settings */}
                        <div className="flex-1 space-y-6 min-w-0">
                            {/* Difficulty Selection */}
                            <div className="space-y-2.5">
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                    Difficulty
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(DIFFICULTIES).map(([diff, config]) => (
                                        <button
                                            key={diff}
                                            onClick={() => setDifficulty(diff)}
                                            className={`relative py-3 px-3 rounded-xl font-bold transition-all duration-200 ${difficulty === diff
                                                ? diff === "Hard"
                                                    ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                                                    : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                                                : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                                                }`}
                                        >
                                            <div className="text-sm font-extrabold">{diff}</div>
                                            <div className={`text-xs mt-0.5 ${difficulty === diff ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}`}>
                                                {config.pairs} pairs
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Theme Selection */}
                            <div className="space-y-2.5">
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                    Theme
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {Object.entries(THEMES).map(([key, themeData]) => (
                                        <button
                                            key={key}
                                            onClick={() => setTheme(key)}
                                            className={`relative py-3 px-2 rounded-xl font-bold transition-all duration-200 ${theme === key
                                                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                                                : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                                                }`}
                                        >
                                            <div className="text-2xl sm:text-3xl mb-0.5">{themeData.icon}</div>
                                            <div className={`text-xs font-semibold ${theme === key ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}`}>
                                                {themeData.name}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Settings Row */}
                            <div className="space-y-2.5">
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                    Settings
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Turn Timer */}
                                    <button
                                        onClick={() => setTurnTimerEnabled(!turnTimerEnabled)}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${turnTimerEnabled
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                                            : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500'
                                        }`}
                                    >
                                        <svg className={`w-5 h-5 ${turnTimerEnabled ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className={`text-xs font-bold ${turnTimerEnabled ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>Timer</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${turnTimerEnabled ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
                                            {turnTimerEnabled ? 'ON' : 'OFF'}
                                        </span>
                                    </button>

                                    {/* Sound */}
                                    <button
                                        onClick={() => {
                                            const newVal = !soundEnabled;
                                            setSoundEnabledState(newVal);
                                            setSoundEnabled(newVal);
                                            try { localStorage.setItem('flipmatch-sound-enabled', String(newVal)); } catch { /* ignore */ }
                                            if (newVal) playFlipSound();
                                        }}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${soundEnabled
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                                            : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500'
                                        }`}
                                    >
                                        <svg className={`w-5 h-5 ${soundEnabled ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {soundEnabled
                                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
                                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                            }
                                        </svg>
                                        <span className={`text-xs font-bold ${soundEnabled ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>Sound</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${soundEnabled ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
                                            {soundEnabled ? 'ON' : 'OFF'}
                                        </span>
                                    </button>

                                    {/* On Match */}
                                    <button
                                        onClick={() => {
                                            const newVal = !matchKeepsTurn;
                                            setMatchKeepsTurn(newVal);
                                            try { localStorage.setItem('flipmatch-match-keeps-turn', String(newVal)); } catch { /* ignore */ }
                                        }}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${matchKeepsTurn
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                                            : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500'
                                        }`}
                                    >
                                        <svg className={`w-5 h-5 ${matchKeepsTurn ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span className={`text-xs font-bold ${matchKeepsTurn ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                            Keep Turn
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${matchKeepsTurn ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
                                            {matchKeepsTurn ? 'KEEP' : 'SWITCH'}
                                        </span>
                                    </button>
                                </div>

                                {/* Card Numbers, Show Names, Speak Card, Flip Count, Language */}
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {/* Card Numbers */}
                                    <button
                                        onClick={() => {
                                            const newVal = !showCardNumbers;
                                            setShowCardNumbers(newVal);
                                            try { localStorage.setItem('flipmatch-show-card-numbers', String(newVal)); } catch { /* ignore */ }
                                        }}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${showCardNumbers
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                                            : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500'
                                        }`}
                                    >
                                        <svg className={`w-5 h-5 ${showCardNumbers ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                        <span className={`text-xs font-bold ${showCardNumbers ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>Card Numbers</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${showCardNumbers ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
                                            {showCardNumbers ? 'ON' : 'OFF'}
                                        </span>
                                    </button>

                                    {/* Show Names */}
                                    <button
                                        onClick={() => {
                                            const newVal = !showNames;
                                            setShowNames(newVal);
                                            try { localStorage.setItem('flipmatch-show-names', String(newVal)); } catch { /* ignore */ }
                                        }}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${showNames
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                                            : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500'
                                        }`}
                                    >
                                        <svg className={`w-5 h-5 ${showNames ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <span className={`text-xs font-bold ${showNames ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>Show Names</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${showNames ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
                                            {showNames ? 'ON' : 'OFF'}
                                        </span>
                                    </button>

                                    {/* Speak Card */}
                                    <button
                                        onClick={() => {
                                            const newVal = !speakOnFlip;
                                            setSpeakOnFlip(newVal);
                                            try { localStorage.setItem('flipmatch-speak-on-flip', String(newVal)); } catch { /* ignore */ }
                                            if (newVal) speak(cardLang === "id" ? "Sapi" : "Cow", cardLang === "id" ? "id-ID" : "en-US");
                                        }}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${speakOnFlip
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                                            : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500'
                                        }`}
                                    >
                                        <svg className={`w-5 h-5 ${speakOnFlip ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4-4h8m-4-12a3 3 0 00-3 3v4a3 3 0 006 0V7a3 3 0 00-3-3z" />
                                        </svg>
                                        <span className={`text-xs font-bold ${speakOnFlip ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>Speak Card</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${speakOnFlip ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
                                            {speakOnFlip ? 'ON' : 'OFF'}
                                        </span>
                                    </button>

                                    {/* Flip Counter */}
                                    <button
                                        onClick={() => {
                                            const newVal = !showFlipCount;
                                            setShowFlipCount(newVal);
                                            try { localStorage.setItem('flipmatch-show-flip-count', String(newVal)); } catch { /* ignore */ }
                                        }}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${showFlipCount
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                                            : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500'
                                        }`}
                                    >
                                        <svg className={`w-5 h-5 ${showFlipCount ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span className={`text-xs font-bold ${showFlipCount ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>Flip Count</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${showFlipCount ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
                                            {showFlipCount ? 'ON' : 'OFF'}
                                        </span>
                                    </button>

                                    {/* Language Toggle */}
                                    <button
                                        onClick={() => {
                                            const newLang = cardLang === "en" ? "id" : "en";
                                            setCardLang(newLang);
                                            try { localStorage.setItem('flipmatch-card-lang', newLang); } catch { /* ignore */ }
                                        }}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${cardLang === "id"
                                            ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                                        }`}
                                    >
                                        <span className="text-lg">{cardLang === "id" ? "🇮🇩" : "🇬🇧"}</span>
                                        <span className={`text-xs font-bold ${cardLang === "id" ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}`}>Language</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cardLang === "id" ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                                            {cardLang === "id" ? 'ID' : 'EN'}
                                        </span>
                                    </button>
                                </div>

                                {/* Timer seconds adjuster (only when timer is on) */}
                                {turnTimerEnabled && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600/30">
                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Turn time</span>
                                        <div className="flex items-center gap-2 ml-auto">
                                            <button
                                                onClick={() => setTurnTimerSeconds(Math.max(5, turnTimerSeconds - 5))}
                                                className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 font-bold text-sm flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                            >-</button>
                                            <span className="text-sm font-extrabold text-gray-700 dark:text-gray-200 tabular-nums w-10 text-center">{turnTimerSeconds}s</span>
                                            <button
                                                onClick={() => setTurnTimerSeconds(Math.min(120, turnTimerSeconds + 5))}
                                                className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 font-bold text-sm flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                            >+</button>
                                        </div>
                                    </div>
                                )}
                            </div>


                        </div>

                        {/* RIGHT COLUMN: Players + Start */}
                        <div className="md:w-80 flex flex-col gap-3">
                            {/* Player Header */}
                            <div className="flex justify-between items-center">
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                    Players ({playerNames.length}/{MAX_PLAYERS})
                                </label>
                                <div className="flex items-center gap-1">
                                    {playerNames.length > 1 && (
                                        <button
                                            onClick={shufflePlayers}
                                            className="flex items-center gap-1 px-2 py-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            title="Shuffle order"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={addPlayer}
                                        disabled={playerNames.length >= MAX_PLAYERS}
                                        className="flex items-center gap-1 px-2.5 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Player List (scrollable) */}
                            <div className="space-y-1.5 max-h-[400px] overflow-y-auto flex-1 pr-0.5">
                                {playerNames.map((name, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200/60 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500/30 transition-colors"
                                    >
                                        {/* Reorder buttons */}
                                        <div className="flex flex-col flex-shrink-0 gap-0.5">
                                            <button
                                                onClick={() => movePlayer(index, -1)}
                                                disabled={index === 0}
                                                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-0.5 leading-none"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => movePlayer(index, 1)}
                                                disabled={index === playerNames.length - 1}
                                                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-0.5 leading-none"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className={`flex-shrink-0 w-9 h-9 rounded-full ${PLAYER_COLORS[index % PLAYER_COLORS.length].bg} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                                            {index + 1}
                                        </div>
                                        <input
                                            ref={index === playerNames.length - 1 ? newPlayerRef : null}
                                            type="text"
                                            value={name}
                                            onChange={(e) => updatePlayerName(index, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addPlayer();
                                                }
                                            }}
                                            onFocus={(e) => e.target.select()}
                                            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none text-sm font-medium transition-colors text-slate-800 dark:text-slate-100"
                                            placeholder={`Player ${index + 1}`}
                                            maxLength={20}
                                        />
                                        {playerNames.length > 1 && (
                                            <button
                                                onClick={() => removePlayer(index)}
                                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Start Game Button */}
                            <button
                                onClick={startGame}
                                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/25 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-auto"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span>Let&apos;s Play!</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* History Modal */}
                {showHistory && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-fadeIn">
                        <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-scaleIn border-2 border-blue-200 dark:border-blue-800/30">

                            {/* Modal Header */}
                            <div className="p-5 pb-3 border-b border-blue-200/50 dark:border-gray-700/50 shrink-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <h3 className="text-xl font-extrabold text-blue-800 dark:text-blue-200">History</h3>
                                            <p className="text-xs text-blue-500 dark:text-blue-400">Your game records</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowHistory(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Tab Toggle */}
                                <div className="flex bg-blue-100 dark:bg-gray-700/50 rounded-xl p-1">
                                    <button
                                        onClick={() => setHistoryTab("best")}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                                            historyTab === "best"
                                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                                                : "text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                        }`}
                                    >
                                        Best Scores
                                    </button>
                                    <button
                                        onClick={() => setHistoryTab("recent")}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                                            historyTab === "recent"
                                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                                                : "text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                        }`}
                                    >
                                        Recent Games
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">

                                {/* BEST SCORES TAB */}
                                {historyTab === "best" && (
                                    <>
                                        {bestScore && Object.keys(bestScore).length > 0 ? (
                                            Object.entries(bestScore)
                                                .sort((a, b) => (b[1].date || 0) - (a[1].date || 0))
                                                .map(([key, score]) => {
                                                    const parts = key.split("-");
                                                    const themeKey = parts[0];
                                                    const diff = parts[1];
                                                    const themeData = THEMES[themeKey];
                                                    return (
                                                        <div key={key} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200/50 dark:border-gray-700/50">
                                                            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-2xl">
                                                                {themeData?.icon || "?"}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-bold text-blue-800 dark:text-blue-200 truncate">
                                                                        {themeData?.name || themeKey}
                                                                    </span>
                                                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                                        {diff}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                                    <span className="flex items-center gap-1">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                                        {score.moves}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                        {formatTime(score.time)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">
                                                                {score.date ? formatRelativeDate(score.date) : ""}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="text-4xl mb-3">🏆</div>
                                                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No best scores yet</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Play a game to set your first record!</p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* RECENT GAMES TAB */}
                                {historyTab === "recent" && (
                                    <>
                                        {recentGames.length > 0 ? (
                                            recentGames.map((game, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200/50 dark:border-gray-700/50">
                                                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-2xl">
                                                        {game.themeIcon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                                                game.difficulty === "Hard"
                                                                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                                                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                            }`}>
                                                                {game.difficulty}
                                                            </span>
                                                            {game.playerCount > 1 && (
                                                                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                                    {game.playerCount}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                                                            <span className="flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                                {game.moves}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                {formatTime(game.time)}
                                                            </span>
                                                            {game.winnerName && (
                                                                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                                    {game.winnerName}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">
                                                        {formatRelativeDate(game.date)}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="text-4xl mb-3">📋</div>
                                                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No recent games</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Your completed games will appear here</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 pt-3 border-t border-blue-200/50 dark:border-gray-700/50 shrink-0">
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-600/25 border border-blue-400/30"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Grid columns and rows for fitting to screen
    const cols = DIFFICULTIES[difficulty].cols;
    const totalCards = DIFFICULTIES[difficulty].pairs * 2;
    const rows = Math.ceil(totalCards / cols);
    const gridColsClass = {
        4: "grid-cols-3 sm:grid-cols-4",
        6: "grid-cols-4 sm:grid-cols-6",
        8: "grid-cols-4 sm:grid-cols-6 md:grid-cols-8",
    }[cols];

    const matchedCount = cards.filter(c => c.matched).length / 2;
    const totalPairs = DIFFICULTIES[difficulty].pairs;
    const progress = totalPairs > 0 ? (matchedCount / totalPairs) * 100 : 0;

    // ─── PLAYING SCREEN ───
    return (
        <div className="flex flex-col items-center w-full h-screen max-h-screen overflow-hidden bg-gradient-to-b from-blue-100 via-indigo-50 to-slate-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Header */}
            <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b-2 border-blue-200/50 dark:border-gray-700/50 shrink-0 z-10">
                {/* Progress bar */}
                <div className="h-1.5 bg-blue-100 dark:bg-gray-800">
                    <div
                        className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 transition-all duration-500 ease-out rounded-r-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                        {/* Left: Title + Stats */}
                        <div className="flex items-center gap-3 min-w-0">
                            <h1 className="text-lg sm:text-xl font-extrabold text-blue-800 dark:text-blue-200 whitespace-nowrap">
                                Memo Sprout
                            </h1>

                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                                    <span className="text-xs">⏱️</span>
                                    <span className="text-xs font-bold text-blue-800 dark:text-blue-200 tabular-nums">{formatTime(elapsedTime)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg border border-indigo-200/50 dark:border-indigo-800/30">
                                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">{matchedCount}/{totalPairs}</span>
                                </div>
                                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-900/20 rounded-lg border border-slate-200/50 dark:border-slate-800/30">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">{turns} moves</span>
                                </div>
                                {turnTimerEnabled && turnTimeLeft !== null && (
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${turnTimeLeft <= 5
                                        ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800/50 animate-pulse'
                                        : turnTimeLeft <= 10
                                            ? 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800/30'
                                            : 'bg-blue-100 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-800/30'
                                    }`}>
                                        <span className="text-xs">⏳</span>
                                        <span className={`text-xs font-bold tabular-nums ${turnTimeLeft <= 5
                                            ? 'text-red-700 dark:text-red-300'
                                            : turnTimeLeft <= 10
                                                ? 'text-yellow-700 dark:text-yellow-300'
                                                : 'text-blue-700 dark:text-blue-300'
                                        }`}>{turnTimeLeft}s</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Controls */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={restartGame}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                title="Restart game"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="hidden sm:inline">Restart</span>
                            </button>
                            <button
                                onClick={goToSetup}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                title="Back to setup"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="hidden sm:inline">Settings</span>
                            </button>
                        </div>
                    </div>

                    {/* Player Scoreboard */}
                    {playerNames.length > 1 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {playerNames.map((name, index) => {
                                const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
                                const isActive = index === currentPlayerIndex;
                                return (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 border ${isActive
                                            ? `${color.bg} border-white/30 shadow-md text-white`
                                            : `bg-white/80 dark:bg-gray-800 ${color.border} dark:border-gray-700 opacity-50`
                                            }`}
                                    >
                                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive
                                            ? "bg-white/25 text-white"
                                            : `${color.bg} text-white`
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <span className={`text-xs font-medium truncate max-w-[60px] ${isActive ? "text-white" : `${color.text} dark:text-gray-300`}`}>
                                            {name}
                                        </span>
                                        <span className={`text-xs font-black ${isActive ? "text-white" : "text-gray-800 dark:text-white"}`}>
                                            {scores[index]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </header>

            {/* Game Grid */}
            <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                <div
                    className={`grid ${gridColsClass} gap-1 sm:gap-2 w-full h-full max-w-5xl`}
                    style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}
                >
                    {cards.map((card, index) => {
                        const row = Math.floor(index / cols);
                        const col = index % cols;
                        const gridLabel = `${String.fromCharCode(65 + row)}${col + 1}`;
                        return (
                        <Card
                            key={`${cardEntryKey}-${card.id}`}
                            card={card}
                            cardNumber={gridLabel}
                            showCardNumbers={showCardNumbers}
                            showNames={showNames}
                            emojiLabel={EMOJI_LABELS[cardLang][card.src]}
                            handleChoice={handleChoice}
                            flipped={card === choiceOne || card === choiceTwo || card.matched}
                            disabled={disabled}
                            onClueClick={(c) => setClueDrawer(c.src)}
                            streakCount={card.matchStreak || 0}
                            flipCount={showFlipCount ? (flipCounts[card.id] || 0) : 0}
                            entryDelay={index * 30}
                        />
                        );
                    })}
                </div>
            </div>

            {/* Match Feedback Toast */}
            {matchFeedback && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-toastIn">
                    <div className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-blue-300 dark:border-blue-700">
                        <span className="text-2xl">{matchFeedback.cardA.type === "emoji" ? matchFeedback.cardA.src : matchFeedback.cardB.type === "emoji" ? matchFeedback.cardB.src : "✅"}</span>
                        <div className="text-sm font-bold text-blue-700 dark:text-blue-300">
                            {matchFeedback.cardA.src} = {matchFeedback.cardB.src}
                        </div>
                        <span className="text-lg">🔊</span>
                    </div>
                </div>
            )}

            {/* Streak Toast */}
            {streakDisplay && streakDisplay >= 2 && (
                <div className="fixed top-20 inset-x-0 z-40 flex justify-center pointer-events-none animate-streakPop">
                    <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl border-2 ${
                        streakDisplay >= 5
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-300 text-white'
                            : streakDisplay >= 3
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 border-amber-300 text-white'
                                : 'bg-gradient-to-r from-blue-400 to-indigo-500 border-blue-300 text-white'
                    }`}>
                        <span className="text-2xl">{streakDisplay >= 5 ? '🔥' : streakDisplay >= 3 ? '⚡' : '✨'}</span>
                        <span className="text-lg font-extrabold">{streakDisplay}x Streak!</span>
                    </div>
                </div>
            )}

            {/* Floating Turn Timer (visible above drawer) */}
            {clueDrawer && turnTimerEnabled && turnTimeLeft !== null && (
                <div className="fixed top-4 right-4 z-[60] animate-fadeIn">
                    <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 shadow-2xl transition-colors ${turnTimeLeft <= 5
                        ? 'bg-red-100 dark:bg-red-900/90 border-red-400 dark:border-red-600 animate-pulse'
                        : turnTimeLeft <= 10
                            ? 'bg-yellow-100 dark:bg-yellow-900/90 border-yellow-400 dark:border-yellow-600'
                            : 'bg-blue-100 dark:bg-blue-900/90 border-blue-300 dark:border-blue-600'
                    }`}>
                        <span className="text-2xl">⏳</span>
                        <span className={`text-2xl font-extrabold tabular-nums ${turnTimeLeft <= 5
                            ? 'text-red-700 dark:text-red-300'
                            : turnTimeLeft <= 10
                                ? 'text-yellow-700 dark:text-yellow-300'
                                : 'text-blue-700 dark:text-blue-300'
                        }`}>{turnTimeLeft}s</span>
                    </div>
                </div>
            )}

            {/* Clue Drawer */}
            {clueDrawer && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setClueDrawer(null)}
                >
                    <div
                        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl border-t-2 border-orange-300 dark:border-orange-700 animate-drawerUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                        </div>
                        <div className="px-6 pb-8 pt-2">
                            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-orange-800 dark:text-orange-200 font-medium italic text-center">
                                {clueDrawer}
                            </p>
                            <button
                                onClick={() => setClueDrawer(null)}
                                className="mt-5 w-full py-3 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-xl font-bold text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Win Screen Modal */}
            {gameState === "finished" && (() => {
                const rankedPlayers = playerNames.length > 1
                    ? playerNames.map((name, i) => ({ name, score: scores[i], originalIndex: i })).sort((a, b) => b.score - a.score)
                    : null;
                const winnerName = rankedPlayers ? rankedPlayers[0].name : null;
                const isSolo = playerNames.length <= 1;

                // Star rating: based on moves vs optimal (totalPairs = perfect)
                const ratio = turns / totalPairs;
                const starCount = ratio <= 1.5 ? 3 : ratio <= 2.5 ? 2 : 1;

                const handleShare = async () => {
                    const themeData = ALL_THEMES[theme];
                    const stars = Array(starCount).fill('\u2B50').join('');
                    const text = [
                        `${themeData?.icon || ''} Flip Match - ${themeData?.name || theme}`,
                        stars,
                        `${cardLang === "id" ? "Waktu" : "Time"}: ${formatTime(elapsedTime)}`,
                        `${cardLang === "id" ? "Langkah" : "Moves"}: ${turns}`,
                        `${cardLang === "id" ? "Pasangan" : "Pairs"}: ${matchedCount}/${totalPairs}`,
                        winnerName ? `${cardLang === "id" ? "Pemenang" : "Winner"}: ${winnerName}` : '',
                        '',
                        'flipmatch.mlola.com',
                    ].filter(Boolean).join('\n');

                    if (navigator.share) {
                        try { await navigator.share({ text }); } catch { /* cancelled */ }
                    } else {
                        try {
                            await navigator.clipboard.writeText(text);
                            alert(cardLang === "id" ? "Tersalin!" : "Copied!");
                        } catch { /* ignore */ }
                    }
                };

                return (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full animate-scaleIn overflow-hidden">
                        {/* Gradient header band */}
                        <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 px-6 pt-7 pb-6 text-center overflow-hidden">
                            {/* Subtle decorative circles */}
                            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
                            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10" />
                            <div className="absolute top-4 left-8 w-10 h-10 rounded-full bg-white/5" />

                            <img src="/logo-with-background.jpeg" alt="Memo Sprout" className="w-12 h-12 rounded-xl shadow-lg mx-auto mb-3 border-2 border-white/20" />

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                                {isSolo ? 'Completed!' : `${winnerName} Wins!`}
                            </h2>
                            <p className="text-blue-100 text-sm font-medium">
                                {isSolo ? 'All pairs matched' : 'Final Results'}
                            </p>

                            {/* Star Rating */}
                            <div
                                className="flex flex-col items-center gap-1 mt-3 group/stars relative cursor-help"
                                title={cardLang === "id"
                                    ? `\u2B50\u2B50\u2B50 = \u2264${Math.floor(totalPairs * 1.5)} langkah\n\u2B50\u2B50 = \u2264${Math.floor(totalPairs * 2.5)} langkah\n\u2B50 = >${Math.floor(totalPairs * 2.5)} langkah`
                                    : `\u2B50\u2B50\u2B50 = \u2264${Math.floor(totalPairs * 1.5)} moves\n\u2B50\u2B50 = \u2264${Math.floor(totalPairs * 2.5)} moves\n\u2B50 = >${Math.floor(totalPairs * 2.5)} moves`
                                }
                            >
                                <div className="flex gap-2">
                                    {[1, 2, 3].map((s) => (
                                        <span
                                            key={s}
                                            className={`text-3xl animate-starPop ${s <= starCount ? 'drop-shadow-lg' : 'opacity-30'}`}
                                            style={{ animationDelay: `${300 + s * 150}ms` }}
                                        >
                                            {s <= starCount ? '\u2B50' : '\u2606'}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-[10px] text-blue-200 font-medium opacity-0 group-hover/stars:opacity-100 transition-opacity">
                                    {cardLang === "id" ? `${turns} dari ${Math.floor(totalPairs * 1.5)} langkah optimal` : `${turns} of ${Math.floor(totalPairs * 1.5)} optimal moves`}
                                </span>
                            </div>

                            {isNewBest && (
                                <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-yellow-400/90 text-yellow-900 rounded-full text-xs font-bold animate-bounce shadow-md">
                                    New Best Score!
                                </div>
                            )}
                        </div>

                        {/* Stats bar */}
                        <div className="px-5 py-4">
                            <div className="flex justify-between bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-3 py-3.5">
                                <div className="flex-1 text-center">
                                    <div className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">Time</div>
                                    <div className="text-base font-bold text-gray-800 dark:text-gray-100 tabular-nums">{formatTime(elapsedTime)}</div>
                                </div>
                                <div className="w-px bg-gray-200 dark:bg-gray-700" />
                                <div className="flex-1 text-center">
                                    <div className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">Moves</div>
                                    <div className="text-base font-bold text-gray-800 dark:text-gray-100 tabular-nums">{turns}</div>
                                </div>
                                <div className="w-px bg-gray-200 dark:bg-gray-700" />
                                <div className="flex-1 text-center">
                                    <div className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">Pairs</div>
                                    <div className="text-base font-bold text-gray-800 dark:text-gray-100 tabular-nums">{matchedCount}/{totalPairs}</div>
                                </div>
                            </div>
                        </div>

                        {/* Player Rankings */}
                        {rankedPlayers && (
                            <div className="px-5 -mt-1">
                                <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
                                    {rankedPlayers.map((player, i) => (
                                        <div key={i} className={`flex items-center gap-3 px-3.5 py-3 rounded-xl ${i === 0
                                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 ring-1 ring-blue-200 dark:ring-blue-800'
                                            : 'bg-gray-50 dark:bg-gray-800/50'}`}
                                        >
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs ${i === 0
                                                ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/25'
                                                : i === 1
                                                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300'
                                                    : i === 2
                                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-300'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                            }`}>
                                                #{i + 1}
                                            </div>

                                            <div className={`flex-shrink-0 w-3 h-3 rounded-full ${PLAYER_COLORS[player.originalIndex % PLAYER_COLORS.length].bg}`} />
                                            <span className={`text-sm font-semibold truncate flex-1 min-w-0 ${i === 0 ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{player.name}</span>

                                            <span className={`text-sm font-bold tabular-nums flex-shrink-0 ${i === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>{player.score} pairs</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="px-5 pb-5 pt-4 flex gap-3">
                            <button
                                onClick={goToSetup}
                                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                New Setup
                            </button>
                            <button
                                onClick={restartGame}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20"
                            >
                                Play Again
                            </button>
                            <button
                                onClick={handleShare}
                                className="py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-green-600/20"
                                title="Share"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
                );
            })()}
        </div>
    );
}
