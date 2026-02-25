import dotenv from 'dotenv';
dotenv.config();
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // we usually use service role for testing or anon key in app? Wait, the app uses SUPABASE_KEY. 
// let's just use what's in .env
console.log('Testing UUID generation...');
const token = uuidv4();
console.log('Token created:', token);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testGenerate() {
    const ownerId = "4c00044f-0ce6-4f7e-b4fa-f6ffb461510a"; // dummy uuid
    console.log("Attempting insert...");
    const { data, error } = await supabase
        .from("invite_links")
        .insert([{ token, generated_by: ownerId }])
        .select()
        .single();

    if (error) {
        console.error("DB Error:", error);
    } else {
        console.log("Success:", data);
    }
}

testGenerate();
