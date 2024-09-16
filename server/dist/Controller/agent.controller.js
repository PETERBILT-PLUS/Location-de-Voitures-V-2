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
exports.getDashboard = exports.editVehicule = exports.getSingleCar = exports.deleteCar = exports.getCars = exports.updateAgentProfile = exports.getAgentProfile = void 0;
const agency_modal_js_1 = __importDefault(require("../Model/agency.modal.js"));
const vehicule_model_js_1 = __importDefault(require("../Model/vehicule.model.js"));
const notification_modal_js_1 = __importDefault(require("../Model/notification.modal.js"));
const reservation_model_js_1 = __importDefault(require("../Model/reservation.model.js"));
const getAgentProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agentId = req === null || req === void 0 ? void 0 : req.agent._id;
        const agentProfile = yield agency_modal_js_1.default.findById(agentId);
        if (!agentProfile)
            return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });
        res.status(200).json({ success: true, agence: agentProfile });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interns du Serveur" });
    }
});
exports.getAgentProfile = getAgentProfile;
const updateAgentProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom, prenom, email, password, confirmPassword, telephone, adress, ville, website, numeroDinscription, numeroDeLisenceCommercial, NumeroDePoliceDassurance, localisation, } = req.body;
        // Validate passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Les mots de passe ne correspondent pas" });
        }
        // Find the agent in the database
        const agent = yield agency_modal_js_1.default.findById(req.agent._id); // Assuming req.user.id contains the agent's ID
        if (!agent) {
            return res.status(404).json({ success: false, message: "Agent non trouvé" });
        }
        // Update agent profile
        agent.nom = nom || agent.nom;
        agent.prenom = prenom || agent.prenom;
        agent.email = email || agent.email;
        agent.phoneNumber = telephone || agent.phoneNumber;
        agent.address = adress || agent.address;
        agent.city = ville || agent.city;
        agent.website = website || agent.website;
        agent.registrationNumber = numeroDinscription || agent.registrationNumber;
        agent.businessLicenseNumber = numeroDeLisenceCommercial || agent.businessLicenseNumber;
        agent.insurancePolicyNumber = NumeroDePoliceDassurance || agent.insurancePolicyNumber;
        agent.localisation = localisation || agent.localisation;
        // Update password if provided
        if (password) {
            agent.password = password;
        }
        // Save the updated agent profile
        yield agent.save();
        res.status(200).json({ success: true, message: "Profil mis à jour avec succès" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
exports.updateAgentProfile = updateAgentProfile;
const getCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agentId = req === null || req === void 0 ? void 0 : req.agent._id;
        const agent = yield agency_modal_js_1.default.findById(agentId).populate("cars");
        if (!agent)
            return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });
        const cars = agent.cars;
        if (!cars.length)
            return res.status(204).json({ success: true, data: null, message: "Pas de Voitures" });
        res.status(200).json({ success: true, data: cars });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
exports.getCars = getCars;
const deleteCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const car_id = req.params.car_id;
        const agent_id = (_a = req.agent) === null || _a === void 0 ? void 0 : _a._id;
        if (!car_id)
            return res.status(400).json({ success: false, message: "Manque D'informations" });
        const agentCompatible = yield agency_modal_js_1.default.findOne({ _id: agent_id });
        if (!agentCompatible)
            return res.status(401).json({ success: false, messsage: "Pas Autorisé" });
        const deleteCar = yield vehicule_model_js_1.default.findByIdAndDelete(car_id);
        if (!deleteCar)
            return res.status(404).json({ success: false, message: "Vehicule Pas Trouvé" });
        res.status(200).json({ success: true, message: "Vehicule Supprimé avec Succès" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
exports.deleteCar = deleteCar;
const getSingleCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car_id = req.params.id;
        const findCar = yield vehicule_model_js_1.default.findById(car_id);
        if (!findCar)
            return res.status(404).json({ success: false, message: "Voiture Pas Trouvé" });
        res.status(200).json({ success: true, data: findCar.toObject() });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
exports.getSingleCar = getSingleCar;
const editVehicule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const agent_id = (_b = req.agent) === null || _b === void 0 ? void 0 : _b._id;
        const { carName, carEtat, carFuel, carKm, carMarque, carPhotos, carType, places, insurance, pricePerDay, registration } = req.body;
        const car_id = req.query.car_id;
        if (!car_id || !carName || !carEtat || !carFuel || !carKm || !carMarque || !carPhotos || !carType || !places || !insurance || !pricePerDay || !registration)
            return res.status(401).json({ success: false, message: "Manque D'informations" });
        const carExist = yield vehicule_model_js_1.default.findById(car_id);
        if (!carExist)
            return res.status(404).json({ success: false, message: "Vehicule Pas Trouvé" });
        const agentExist = yield agency_modal_js_1.default.findById(agent_id).populate("cars");
        if (!agentExist)
            return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });
        const findCar = agentExist.cars.find((elem) => String(elem._id) === String(car_id));
        if (!findCar)
            return res.status(401).json({ success: false, message: "Pas Autorisé" });
        const updateCar = yield vehicule_model_js_1.default.findByIdAndUpdate(car_id, req.body, { new: true });
        if (!updateCar)
            return res.status(404).json({ success: false, message: "Vehicule Pas Trouvé" });
        res.status(200).json({ success: true, message: "Vehicule Améliorer aec Succès" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
exports.editVehicule = editVehicule;
const getDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const agent_id = (_c = req.agent) === null || _c === void 0 ? void 0 : _c._id;
        const getNotifications = yield notification_modal_js_1.default.find({ recipient: agent_id });
        const agentExist = yield agency_modal_js_1.default.findById(agent_id).populate("cars");
        const carsExist = agentExist === null || agentExist === void 0 ? void 0 : agentExist.cars;
        const reservations = yield reservation_model_js_1.default.find({ agency: agent_id });
        res.status(200).json({
            success: true, data: {
                notification: getNotifications.length,
                cars: carsExist === null || carsExist === void 0 ? void 0 : carsExist.length,
                reservations: reservations.length,
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
exports.getDashboard = getDashboard;
