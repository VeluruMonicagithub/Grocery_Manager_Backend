-- 1. Create the invitations table to manage sharing access
CREATE TABLE public.invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invited_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Owners can insert and view their own invitations
CREATE POLICY "Owners can manage their invitations" 
ON public.invitations
FOR ALL 
USING (auth.uid() = owner_id);

-- 4. Policy: Invited users can view and update their own invitations (to accept them)
-- We use a subquery to check if the logged in user's email matches the invited_email
CREATE POLICY "Invited users can view and update invitations" 
ON public.invitations
FOR SELECT
USING (
    invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Invited users can accept invitations" 
ON public.invitations
FOR UPDATE
USING (
    invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
)
WITH CHECK (
    status = 'accepted'
);

-- 5. Helper Function: Get connection tree
-- This creates a secure PostgreSQL function that returns all user UUIDs
-- that the current user is connected to via accepted invitations.
-- We will use this in the backend to fetch shared pantry items.
CREATE OR REPLACE FUNCTION get_connected_user_ids(current_user_id UUID, current_user_email TEXT)
RETURNS SETOF UUID AS $$
BEGIN
    RETURN QUERY
    -- Include the user themselves
    SELECT current_user_id
    UNION
    -- Include anyone who has accepted an invite from the user
    SELECT invited_users.id
    FROM public.invitations i
    JOIN auth.users invited_users ON invited_users.email = i.invited_email
    WHERE i.owner_id = current_user_id AND i.status = 'accepted'
    UNION
    -- Include anyone whose invite the user has accepted
    SELECT i.owner_id
    FROM public.invitations i
    WHERE i.invited_email = current_user_email AND i.status = 'accepted';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
