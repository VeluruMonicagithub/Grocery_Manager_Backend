import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function test() {
    console.log("Fetching recipes...");
    const { data: recipes, error: recipesErr } = await supabase.from('recipes').select('*').limit(1);
    console.log("Recipes Error:", recipesErr);
    console.log("Recipes Data:", recipes);

    console.log("\nFetching meal_schedule...");
    const { data: meals, error: mealsErr } = await supabase.from('meal_schedule').select('*, recipes(*)').limit(1);
    console.log("Meals Error:", mealsErr);
    console.log("Meals Data:", meals);
}

test();
