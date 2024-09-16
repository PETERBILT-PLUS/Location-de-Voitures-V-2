import { Request, Response } from "express";
import agencyModal, { IAgency } from "../Model/agency.modal.js";
import vehiculeModel, { IVehicle } from "../Model/vehicule.model.js";
import notificationModal, { INotification } from "../Model/notification.modal.js";
import reservationModel, { IReservation } from "../Model/reservation.model.js";

export const getAgentProfile = async (req: Request, res: Response) => {
    try {
        const agentId = req?.agent._id;

        const agentProfile = await agencyModal.findById(agentId);
        if (!agentProfile) return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });

        res.status(200).json({ success: true, agence: agentProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interns du Serveur" });
    }
}


export const updateAgentProfile = async (req: Request, res: Response) => {
    try {
        const {
            nom,
            prenom,
            email,
            password,
            confirmPassword,
            telephone,
            adress,
            ville,
            website,
            numeroDinscription,
            numeroDeLisenceCommercial,
            NumeroDePoliceDassurance,
            localisation,
        } = req.body;

        // Validate passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Les mots de passe ne correspondent pas" });
        }

        // Find the agent in the database
        const agent = await agencyModal.findById(req.agent._id); // Assuming req.user.id contains the agent's ID
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
        agent.localisation = localisation || agent.localisation

        // Update password if provided
        if (password) {
            agent.password = password;
        }

        // Save the updated agent profile
        await agent.save();

        res.status(200).json({ success: true, message: "Profil mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
};

export const getCars = async (req: Request, res: Response) => {
    try {
        const agentId = req?.agent._id;

        const agent: IAgency | null = await agencyModal.findById(agentId).populate("cars");
        if (!agent) return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });

        const cars = agent.cars;

        if (!cars.length) return res.status(204).json({ success: true, data: null, message: "Pas de Voitures" });

        res.status(200).json({ success: true, data: cars });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}

export const deleteCar = async (req: Request, res: Response) => {
    try {
        const car_id = req.params.car_id;
        const agent_id = req.agent?._id;

        if (!car_id) return res.status(400).json({ success: false, message: "Manque D'informations" });

        const agentCompatible: IAgency | null = await agencyModal.findOne({ _id: agent_id });
        if (!agentCompatible) return res.status(401).json({ success: false, messsage: "Pas Autorisé" });

        const deleteCar: IVehicle | null = await vehiculeModel.findByIdAndDelete(car_id);
        if (!deleteCar) return res.status(404).json({ success: false, message: "Vehicule Pas Trouvé" });

        res.status(200).json({ success: true, message: "Vehicule Supprimé avec Succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}

export const getSingleCar = async (req: Request, res: Response) => {
    try {
        const car_id = req.params.id;

        const findCar: IVehicle | null = await vehiculeModel.findById(car_id);
        if (!findCar) return res.status(404).json({ success: false, message: "Voiture Pas Trouvé" });

        res.status(200).json({ success: true, data: findCar.toObject() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}


export const editVehicule = async (req: Request, res: Response) => {
    try {
        const agent_id = req.agent?._id;

        const { carName, carEtat, carFuel, carKm, carMarque, carPhotos, carType, places, insurance, pricePerDay, registration } = req.body;

        const car_id = req.query.car_id;

        if (!car_id || !carName || !carEtat || !carFuel || !carKm || !carMarque || !carPhotos || !carType || !places || !insurance || !pricePerDay || !registration) return res.status(401).json({ success: false, message: "Manque D'informations" });

        const carExist: IVehicle | null = await vehiculeModel.findById(car_id);
        if (!carExist) return res.status(404).json({ success: false, message: "Vehicule Pas Trouvé" });

        const agentExist = await agencyModal.findById(agent_id).populate("cars");
        if (!agentExist) return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });

        const findCar = agentExist.cars.find((elem: any) => String(elem._id) === String(car_id));
        if (!findCar) return res.status(401).json({ success: false, message: "Pas Autorisé" });

        const updateCar: IVehicle | null = await vehiculeModel.findByIdAndUpdate(car_id, req.body, { new: true });
        if (!updateCar) return res.status(404).json({ success: false, message: "Vehicule Pas Trouvé" });

        res.status(200).json({ success: true, message: "Vehicule Améliorer aec Succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}

export const getDashboard = async (req: Request, res: Response) => {
    try {
        const agent_id = req.agent?._id;

        const getNotifications: INotification[] = await notificationModal.find({ recipient: agent_id });
        const agentExist: IAgency | null = await agencyModal.findById(agent_id).populate("cars");
        const carsExist = agentExist?.cars;
        const reservations: IReservation[] = await reservationModel.find({ agency: agent_id });

        res.status(200).json({
            success: true, data: {
                notification: getNotifications.length,
                cars: carsExist?.length,
                reservations: reservations.length,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}