import { db } from "../server/db";
import { restaurants, menuItems, reviews } from "../shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await db.delete(reviews);
    await db.delete(menuItems);
    await db.delete(restaurants);

    // Create restaurant entries
    console.log("Creating restaurants...");
    const restaurantsData = [
        {
            name: "The Rustic Table",
            description: "Farm-to-table dining with seasonal ingredients sourced from local farms. Our rustic ambiance creates the perfect setting for a memorable dining experience.",
            cuisine: "American",
            priceRange: "medium",
            address: "123 Main Street, Anytown, USA",
            phone: "(555) 123-4567",
            email: "info@rustictable.com",
            imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200",
            openingHours: "Mon-Sun: 11:00 AM - 10:00 PM",
        },
        {
            name: "Sakura Sushi",
            description: "Authentic Japanese cuisine featuring the freshest seafood and traditional preparation methods. Our experienced chefs create beautiful, flavorful sushi experiences.",
            cuisine: "Japanese",
            priceRange: "high",
            address: "456 Ocean Drive, Seaside, USA",
            phone: "(555) 987-6543",
            email: "hello@sakurasushi.com",
            imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=200",
            openingHours: "Tue-Sun: 12:00 PM - 11:00 PM, Closed Mondays",
        },
        {
            name: "La Piazza",
            description: "Family-owned Italian restaurant serving traditional recipes passed down through generations. Enjoy our warm atmosphere and authentic flavors from various regions of Italy.",
            cuisine: "Italian",
            priceRange: "medium",
            address: "789 Olive Lane, Westside, USA",
            phone: "(555) 456-7890",
            email: "ciao@lapiazza.com",
            imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=200",
            openingHours: "Mon-Sat: 11:30 AM - 10:30 PM, Sun: 12:00 PM - 9:00 PM",
        }
    ];

    const insertedRestaurants = [];
    for (const restaurant of restaurantsData) {
        const [inserted] = await db.insert(restaurants).values(restaurant).returning();
        insertedRestaurants.push(inserted);
        console.log(`Created restaurant: ${inserted.name} (${inserted.id})`);
    }

    // Create menu items for each restaurant
    console.log("\nCreating menu items...");

    // Function to create menu items for a restaurant
    const createMenuItems = async (restaurantId: string, restaurantCuisine: string) => {
        const menuCategories = {
            Starters: getMenuItemsForCategory("Starters", restaurantCuisine),
            "Main Course": getMenuItemsForCategory("Main Course", restaurantCuisine),
            Desserts: getMenuItemsForCategory("Desserts", restaurantCuisine),
            Drinks: getMenuItemsForCategory("Drinks", restaurantCuisine)
        };

        for (const [category, items] of Object.entries(menuCategories)) {
            for (const item of items) {
                const menuItem = {
                    ...item,
                    restaurantId,
                    category
                };

                const [inserted] = await db.insert(menuItems).values(menuItem).returning();
                console.log(`Created menu item: ${inserted.name} for restaurant ID ${restaurantId}`);

                // Add reviews for each menu item - ensure minimum of 1 review
                const minReviews = 1;
                const maxReviews = 5;
                const reviewCount = Math.floor(Math.random() * (maxReviews - minReviews + 1)) + minReviews; // 1-5 reviews per item
                let totalRating = 0;

                for (let i = 0; i < reviewCount; i++) {
                    const rating = Math.floor(Math.random() * 3) + 3; // 3-5 star ratings
                    totalRating += rating;

                    await db.insert(reviews).values({
                        restaurantId,
                        menuItemId: inserted.id,
                        rating,
                        comment: getRandomReview(),
                        customerName: getRandomName(),
                        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Within last 30 days
                    });
                }

                // Update the menu item with the correct total reviews and average rating
                const avgRating = (totalRating / reviewCount).toFixed(1);
                await db.update(menuItems)
                    .set({
                        totalRating: avgRating,
                        totalReviews: reviewCount
                    })
                    .where(eq(menuItems.id, inserted.id));

                console.log(`Added ${reviewCount} reviews for menu item: ${inserted.name}, avg rating: ${avgRating}`);
            }
        }
    };

    // Create menu items for each restaurant
    for (const restaurant of insertedRestaurants) {
        await createMenuItems(restaurant.id, restaurant.cuisine);
    }

    console.log("✅ Seeding completed successfully!");
}

// Helper function to get menu items for a specific category and cuisine
function getMenuItemsForCategory(category: string, cuisine: string): any[] {
    const menuMap: Record<string, Record<string, any[]>> = {
        "American": {
            "Starters": [
                {
                    name: "Farm Fresh Salad",
                    description: "Locally sourced greens, heirloom tomatoes, cucumber, and house vinaigrette",
                    price: "10.99",
                    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
                    available: true,
                    prepTime: 10,
                    tags: "vegetarian,healthy,special"
                },
                {
                    name: "Artisanal Cheese Board",
                    description: "Selection of local cheeses, house-made preserves, honey, and artisan crackers",
                    price: "15.99",
                    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500",
                    available: true,
                    prepTime: 15,
                    tags: "vegetarian,popular"
                },
                {
                    name: "Buffalo Wings",
                    description: "Crispy chicken wings tossed in our signature spicy sauce, served with blue cheese dip",
                    price: "12.99",
                    imageUrl: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=500",
                    available: true,
                    prepTime: 20,
                    tags: "popular,spicy"
                },
                {
                    name: "Loaded Potato Skins",
                    description: "Crispy potato skins topped with cheddar, bacon, green onions, and sour cream",
                    price: "9.99",
                    imageUrl: "https://images.unsplash.com/photo-1579114957860-fd7e7e6d4a84?w=500",
                    available: true,
                    prepTime: 15,
                    tags: "popular"
                }
            ],
            "Main Course": [
                {
                    name: "Grass-Fed Ribeye Steak",
                    description: "12oz locally raised beef, herb butter, garlic mashed potatoes and seasonal vegetables",
                    price: "32.99",
                    imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500",
                    available: true,
                    prepTime: 25,
                    tags: "popular,special"
                },
                {
                    name: "Wild Mushroom Risotto",
                    description: "Creamy arborio rice, foraged mushrooms, parmesan, and truffle oil",
                    price: "19.99",
                    imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500",
                    available: true,
                    prepTime: 20,
                    tags: "vegetarian,special"
                },
                {
                    name: "Rustic Burger",
                    description: "House-ground beef patty, aged cheddar, caramelized onions, and special sauce on a brioche bun",
                    price: "16.99",
                    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
                    available: true,
                    prepTime: 18,
                    tags: "popular"
                },
                {
                    name: "Cedar Plank Salmon",
                    description: "Wild-caught salmon, roasted on a cedar plank with lemon herb butter, served with quinoa pilaf",
                    price: "24.99",
                    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500",
                    available: true,
                    prepTime: 22,
                    tags: "healthy,special"
                }
            ],
            "Desserts": [
                {
                    name: "Apple Pie",
                    description: "Traditional apple pie with a flaky crust, served with vanilla ice cream",
                    price: "8.99",
                    imageUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=500",
                    available: true,
                    prepTime: 15,
                    tags: "popular,special"
                },
                {
                    name: "Chocolate Lava Cake",
                    description: "Warm chocolate cake with a molten center, served with berry compote",
                    price: "9.99",
                    imageUrl: "https://images.unsplash.com/photo-1617305855058-336d26f9d352?w=500",
                    available: true,
                    prepTime: 18,
                    tags: "popular,special"
                },
                {
                    name: "New York Cheesecake",
                    description: "Classic creamy cheesecake with a graham cracker crust and seasonal fruit topping",
                    price: "8.99",
                    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500",
                    available: true,
                    prepTime: 10,
                    tags: "popular"
                },
                {
                    name: "Seasonal Berry Crumble",
                    description: "Fresh seasonal berries with a buttery crumble topping, served warm with ice cream",
                    price: "8.99",
                    imageUrl: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=500",
                    available: true,
                    prepTime: 15,
                    tags: "seasonal,special"
                }
            ],
            "Drinks": [
                {
                    name: "Craft Beer Flight",
                    description: "Selection of four local craft beers, 4oz each",
                    price: "14.99",
                    imageUrl: "https://images.unsplash.com/photo-1525034687081-c46fb015efc8?w=500",
                    available: true,
                    prepTime: 5,
                    tags: "alcoholic,popular"
                },
                {
                    name: "Artisanal Lemonade",
                    description: "House-made lemonade with fresh herbs and local honey",
                    price: "4.99",
                    imageUrl: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=500",
                    available: true,
                    prepTime: 5,
                    tags: "non-alcoholic,special"
                },
                {
                    name: "Signature Old Fashioned",
                    description: "Small-batch bourbon, house bitters, orange peel, and a touch of maple",
                    price: "12.99",
                    imageUrl: "https://images.unsplash.com/photo-1551751299-1b51cab2694c?w=500",
                    available: true,
                    prepTime: 8,
                    tags: "alcoholic,popular"
                },
                {
                    name: "Organic Cold Brew Coffee",
                    description: "Smooth, rich cold brew made with locally roasted organic beans",
                    price: "4.99",
                    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500",
                    available: true,
                    prepTime: 3,
                    tags: "non-alcoholic"
                }
            ]
        },
        "Japanese": {
            "Starters": [
                {
                    name: "Miso Soup",
                    description: "Traditional Japanese soup with tofu, seaweed, and green onions",
                    price: "5.99",
                    imageUrl: "https://images.unsplash.com/photo-1578020190125-f4e8064e4144?w=500",
                    available: true,
                    prepTime: 5,
                    tags: "vegetarian,healthy"
                },
                {
                    name: "Edamame",
                    description: "Steamed young soybeans, lightly salted",
                    price: "6.99",
                    imageUrl: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=500",
                    available: true,
                    prepTime: 8,
                    tags: "vegetarian,vegan,healthy"
                },
                {
                    name: "Gyoza",
                    description: "Pan-fried pork and vegetable dumplings, served with dipping sauce",
                    price: "8.99",
                    imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500",
                    available: true,
                    prepTime: 12,
                    tags: "popular"
                },
                {
                    name: "Agedashi Tofu",
                    description: "Lightly fried tofu in dashi broth with green onions and ginger",
                    price: "7.99",
                    imageUrl: "https://images.unsplash.com/photo-1546069901-eacef0df6022?w=500",
                    available: true,
                    prepTime: 10,
                    tags: "vegetarian"
                }
            ],
            "Main Course": [
                {
                    name: "Assorted Sushi Platter",
                    description: "Chef's selection of premium nigiri and maki rolls, 12 pieces",
                    price: "29.99",
                    imageUrl: "https://images.unsplash.com/photo-1583623733237-4d5764a9dc82?w=500",
                    available: true,
                    prepTime: 15,
                    tags: "special,popular"
                },
                {
                    name: "Teriyaki Salmon",
                    description: "Grilled salmon glazed with house-made teriyaki sauce, served with steamed rice and vegetables",
                    price: "22.99",
                    imageUrl: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=500",
                    available: true,
                    prepTime: 20,
                    tags: "healthy"
                },
                {
                    name: "Tonkotsu Ramen",
                    description: "Rich pork broth, chashu pork, soft-boiled egg, bamboo shoots, and green onions",
                    price: "18.99",
                    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500",
                    available: true,
                    prepTime: 15,
                    tags: "popular"
                },
                {
                    name: "Vegetable Tempura Udon",
                    description: "Thick wheat noodles in dashi broth with assorted vegetable tempura",
                    price: "16.99",
                    imageUrl: "https://images.unsplash.com/photo-1618841557478-f0aad51b8405?w=500",
                    available: true,
                    prepTime: 18,
                    tags: "vegetarian"
                }
            ],
            "Desserts": [
                {
                    name: "Matcha Green Tea Ice Cream",
                    description: "Homemade matcha ice cream, topped with red bean paste",
                    price: "6.99",
                    imageUrl: "https://images.unsplash.com/photo-1546470427-04d2191df82d?w=500",
                    available: true,
                    prepTime: 5,
                    tags: "vegetarian,special"
                },
                {
                    name: "Mochi Ice Cream",
                    description: "Assorted rice cake mochi filled with ice cream, 3 pieces",
                    price: "7.99",
                    imageUrl: "https://images.unsplash.com/photo-1587314156739-5700fae3c9a2?w=500",
                    available: true,
                    prepTime: 5,
                    tags: "vegetarian,popular"
                },
                {
                    name: "Dorayaki",
                    description: "Traditional Japanese sweet pancakes filled with sweet red bean paste",
                    price: "6.99",
                    imageUrl: "https://images.unsplash.com/photo-1609252509088-04cc115ee50c?w=500",
                    available: true,
                    prepTime: 8,
                    tags: "vegetarian"
                },
                {
                    name: "Seasonal Fruit with Yuzu Sorbet",
                    description: "Fresh seasonal fruit with refreshing house-made yuzu citrus sorbet",
                    price: "8.99",
                    imageUrl: "https://images.unsplash.com/photo-1488477304172-0ccd118477c7?w=500",
                    available: true,
                    prepTime: 10,
                    tags: "vegan,healthy,seasonal"
                }
            ],
            "Drinks": [
                {
                    name: "Premium Sake Flight",
                    description: "Selection of three premium sakes, 2oz each",
                    price: "18.99",
                    imageUrl: "https://images.unsplash.com/photo-1594284645139-3358139fcbb7?w=500",
                    available: true,
                    prepTime: 5,
                    tags: "alcoholic,special"
                },
                {
                    name: "Japanese Green Tea",
                    description: "Traditional sencha green tea, served hot",
                    price: "3.99",
                    imageUrl: "https://images.unsplash.com/photo-1556682851-b4600a5b0008?w=500",
                    available: true,
                    prepTime: 4,
                    tags: "non-alcoholic,healthy"
                },
                {
                    name: "Yuzu Lemonade",
                    description: "Refreshing lemonade with Japanese yuzu citrus",
                    price: "4.99",
                    imageUrl: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500",
                    available: true,
                    prepTime: 5,
                    tags: "non-alcoholic,special"
                },
                {
                    name: "Ramune Soda",
                    description: "Traditional Japanese marble soda in assorted flavors",
                    price: "4.50",
                    imageUrl: "https://images.unsplash.com/photo-1596803244618-8dce33789631?w=500",
                    available: true,
                    prepTime: 2,
                    tags: "non-alcoholic,popular"
                }
            ]
        },
        "Italian": {
            "Starters": [
                {
                    name: "Bruschetta",
                    description: "Toasted ciabatta bread topped with diced tomatoes, fresh basil, garlic, and extra virgin olive oil",
                    price: "9.99",
                    imageUrl: "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=500",
                    available: true,
                    prepTime: 10,
                    tags: "vegetarian,popular"
                },
                {
                    name: "Caprese Salad",
                    description: "Fresh mozzarella, heirloom tomatoes, and basil with a balsamic glaze",
                    price: "12.99",
                    imageUrl: "https://images.unsplash.com/photo-1595587870672-c79b47875c6a?w=500",
                    available: true,
                    prepTime: 8,
                    tags: "vegetarian,healthy"
                },
                {
                    name: "Antipasto Platter",
                    description: "Selection of Italian cured meats, cheeses, olives, and marinated vegetables",
                    price: "16.99",
                    imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500",
                    available: true,
                    prepTime: 12,
                    tags: "popular,special"
                },
                {
                    name: "Arancini",
                    description: "Crispy fried risotto balls stuffed with mozzarella and peas, served with marinara sauce",
                    price: "10.99",
                    imageUrl: "https://images.unsplash.com/photo-1628894281225-e7c5becec490?w=500",
                    available: true,
                    prepTime: 15,
                    tags: "vegetarian"
                }
            ],
            "Main Course": [
                {
                    name: "Margherita Pizza",
                    description: "Classic pizza with San Marzano tomato sauce, fresh mozzarella, and basil",
                    price: "15.99",
                    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
                    available: true,
                    prepTime: 20,
                    tags: "vegetarian,popular"
                },
                {
                    name: "Spaghetti Carbonara",
                    description: "Traditional Roman pasta with pancetta, eggs, Pecorino Romano cheese, and black pepper",
                    price: "17.99",
                    imageUrl: "https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?w=500",
                    available: true,
                    prepTime: 15,
                    tags: "popular"
                },
                {
                    name: "Osso Buco",
                    description: "Slow-braised veal shanks with vegetables, white wine, and gremolata, served with risotto",
                    price: "29.99",
                    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
                    available: true,
                    prepTime: 25,
                    tags: "special"
                },
                {
                    name: "Eggplant Parmigiana",
                    description: "Layers of fried eggplant, tomato sauce, mozzarella, and Parmesan, baked to perfection",
                    price: "18.99",
                    imageUrl: "https://images.unsplash.com/photo-1629115916087-7e8c114a5aba?w=500",
                    available: true,
                    prepTime: 22,
                    tags: "vegetarian"
                }
            ],
            "Desserts": [
                {
                    name: "Tiramisu",
                    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
                    price: "8.99",
                    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500",
                    available: true,
                    prepTime: 10,
                    tags: "popular,special"
                },
                {
                    name: "Cannoli",
                    description: "Crispy pastry shells filled with sweet ricotta cheese and chocolate chips",
                    price: "7.99",
                    imageUrl: "https://images.unsplash.com/photo-1623246123320-0d6636755796?w=500",
                    available: true,
                    prepTime: 8,
                    tags: "popular"
                },
                {
                    name: "Panna Cotta",
                    description: "Creamy vanilla custard topped with seasonal berry compote",
                    price: "8.50",
                    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500",
                    available: true,
                    prepTime: 5,
                    tags: "special"
                },
                {
                    name: "Affogato",
                    description: "Vanilla gelato 'drowned' with a shot of hot espresso",
                    price: "6.99",
                    imageUrl: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500",
                    available: true,
                    prepTime: 3,
                    tags: "special"
                }
            ],
            "Drinks": [
                {
                    name: "Italian Wine Flight",
                    description: "Selection of three Italian wines, 3oz each",
                    price: "16.99",
                    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500",
                    available: true,
                    prepTime: 5,
                    tags: "alcoholic,special"
                },
                {
                    name: "Espresso",
                    description: "Traditional Italian coffee, served with a twist of lemon peel",
                    price: "3.50",
                    imageUrl: "https://images.unsplash.com/photo-1510591509098-f4b5d5e0d77f?w=500",
                    available: true,
                    prepTime: 3,
                    tags: "non-alcoholic"
                },
                {
                    name: "Aperol Spritz",
                    description: "Classic Italian aperitif with Aperol, Prosecco, and soda water",
                    price: "10.99",
                    imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
                    available: true,
                    prepTime: 5,
                    tags: "alcoholic,popular"
                },
                {
                    name: "Limonata",
                    description: "Refreshing homemade Italian lemonade with fresh mint",
                    price: "4.99",
                    imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500",
                    available: true,
                    prepTime: 6,
                    tags: "non-alcoholic,special"
                }
            ]
        }
    };

    return menuMap[cuisine]?.[category] || [];
}

// Helper functions for random review generation
function getRandomReview(): string {
    const reviews = [
        "Absolutely delicious! Will definitely order again.",
        "Great flavor and presentation. Highly recommend.",
        "One of my favorites on the menu.",
        "Good portion size and very tasty.",
        "Perfectly prepared and so flavorful.",
        "A must-try when visiting this restaurant.",
        "Exceeded my expectations. So good!",
        "Great value for the price.",
        "The flavors were amazing.",
        "Loved it! Will be coming back for more."
    ];
    return reviews[Math.floor(Math.random() * reviews.length)];
}

function getRandomName(): string {
    const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth"];
    const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${lastName[0]}.`;
}

seed().catch(console.error); 