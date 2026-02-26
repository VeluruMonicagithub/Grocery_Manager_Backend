import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
    try {
        const { error: insertError } = await supabase.from('invite_links').insert([{
            token: 'test-token',
            generated_by: 'me',
            is_used: false
        }]);
        console.log('Insert test:', insertError ? insertError.message : 'Success');
    } catch (e) {
        console.log('Error inside checkTable', e);
    }
}
checkTable();
