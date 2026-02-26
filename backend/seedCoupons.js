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

const couponsData = [
    { grocery_item_name: "Milk", discount_percentage: 10 },
    { grocery_item_name: "Eggs", discount_percentage: 15 },
    { grocery_item_name: "Bread", discount_percentage: 20 },
    { grocery_item_name: "Chicken", discount_percentage: 12 },
    { grocery_item_name: "Apples", discount_percentage: 25 },
    { grocery_item_name: "Rice", discount_percentage: 5 },
    { grocery_item_name: "Onions", discount_percentage: 30 },
    { grocery_item_name: "Tomatoes", discount_percentage: 10 },
];

async function seed() {
    console.log("Starting Coupons DB Seed...");

    // Set valid_till to 14 days from now
    const validTillDate = new Date();
    validTillDate.setDate(validTillDate.getDate() + 14);
    const validTillStr = validTillDate.toISOString().split('T')[0];

    // Clear existing coupons (optional, but good for testing)
    await supabase.from('coupons').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    for (const c of couponsData) {
        console.log(`Inserting coupon for: ${c.grocery_item_name}`);
        const { error } = await supabase
            .from('coupons')
            .insert({
                grocery_item_name: c.grocery_item_name,
                discount_percentage: c.discount_percentage,
                valid_till: validTillStr
            });

        if (error) {
            console.error(`Error inserting coupon for ${c.grocery_item_name}:`, error);
        }
    }

    console.log("Coupons Seed completed successfully!");
}

seed();
