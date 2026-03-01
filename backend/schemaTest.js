import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://lnmfsqxfakuuwpvixqnf.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubWZzcXhmYWt1dXdwdml4cW5mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY1NjYzNywiZXhwIjoyMDg3MjMyNjM3fQ.-m_pwUUBBOiPdXjhbLF-O1TIW_u6mhwWKzpJ4FGTxqs");
async function run() {
    let res = await supabase.from("shopping_history").select("*").limit(1);
    console.log("HISTORY_DATA", res.data);
}
run();
