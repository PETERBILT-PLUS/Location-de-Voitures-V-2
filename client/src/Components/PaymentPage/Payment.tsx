import React from "react";
import { Button, Container, Row, Spinner } from "react-bootstrap";
import "./Payment.css";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";



function Payment() {
    const [loading, setLoading] = React.useState<boolean>(false);

    const getPayment = async () => {
        try {
            setLoading(true);
            const res: AxiosResponse<any, any> = await axios.post("http://localhost:5000/agent/payment", null, { withCredentials: true });
            if (res.data.url) {
                window.location.href = res.data.url;
            } else {
                toast.error("Ops Une Error Dans Le Payment");
            }
        } catch (error) {
            toast.error("Ops Server Erreur");
        } finally {
            setLoading(false);
        }

    }

    return (
        <section className="payment-section bg-light py-5">
            <Container>
                <p className="lead text-center py-5">Merci pour votre confience.<br /><br />Après votre paiement de 99 DH marocaines, vous pourrez ajouter jusqu'à trois de vos voitures sur notre plateforme pour nos clients. Profitez de cette occasion pour présenter vos véhicules de manière efficace et attrayante. Nous sommes impatients de vous voir réussir sur notre plateforme.</p>
                <Row>
                    <div className="payment-division col-11 col-md-7 col-lg-5 col-xlg-4 mx-auto py-2">
                        <h2 className="title text-center py-2">Payment</h2>
                        <h3 className="title text-center py-3">99 HD/mois</h3>
                        <Button className="pay-btn" onClick={getPayment} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> : "Maintenant"}
                        </Button>
                    </div>
                </Row>
            </Container>
        </section>
    )
}

export default Payment;