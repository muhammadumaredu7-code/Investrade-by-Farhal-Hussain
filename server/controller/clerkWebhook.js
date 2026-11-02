
import { Webhook } from "svix";
import User from "../model/User.js";

const clerkWebhooks = async (req, res) => {
    try {
        const signingSecret =
            process.env.CLERK_WEBHOOK_SIGNING_SECRET ||
            process.env.CLERK_WEBHOOK_SECRET;

        if (!signingSecret) {
            throw new Error("Missing Clerk webhook signing secret");
        }

        const whook = new Webhook(signingSecret);

        // Getting Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        if (!Buffer.isBuffer(req.body)) {
            throw new Error("Webhook payload must be received as raw bytes");
        }

        await whook.verify(req.body.toString("utf8"), headers);

        const { data, type } = JSON.parse(req.body.toString("utf8"));

        const primaryEmail = data.email_addresses?.find(
            (email) => email.id === data.primary_email_address_id
        )?.email_address || data.email_addresses?.[0]?.email_address || "";

        const userData = {
            _id: data.id,
            email: primaryEmail,
            name: [data.first_name, data.last_name].filter(Boolean).join(" ").trim(),
            image: data.image_url,
        };

        // Swtch Cases for different Events
        switch (type) {
            case "user.created": {
                await User.findByIdAndUpdate(data.id, userData, {
                    upsert: true,
                    new: true,
                    runValidators: true,
                });
                break;
            }

            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData, {
                    new: true,
                    runValidators: true,
                });
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                break;
            }

            default:
                break;
        }
        return res.status(200).json({ success: true, message: "Webhook received" });

    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
}
export default clerkWebhooks;