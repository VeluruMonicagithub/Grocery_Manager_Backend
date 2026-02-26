import { supabase } from "./config/supabaseClient.js";
const test = async () => {
    const { data } = await supabase.from('invitations').select('*');
    console.log('Invites:', data);
    process.exit(0);
}
test();
