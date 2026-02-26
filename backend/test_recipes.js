import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function test() {
    console.log("Fetching recipes_records...");
    const { data, error } = await supabase.from('recipes_records').select('*');
    if (error) {
        console.error("Error:", error);
    } else {
        console.log(`Found ${data.length} recipes.`);
        if (data.length > 0) {
            console.log("First recipe:", data[0]);
        }
    }
}

test();
