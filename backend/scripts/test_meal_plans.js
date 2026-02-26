const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMeals() {
    console.log("Checking Meal Plans...");
    const { data, error } = await supabase
        .from("meal_schedule")
        .select(`
            *,
            recipes (*)
        `)
        .limit(1);

    if (error) {
        console.error("Meal Plan Error:", JSON.stringify(error, null, 2));
    } else {
        console.log("Data:", JSON.stringify(data, null, 2));
    }
}

checkMeals();
