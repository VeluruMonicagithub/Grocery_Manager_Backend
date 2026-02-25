import { supabase } from "../config/supabaseClient.js";

import { v4 as uuidv4 } from 'uuid';

// Create a new invitation link token
export const generateInviteLink = async (ownerId) => {
    const token = uuidv4();

    const { data, error } = await supabase
        .from("invite_links")
        .insert([{ token, generated_by: ownerId }])
        .select()
        .single();

    return { data, error };
};

// Fetch generated links for the owner
export const getMyGeneratedLinks = async (ownerId) => {
    const { data, error } = await supabase
        .from("invite_links")
        .select("*")
        .eq("generated_by", ownerId)
        .order("created_at", { ascending: false });

    return { data, error };
};

// Fetch users connected to me (I invited them or they invited me)
export const getMyMembers = async (userId, userEmail) => {
    // For simplicity, we query the invitations table directly
    // People I invited
    const { data: iInvited } = await supabase
        .from("invitations")
        .select("invited_email, status, created_at")
        .eq("owner_id", userId)
        .in("status", ["accepted", "pending"]);

    // People who invited me and I accepted
    const { data: invitedMe } = await supabase
        .from("invitations")
        .select("owner_id, status, created_at")
        .eq("invited_email", userEmail)
        .eq("status", "accepted");

    return { iInvited: iInvited || [], invitedMe: invitedMe || [] };
};

// Accept a token invitation link
export const acceptInvitationLink = async (token, userEmail) => {
    // 1. Verify the link
    const { data: link, error: linkError } = await supabase
        .from("invite_links")
        .select("*")
        .eq("token", token)
        .single();

    if (linkError || !link) return { error: "Invalid link" };
    if (link.is_used) return { error: "Link has already been used" };

    // 2. Mark the link as used
    await supabase
        .from("invite_links")
        .update({ is_used: true, used_by: userEmail })
        .eq("token", token);

    // 3. To maintain compatibility with existing pantry sharing SQL rules,
    // we must insert an accepted record into the old invitations table
    const { data, error } = await supabase
        .from("invitations")
        .insert([{
            owner_id: link.generated_by,
            invited_email: userEmail,
            status: "accepted"
        }])
        .select()
        .single();

    return { data, error };
};

// Remove a member's access
export const removeMember = async (ownerId, memberEmail) => {
    const { data, error } = await supabase
        .from("invitations")
        .delete()
        .eq("owner_id", ownerId)
        .eq("invited_email", memberEmail);

    return { error };
};
