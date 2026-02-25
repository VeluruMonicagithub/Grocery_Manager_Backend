import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const recipesData = [
    // Vegetarian South Indian
    {
        title: "Classic Masala Dosa",
        description: "Crispy fermented crepe filled with spiced potato mash, served with coconut chutney & sambar.",
        dietary_tags: ["Vegetarian", "Vegan", "Budget"],
        calories: 350,
        protein: 8,
        carbs: 55,
        fat: 10,
        image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ingredients: [
            { ingredient_name: "Dosa Batter (Rice & Urad Dal)", quantity: 200, unit: "ml" },
            { ingredient_name: "Potatoes", quantity: 2, unit: "medium" },
            { ingredient_name: "Onions", quantity: 1, unit: "medium" },
            { ingredient_name: "Mustard Seeds", quantity: 1, unit: "tsp" },
            { ingredient_name: "Curry Leaves", quantity: 10, unit: "leaves" }
        ]
    },
    {
        title: "Soft Idli & Sambar",
        description: "Steamed, spongy lentil and rice cakes served with a warm, tangy vegetable lentil stew.",
        dietary_tags: ["Vegetarian", "Vegan", "High Carb", "Low Fat"],
        calories: 280,
        protein: 10,
        carbs: 45,
        fat: 3,
        image_url: "https://images.unsplash.com/photo-1589301760014-d929f39ce9de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // using dosa image placeholder as it has idli vibes often or similar setting
        ingredients: [
            { ingredient_name: "Idli Rava", quantity: 150, unit: "g" },
            { ingredient_name: "Urad Dal", quantity: 50, unit: "g" },
            { ingredient_name: "Toor Dal (for Sambar)", quantity: 100, unit: "g" },
            { ingredient_name: "Mixed Vegetables (Carrot, Beans, Drumstick)", quantity: 150, unit: "g" },
            { ingredient_name: "Tamarind Paste", quantity: 1, unit: "tbsp" }
        ]
    },
    {
        title: "Authentic Lemon Rice",
        description: "A zesty, tangy rice dish tempered with mustard seeds, peanuts, and fresh lemon juice.",
        dietary_tags: ["Vegetarian", "Vegan", "Quick Meals"],
        calories: 400,
        protein: 7,
        carbs: 65,
        fat: 12,
        image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Using bowl placeholder
        ingredients: [
            { ingredient_name: "Cooked Basmati Rice", quantity: 200, unit: "g" },
            { ingredient_name: "Lemons", quantity: 2, unit: "piece" },
            { ingredient_name: "Roasted Peanuts", quantity: 30, unit: "g" },
            { ingredient_name: "Curry Leaves", quantity: 15, unit: "leaves" },
            { ingredient_name: "Turmeric Powder", quantity: 0.5, unit: "tsp" }
        ]
    },
    {
        title: "Kerala Appam with Veg Stew",
        description: "Lace-edged, fluffy coconut milk pancakes served with a mild, creamy vegetable stew.",
        dietary_tags: ["Vegetarian", "Vegan", "Gluten-Free"],
        calories: 320,
        protein: 6,
        carbs: 48,
        fat: 11,
        image_url: "https://images.unsplash.com/photo-1626779848520-221d6360b370?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Using general indian dish placeholder
        ingredients: [
            { ingredient_name: "Appam Batter (Rice & Coconut)", quantity: 250, unit: "ml" },
            { ingredient_name: "Coconut Milk", quantity: 200, unit: "ml" },
            { ingredient_name: "Potatoes", quantity: 2, unit: "medium" },
            { ingredient_name: "Carrots", quantity: 1, unit: "medium" },
            { ingredient_name: "Green Peas", quantity: 50, unit: "g" }
        ]
    },
    {
        title: "Bisi Bele Bath",
        description: "A spicy, tangy, and rich one-pot meal made of rice, lentils, vegetables, and aromatic spices from Karnataka.",
        dietary_tags: ["Vegetarian", "High Fiber", "Comfort Food"],
        calories: 450,
        protein: 12,
        carbs: 65,
        fat: 15,
        image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // General bowl placeholder
        ingredients: [
            { ingredient_name: "Rice", quantity: 100, unit: "g" },
            { ingredient_name: "Toor Dal", quantity: 100, unit: "g" },
            { ingredient_name: "Bisi Bele Bath Masala", quantity: 2, unit: "tbsp" },
            { ingredient_name: "Mixed Vegetables", quantity: 200, unit: "g" },
            { ingredient_name: "Ghee", quantity: 2, unit: "tbsp" }
        ]
    },

    // Non-Vegetarian South Indian
    {
        title: "Chettinad Chicken Curry",
        description: "A fiery, deeply aromatic chicken curry made with roasted spices and coconut from Tamil Nadu.",
        dietary_tags: ["Non-Vegetarian", "High Protein", "Spicy"],
        calories: 480,
        protein: 35,
        carbs: 10,
        fat: 32,
        image_url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { ingredient_name: "Chicken (bone-in)", quantity: 500, unit: "g" },
            { ingredient_name: "Onions", quantity: 2, unit: "medium" },
            { ingredient_name: "Tomatoes", quantity: 2, unit: "medium" },
            { ingredient_name: "Chettinad Masala Space Blend", quantity: 3, unit: "tbsp" },
            { ingredient_name: "Grated Coconut", quantity: 4, unit: "tbsp" }
        ]
    },
    {
        title: "Kerala Fish Curry (Meen Vevichathu)",
        description: "A tangy, spicy red fish curry commonly made with Seer fish or Kingfish and Kokum.",
        dietary_tags: ["Non-Vegetarian", "High Protein", "Low-Carb", "Pescatarian"],
        calories: 390,
        protein: 38,
        carbs: 8,
        fat: 22,
        image_url: "https://images.unsplash.com/photo-1599317374092-23c21bf44a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // using a general curry/fish image
        ingredients: [
            { ingredient_name: "Fish Steaks (Kingfish/Seer)", quantity: 400, unit: "g" },
            { ingredient_name: "Kashmiri Red Chilli Powder", quantity: 2, unit: "tbsp" },
            { ingredient_name: "Malabar Tamarind (Kudampuli)", quantity: 3, unit: "piece" },
            { ingredient_name: "Shallots", quantity: 15, unit: "piece" },
            { ingredient_name: "Coconut Oil", quantity: 2, unit: "tbsp" }
        ]
    },
    {
        title: "Hyderabadi Chicken Biryani",
        description: "The crown jewel of Indian cuisine. Basmati rice cooked with marinated chicken, saffron, and rich spices.",
        dietary_tags: ["Non-Vegetarian", "High Protein", "High Carb"],
        calories: 650,
        protein: 30,
        carbs: 70,
        fat: 25,
        image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { ingredient_name: "Basmati Rice", quantity: 300, unit: "g" },
            { ingredient_name: "Chicken (bone-in)", quantity: 500, unit: "g" },
            { ingredient_name: "Yogurt", quantity: 200, unit: "ml" },
            { ingredient_name: "Fried Onions (Birista)", quantity: 100, unit: "g" },
            { ingredient_name: "Biryani Spices (Cardamom, Cloves, Cinnamon)", quantity: 1, unit: "batch" }
        ]
    },
    {
        title: "Andhra Style Prawn Fry",
        description: "A quick, spicy, and tangy dry roast of prawns packed with Guntur chillies and curry leaves.",
        dietary_tags: ["Non-Vegetarian", "High Protein", "Low-Carb", "Pescatarian"],
        calories: 310,
        protein: 32,
        carbs: 6,
        fat: 16,
        image_url: "https://images.unsplash.com/photo-1559742811-822873691df8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { ingredient_name: "Prawns (Tiger or King)", quantity: 300, unit: "g" },
            { ingredient_name: "Red Chilli Powder", quantity: 1.5, unit: "tbsp" },
            { ingredient_name: "Ginger Garlic Paste", quantity: 1, unit: "tbsp" },
            { ingredient_name: "Curry Leaves", quantity: 20, unit: "leaves" },
            { ingredient_name: "Lemon Juice", quantity: 1, unit: "tbsp" }
        ]
    },
    {
        title: "Mangalorean Neer Dosa with Chicken Ghee Roast",
        description: "Water-thin, soft rice crepes paired with an intensely flavorful, rich chicken roasted in pure Ghee.",
        dietary_tags: ["Non-Vegetarian", "High Protein", "Indulgent"],
        calories: 580,
        protein: 40,
        carbs: 45,
        fat: 35,
        image_url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // using curry general image
        ingredients: [
            { ingredient_name: "Chicken", quantity: 400, unit: "g" },
            { ingredient_name: "Ghee", quantity: 4, unit: "tbsp" },
            { ingredient_name: "Byadgi Red Chillies", quantity: 8, unit: "piece" },
            { ingredient_name: "Rice (for Neer Dosa)", quantity: 200, unit: "g" },
            { ingredient_name: "Coconut", quantity: 50, unit: "g" }
        ]
    }
];

async function seed() {
    console.log("Starting DB Seed...");

    // Cleanup existing
    await supabase.from('recipe_ingredients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('recipes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    for (const r of recipesData) {
        // 1. Insert Recipe
        // Note: If image_url column doesn't exist, we omit it or it throws an error. Let's try omitting it from DB insert and storing it inside description if needed, or hope user added it. Wait, we'll try to insert it as a column if it errors.
        console.log(`Inserting: ${r.title}`);

        // Attempting to just inject the row. Supabase might ignore unknown properties or throw error.
        let { data: recipeData, error: recipeError } = await supabase
            .from('recipes')
            .insert({
                title: r.title,
                description: r.description,
                dietary_tags: r.dietary_tags,
                calories: r.calories,
                protein: r.protein,
                carbs: r.carbs,
                fat: r.fat,
                image_url: r.image_url // Might fail if column not in schema, but Supabase supports dynamic columns sometimes or we will handle it
            })
            .select()
            .single();

        if (recipeError) {
            console.warn("Failed with image_url, trying without it...");
            // Wrap it in description text securely
            let combinedDescription = r.description + `|||IMAGE:${r.image_url}`;
            let res = await supabase.from('recipes').insert({
                title: r.title,
                description: combinedDescription,
                dietary_tags: r.dietary_tags,
                calories: r.calories,
                protein: r.protein,
                carbs: r.carbs,
                fat: r.fat
            }).select().single();
            recipeData = res.data;
            if (res.error) {
                console.error("Error inserting recipe:", res.error);
                continue;
            }
        }

        if (recipeData) {
            // 2. Insert Ingredients
            const ingredientsToInsert = r.ingredients.map(i => ({
                recipe_id: recipeData.id,
                ingredient_name: i.ingredient_name,
                quantity: i.quantity,
                unit: i.unit
            }));

            const { error: ingError } = await supabase
                .from('recipe_ingredients')
                .insert(ingredientsToInsert);

            if (ingError) {
                console.error(`Error inserting ingredients for ${r.title}:`, ingError);
            }
        }
    }

    console.log("Seed completed successfully!");
}

seed();
