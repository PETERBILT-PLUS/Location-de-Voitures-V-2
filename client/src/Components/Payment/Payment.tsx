import { Card, Col, Container, Row } from "react-bootstrap";
import MyPaypalButton from "../../SubComponents/MyPaypalButton/MyPaypalButton.tsx";

function Payment() {
    return (
        <div className="py-5 bg-light min-vh-100">
            <Container>
                <Row className="py-5">
                    <Col className="mx-auto" xs={12} md={6} lg={4}>
                        <Card className="px-5 py-4 text-center shadow">
                            <Card.Title style={{ color: "var(--lightBlue)" }} className="fs-3 py-4">Paiement de 9,9$</Card.Title>
                            <Card.Body className="gap-5">
                                <p className="ps-6 pb-4 text-secondary">
                                    Accédez à toutes les fonctionnalités premium de l'application en effectuant un paiement unique de 9,9$. Une fois votre paiement confirmé, vous pourrez profiter de tous les outils avancés sans limitations.
                                </p>
                                {/* PayPal Button Integration */}
                                <MyPaypalButton />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Payment;