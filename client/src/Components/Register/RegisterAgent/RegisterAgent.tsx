import React from "react";
import { Container, Form, Row } from "react-bootstrap";
import "./RegisterAgent.css";
import { useFormik } from "formik";
import { registerAgentSchema } from "../../../Configuration/Schema.ts";
import SubmitButton from "../../../SubComponents/SubmitButton/SubmitButton.tsx";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function RegisterAgent() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const navigate = useNavigate();

    const cities = [
        "Agadir", "Al Hoceima", "Asilah", "Azemmour", "Azrou", 
        "Beni Mellal", "Ben Slimane", "Berkane", "Berrechid", 
        "Casablanca", "Chefchaouen", "Dakhla", "El Aioun", 
        "El Hajeb", "El Jadida", "El Kelaa des Sraghna", 
        "Errachidia", "Essaouira", "Fes", "Guelmim", "Ifrane", 
        "Khemisset", "Khenifra", "Khouribga", "Laayoune", 
        "Larache", "Marrakech", "Meknes", "Mohammedia", 
        "Nador", "Ouarzazate", "Ouezzane", "Oujda", 
        "Rabat", "Safi", "Sale", "Sefrou", "Settat", 
        "Sidi Bennour", "Sidi Ifni", "Sidi Kacem", "Sidi Slimane", 
        "Skhirat", "Tangier", "Tan-Tan", "Taourirt", 
        "Taroudant", "Taza", "Tetouan", "Tiznit", "Zagora"
    ];

    const onSubmit = async (values: any, action: any) => {
        try {
            setLoading(true);
            const res: AxiosResponse<any, any> = await axios.post("http://localhost:5000/agent/register", values);
            if (res.data.success) {
                toast.success("Registrement Succès");
                action.resetForm();
                navigate("/login-agent");
            } else if (res.status === 403) {
                toast.warning("Remplissez tous les champs");
                return false;
            }
        } catch (error) {
            toast.error("Ops Server Error");
        } finally {
            setLoading(false);
        }
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            nom: "",
            prenom: "",
            email: "",
            password: "",
            confirmPassword: "",
            tel: "",
            adress: "",
            city: "",
            website: "",
            numeroDinscription: "",
            numeroDeLicenceCommerciale: "",
            numeroDePoliceDassurance: "",
            paypalAccountId: "",
        },
        validationSchema: registerAgentSchema,
        onSubmit,
    });

    return (
        <section className="register-section bg-light py-5">
            <Container>
                <h3 className="text-center text-light title py-5">Register Votre Agence</h3>
                <Row>
                    <div className="col-11 col-md-6 col-lg-5 col-xlg-4 mx-auto">
                        <Form className="agent-register-form mx-auto" onSubmit={handleSubmit}>
                            <Form.Group controlId="nom">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control 
                                    className="input-form" 
                                    type="text" 
                                    name="nom" 
                                    value={values.nom} 
                                    onBlur={handleBlur} 
                                    onChange={handleChange} 
                                />
                                {errors.nom && touched.nom && <h6 className="text-danger error-header">{errors.nom}</h6>}
                            </Form.Group>

                            <Form.Group controlId="prenom">
                                <Form.Label>Prénom</Form.Label>
                                <Form.Control 
                                    className="input-form" 
                                    type="text" 
                                    name="prenom" 
                                    value={values.prenom} 
                                    onBlur={handleBlur} 
                                    onChange={handleChange} 
                                />
                                {errors.prenom && touched.prenom && <h6 className="text-danger error-header">{errors.prenom}</h6>}
                            </Form.Group>

                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    className="input-form" 
                                    type="email" 
                                    name="email" 
                                    value={values.email} 
                                    onBlur={handleBlur} 
                                    onChange={handleChange} 
                                />
                                {errors.email && touched.email && <h6 className="text-danger error-header">{errors.email}</h6>}
                            </Form.Group>

                            <Form.Group controlId="password">
                                <Form.Label>Mot de passe</Form.Label>
                                <Form.Control 
                                    className="input-form" 
                                    type="password" 
                                    name="password" 
                                    value={values.password} 
                                    onBlur={handleBlur} 
                                    onChange={handleChange} 
                                />
                                {errors.password && touched.password && <h6 className="text-danger error-header">{errors.password}</h6>}
                            </Form.Group>

                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Confirmer le mot de passe</Form.Label>
                                <Form.Control 
                                    className="input-form" 
                                    type="password" 
                                    name="confirmPassword" 
                                    value={values.confirmPassword} 
                                    onBlur={handleBlur} 
                                    onChange={handleChange} 
                                />
                                {errors.confirmPassword && touched.confirmPassword && <h6 className="text-danger error-header">{errors.confirmPassword}</h6>}
                            </Form.Group>

                            <Form.Group controlId="tel">
                                <Form.Label>Téléphone</Form.Label>
                                <Form.Control 
                                    className="input-form" 
                                    type="tel" 
                                    name="tel" 
                                    value={values.tel} 
                                    onBlur={handleBlur} 
                                    onChange={handleChange} 
                                />
                                {errors.tel && touched.tel && <h6 className="text-danger error-header">{errors.tel}</h6>}
                            </Form.Group>

                            <Form.Group controlId="adress">
                                <Form.Label>Adresse</Form.Label>
                                <Form.Control 
                                    className="input-form" 
                                    type="text" 
                                    name="adress" 
                                    value={values.adress} 
                                    onBlur={handleBlur} 
                                    onChange={handleChange} 
                                />
                                {errors.adress && touched.adress && <h6 className="text-danger error-header">{errors.adress}</h6>}
                            </Form.Group>

                            <Form.Group controlId="city">
                                <Form.Label>Ville</Form.Label>
                                <Form.Select 
                                    className="form-select" 
                                    name="city" 
                                    value={values.city} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                >
                                    <option value="" disabled>Choisir La Ville</option>
                                    {cities.map((elem, idx) => (
                                        <option key={idx}>{elem}</option>
                                    ))}
                                </Form.Select>
                                {errors.city && touched.city && <h6 className="text-danger error-header pt-2">{errors.city}</h6>}
                            </Form.Group>

                            <Form.Group controlId="website">
                                <Form.Label>Site Web (Facultatif)</Form.Label>
                                <Form.Control 
                                    className="input-form" 
                                    type="text" 
                                    name="website" 
                                    value={values.website} 
                                    onBlur={handleBlur} 
                                    onChange={handleChange} 
                                />
                                {errors.website && touched.website && <h6 className="text-danger error-header pt-2">{errors.website}</h6>}
                            </Form.Group>

                            <Form.Group controlId="numeroDinscription">
                                <Form.Label>Numéro d'inscription</Form.Label>
                                <Form.Control 
                                    className="input-form" 
                                    type="text" 
                                    name="numeroDinscription" 
                                    value={values.numeroDinscription} 
                                    onBlur={handleBlur} 
                                    onChange={handleChange} 
                                />
                                {errors.numeroDinscription && touched.numeroDinscription && <h6 className="text-danger error-header pt-2">{errors.numeroDinscription}</h6>}
                            </Form.Group>

                            <Form.Group controlId="numeroDeLicenceCommerciale">
                                <Form.Label>Numéro de licence commerciale</Form.Label>
                                <Form.Control 
                                    className="input-form" 
                                    type="text" 
                                    name="numeroDeLicenceCommerciale" 
                                    value={values.numeroDeLicenceCommerciale} 
                                    onBlur={handleBlur} 
                                    onChange={handleChange} 
                                />
                                {errors.numeroDeLicenceCommerciale && touched.numeroDeLicenceCommerciale && <h6 className="text-danger error-header pt-2">{errors.numeroDeLicenceCommerciale}</h6>}
                            </Form.Group>

                            <Form.Group controlId="numeroDePoliceDassurance">
                                <Form.Label>Numéro de police d'assurance</Form.Label>
                                <Form.Control 
                                    className="input-form" 
                                    type="text" 
                                    name="numeroDePoliceDassurance" 
                                    value={values.numeroDePoliceDassurance} 
                                    onBlur={handleBlur} 
                                    onChange={handleChange} 
                                />
                                {errors.numeroDePoliceDassurance && touched.numeroDePoliceDassurance && <h6 className="text-danger error-header pt-2">{errors.numeroDePoliceDassurance}</h6>}
                            </Form.Group>

                            <Form.Group controlId="paypalAccountId">
                                <Form.Label>ID de compte PayPal</Form.Label>
                                <Form.Control 
                                    className="input-form" 
                                    type="text" 
                                    name="paypalAccountId" 
                                    value={values.paypalAccountId} 
                                    onBlur={handleBlur} 
                                    onChange={handleChange} 
                                />
                                {errors.paypalAccountId && touched.paypalAccountId && <h6 className="text-danger error-header pt-2">{errors.paypalAccountId}</h6>}
                            </Form.Group>

                            <SubmitButton disabled={isSubmitting} loading={loading} />

                            <p className="fs-6 pt-4">Vous avez Déja un compte <Link to="/login-agent">Login</Link></p>
                        </Form>
                    </div>
                </Row>
            </Container>
        </section>
    );
}

export default RegisterAgent;
