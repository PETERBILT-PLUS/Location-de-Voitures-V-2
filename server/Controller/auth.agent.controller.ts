import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import Stripe from "stripe";
import agencyModal, { IAgency } from "../Model/agency.modal.js";


export const registerAgent = async (req: Request, res: Response) => {
    try {
        // Input validation
        const {
            nom, prenom, email, password, tel: phoneNumber, adress: address, city, website, numeroDinscription: registrationNumber,
            numeroDeLicenceCommerciale: businessLicenseNumber, numeroDePoliceDassurance: insurancePolicyNumber, paypalAccountId
        } = req.body;

        if (!nom || !prenom || !email || !password || !phoneNumber || !address || !city || !registrationNumber || !businessLicenseNumber || !insurancePolicyNumber || !paypalAccountId) {
            return res.status(403).json({ success: false, message: "Missing Credentials" });
        }

        const agencyExist: IAgency | null = await agencyModal.findOne({ email: email });
        if (agencyExist) return res.status(409).json({ success: false, messgae: "E-mail Déja Utilisé" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object
        const newAgent = new agencyModal({
            nom, prenom, email, password: hashedPassword, phoneNumber, address, city, website,
            registrationNumber, businessLicenseNumber, insurancePolicyNumber, paypalAccountId,
        });

        // Save user to database
        await newAgent.save();

        // Return success response
        res.status(201).json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const loginAgent = async (req: Request, res: Response) => {
    try {
        const { email, password: userPass } = req.body;


        const DEPLOYMENT = process.env.DEPLOYMENT;
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) throw new Error("the JWT_SECRET is not available please check the .env file");
        // Check if email and password are provided
        if (!email || !userPass) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Find the user by email
        const agency = await agencyModal.findOne({ email });

        // Check if the user exists
        if (!agency) {
            return res.status(404).json({ success: false, message: "Invalid credantials" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(userPass, agency.password);

        // If password is not valid
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credantials" });
        }

        // Generate JWT token
        const token = jwt.sign({ agency_id: agency._id }, JWT_SECRET, { expiresIn: "90d" });
        const { password, ...rest } = agency.toObject();

        res.status(200).cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 90, httpOnly: true, secure: DEPLOYMENT == "development" ? false : true, sameSite: "none" });
        res.status(200).json({ success: true, message: "User Succesfully login", agency: rest });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const logoutAgent = async (req: Request, res: Response) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ success: true, message: "Déconnection Succès" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

/*
export const createPaymentSession = async (req: Request, res: Response) => {
    try {
        const agentId = req.agent?._id;

        const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;
        const STRIPE_KEY = process.env.STRIPE_KEY;
        const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
        if (!CLIENT_DOMAIN || !STRIPE_KEY || !SERVER_DOMAIN) {
            throw new Error("Environment variables not available");
        }

        const stripe = new Stripe(STRIPE_KEY);
        // Extract the user ID from the request (assuming the user is authenticated)

        // Create a payment session with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: "MAD",
                    product_data: {
                        name: "plateforme de paiement mensuel",
                        // You can add additional product details here
                    },
                    unit_amount: 9900, // Amount in cents (99 MAD)
                },
                quantity: 1,
            }],
            mode: "payment", // Switch to payment mode for one-time payment
            success_url: `${CLIENT_DOMAIN}/payment-success`,
            cancel_url: `${CLIENT_DOMAIN}/payment-failed`,
            // You can add more options as needed, such as customer details
        });

        // Return the session URL to the client
        res.send({ url: session.url });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const webHooks = async (req: Request, res: Response) => {
    let signInSecretKey: string = "whsec_35b71eab6458bcfd58570b9afda912b04c9bd7b7d6f9bf5a2cfeeac5470ee945";

    const payload = req.body;
    const sig: string | string[] | undefined = req.headers["stripe-signature"];

    const STRIPE_KEY = process.env.STRIPE_KEY;
    if (!STRIPE_KEY) throw new Error("the STRIPE_KEY is not available please check the .env file");

    let event;
    try {
        const stripe = new Stripe(STRIPE_KEY);
        if (sig) {
            event = stripe.webhooks.constructEvent(payload, sig, signInSecretKey);
            if (event.type === "checkout.session.completed") {
                const agentId = event?.data?.object?.metadata?.agentId;
                const currentDate = new Date();
                // Update the user's subscription expiration property
                const agent = await agencyModal.findByIdAndUpdate(agentId, {
                    // Add 30 days to the current date for subscription expiration
                    subscriptionExpiresAt: new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 30),
                }, {
                    new: true,
                });
                if (!agent) {
                    return res.status(404).json({ success: false, message: "User not found" });
                }

                res.status(201).json({ success: true, message: "Payment And Subscription Succesful" });
            }
        } else {
            throw new Error("the sig variable is not available please check the agent auth controller");
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: "Internal Server Error" });
        return false;
    }
}*/