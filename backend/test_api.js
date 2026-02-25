import { getMyMembers } from "./models/sharedAccessModel.js";

const test = async () => {
    const result = await getMyMembers("9332c1ab-1d22-454f-8e05-ec0a8e014ae6", "meera@tcs.com"); // Need her exact email if tracking invitedMe, but we mainly care about iInvited
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
}
test();
