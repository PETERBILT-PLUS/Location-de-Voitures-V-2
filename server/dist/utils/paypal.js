"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundOrder = exports.captureOrder = exports.createOrder = void 0;
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch")); // Import `Response` from `node-fetch`
require("dotenv/config");
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const agency_modal_1 = __importDefault(require("../Model/agency.modal"));
const environment = new checkout_server_sdk_1.default.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const client = new checkout_server_sdk_1.default.core.PayPalHttpClient(environment);
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8080 } = process.env;
const base = "https://api-m.sandbox.paypal.com";
const app = (0, express_1.default)();
// Parse post params sent in body in json format
app.use(express_1.default.json());
/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
        const response = yield (0, node_fetch_1.default)(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const data = (yield response.json());
        return data.access_token;
    }
    catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
});
/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = (cart) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield generateAccessToken();
    if (!accessToken) {
        throw new Error("Failed to retrieve access token.");
    }
    const url = `${base}/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: "9.9",
                },
            },
        ],
    };
    const response = yield (0, node_fetch_1.default)(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
});
exports.createOrder = createOrder;
/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = (orderID, agency_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const accessToken = yield generateAccessToken();
    if (!accessToken) {
        throw new Error("Failed to retrieve access token.");
    }
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;
    try {
        const response = yield (0, node_fetch_1.default)(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const responseData = yield response.json(); // Get response data
        // Log the full response for debugging
        if (!response.ok) {
            throw new Error(`PayPal API error: ${JSON.stringify(responseData)}`);
        }
        // Check if payment was successful
        const captureStatus = (_e = (_d = (_c = (_b = (_a = responseData.purchase_units) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.payments) === null || _c === void 0 ? void 0 : _c.captures) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.status;
        if (captureStatus === 'COMPLETED') {
            const agency = yield agency_modal_1.default.findByIdAndUpdate(agency_id, {
                subscriptionExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                isPay: true,
            }, { new: true });
            return responseData; // Return successful capture
        }
        else {
            throw new Error('Payment was not completed.');
        }
    }
    catch (error) {
        console.error("Error capturing order:", error);
        throw new Error("Failed to capture order. Please check server logs for details.");
    }
});
exports.captureOrder = captureOrder;
/**
 * Handle the response from PayPal API.
 * @param response
 * @returns
 */
function handleResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jsonResponse = yield response.json();
            return {
                jsonResponse,
                httpStatusCode: response.status,
            };
        }
        catch (err) {
            const errorMessage = yield response.text();
            throw new Error(errorMessage);
        }
    });
}
// This is for money refund
const refundOrder = (orderID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Create request object
        const request = new checkout_server_sdk_1.default.payments.CapturesRefundRequest(orderID);
        // 2. Create refund request body
        request.requestBody({
            amount: {
                value: '9.9', // Amount to refund (USD or local currency equivalent)
                currency_code: 'USD' // Change the currency if necessary
            },
            invoice_id: 'your_invoice_id', // Replace with the actual invoice ID if applicable
            note_to_payer: 'Refund for your order' // Optional note to the payer
        });
        // 3. Execute refund request
        const response = yield client.execute(request);
        // 4. Return response
        return {
            jsonResponse: response.result,
            httpStatusCode: response.statusCode
        };
    }
    catch (error) {
        console.error("PayPal refund error:", error);
        throw new Error("Refund failed");
    }
});
exports.refundOrder = refundOrder;
