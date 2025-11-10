
const PLANT_DATA = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    latinName: "Monstera deliciosa",
    category: "Indoor",
    price: 35.00,
    description: "Known for its iconic split leaves, the Monstera Deliciosa adds a touch of the tropics to any room. It's a relatively easy-care plant that makes a bold statement.",
    careInstructions: {
      light: "Bright, indirect light. Avoid direct sun.",
      water: "Water every 1-2 weeks, allowing soil to dry out between waterings.",
      soil: "Well-draining potting mix."
    },
    image: "https://picsum.photos/seed/monstera/600/600",
    isSeasonal: false,
    stock: 25,
  },
  {
    id: 2,
    name: "Snake Plant",
    latinName: "Dracaena trifasciata",
    category: "Indoor",
    price: 25.00,
    description: "The Snake Plant is a superhero of houseplants. It's incredibly resilient, tolerates low light, and purifies the air. Perfect for beginners!",
    careInstructions: {
      light: "Low to bright, indirect light.",
      water: "Allow soil to dry out completely. Water sparingly, especially in winter.",
      soil: "Sandy, well-draining mix."
    },
    image: "https://picsum.photos/seed/snakeplant/600/600",
    isSeasonal: false,
    stock: 40,
  },
  {
    id: 3,
    name: "Lavender",
    latinName: "Lavandula",
    category: "Outdoor",
    price: 15.00,
    description: "A fragrant herb known for its beautiful purple flowers and calming scent. Lavender thrives in sunny spots and is great for gardens or patios.",
    careInstructions: {
      light: "Full sun (6-8 hours daily).",
      water: "Water deeply but infrequently, once the soil is dry.",
      soil: "Well-drained, slightly alkaline soil."
    },
    image: "https://picsum.photos/seed/lavender/600/600",
    isSeasonal: true,
    stock: 50,
  },
  {
    id: 4,
    name: "Fiddle Leaf Fig",
    latinName: "Ficus lyrata",
    category: "Indoor",
    price: 75.00,
    description: "A trendy and elegant indoor tree with large, violin-shaped leaves. It's a bit of a diva but rewards consistent care with stunning foliage.",
    careInstructions: {
      light: "Bright, indirect light. Likes a stable environment.",
      water: "Water when the top inch of soil is dry. Don't overwater.",
      soil: "Well-draining, nutrient-rich soil."
    },
    image: "https://picsum.photos/seed/fiddleleaf/600/600",
    isSeasonal: false,
    stock: 10,
  },
  {
    id: 5,
    name: "Tomato Seeds",
    latinName: "Solanum lycopersicum",
    category: "Seeds",
    price: 4.50,
    description: "High-quality heirloom tomato seeds. Grow your own delicious, juicy tomatoes right in your backyard. Perfect for salads, sauces, and sandwiches.",
    careInstructions: {
      light: "Full sun.",
      water: "Consistent watering is key.",
      soil: "Rich, well-drained soil."
    },
    image: "https://picsum.photos/seed/tomatoseeds/600/600",
    isSeasonal: true,
    stock: 150,
  },
   {
    id: 6,
    name: "Boxwood Shrub",
    latinName: "Buxus",
    category: "Outdoor",
    price: 45.00,
    description: "A classic evergreen shrub perfect for creating hedges, borders, or topiaries. Boxwoods are deer-resistant and provide year-round structure to the garden.",
    careInstructions: {
      light: "Full sun to partial shade.",
      water: "Keep soil moist, especially for new plants. Mulch helps retain moisture.",
      soil: "Well-drained, slightly acidic to slightly alkaline soil."
    },
    image: "https://picsum.photos/seed/boxwood/600/600",
    isSeasonal: false,
    stock: 30,
  },
];

const GARDENING_TIPS = [
    {
        id: 1,
        title: "Understanding Your Soil",
        content: "The foundation of a great garden is great soil. Before you plant, it's a good idea to understand your soil type—whether it's clay, sandy, or loamy. You can improve most soil types by adding organic compost, which enhances drainage, aeration, and nutrient content. A simple soil test can also tell you about its pH and nutrient levels, helping you choose the right plants and fertilizers."
    },
    {
        id: 2,
        title: "The Right Way to Water",
        content: "It's better to water your plants deeply and less frequently than to give them a shallow sprinkle every day. Deep watering encourages roots to grow downward, making them stronger and more drought-resistant. The best time to water is early in the morning to minimize evaporation and allow leaves to dry before nightfall, which helps prevent fungal diseases."
    },
];

module.exports = { PLANT_DATA, GARDENING_TIPS };
