import * as SharedAccessModel from "../models/sharedAccessModel.js";

export const generateLink = async (req, res) => {
    const ownerId = req.user.id;

    const { data, error } = await SharedAccessModel.generateInviteLink(ownerId);

    if (error || !data) {
        return res.status(400).json({ error: "Failed to generate link" });
    }

    const inviteLink = `http://localhost:5173/shared?invite=${data.token}`;

    console.log(`\n==========================================`);
    console.log(`[UNIQUE INVITATION LINK GENERATED]: ${inviteLink}`);
    console.log(`==========================================\n`);

    res.json({ message: "Link generated successfully!", data: { link: inviteLink, token: data.token } });
};

export const getMyMembers = async (req, res) => {
    const userId = req.user.id;
    // user email from token
    const userEmail = req.user.email;

    try {
        const { iInvited, invitedMe } = await SharedAccessModel.getMyMembers(userId, userEmail);

        // Combine them for the frontend
        const members = [
            ...iInvited.map(m => ({ email: m.invited_email, status: m.status, joinedAt: m.created_at, role: "member" })),
            ...invitedMe.map(m => ({ id: m.owner_id, status: m.status, joinedAt: m.created_at, role: "owner" }))
        ];

        res.json({ members });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch members" });
    }
};

export const getGeneratedLinks = async (req, res) => {
    const ownerId = req.user.id;
    const { data, error } = await SharedAccessModel.getMyGeneratedLinks(ownerId);

    if (error) return res.status(400).json({ error });
    res.json(data);
};

export const acceptInvite = async (req, res) => {
    const { invitationId, guestName } = req.body;
    const userEmail = guestName || req.user.email || req.user.guestEmail || "Anonymous Guest";

    const { data, error } = await SharedAccessModel.acceptInvitationLink(invitationId, userEmail);

    if (error) return res.status(400).json({ error });
    res.json({ message: "Invitation accepted", data });
};

export const removeMember = async (req, res) => {
    const ownerId = req.user.id;
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ error: "Email parameter is required" });
    }

    const { error } = await SharedAccessModel.removeMember(ownerId, email);

    if (error) return res.status(400).json({ error });
    res.json({ message: "Member removed successfully" });
};
