import { supabase } from "../config/supabaseClient.js";

export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }

    if (authHeader.startsWith("Invite ")) {
        // Guest mode using UUID token
        const token = authHeader.replace("Invite ", "");
        const { data: link, error } = await supabase
            .from("invite_links")
            .select("generated_by, used_by, is_used")
            .eq("token", token)
            .single();

        if (error || !link) {
            return res.status(401).json({ error: "Invalid or revoked guest link" });
        }

        // Set req.user to be the owner of the pantry (proxy proxy proxy!)
        req.user = {
            id: link.generated_by,
            isGuest: true,
            guestEmail: link.used_by || "anonymous-guest"
        };
        return next();
    }

    // Standard User mode
    const token = authHeader.replace("Bearer ", "");

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = data.user;

    next();
};