import { useEffect, useState } from 'react';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt, faBell } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Container, Nav, NavDropdown, Navbar, Row, Button } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


function AdminDashboard() {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const SERVER: string = import.meta.env.VITE_SERVER as string;

    console.log(data);


    useEffect(() => {
        const getDashboard = async () => {
            setLoading(true);
            try {
                const res: AxiosResponse<any, any> = await axios.get(`${SERVER}/agent/get-dashboard`, { withCredentials: true });
                console.log(res.data);
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data?.message);
                } else {
                    toast.error("Ops Une Erreur");
                    console.error(error);
                }
            } finally {
                setLoading(false);
            }
        }

        getDashboard();
    }, []);

    return (
        <div className="bg-light">
            <Container className="py-5">
                <h4 className="text-center mb-4">Bienvenue, Mr Name</h4>
                <p className="text-center mb-5">Veillez accepter les réservations et voir vos messages depuis votre tableau de bord.</p>
                <Row xs={1} md={3} className="g-4">
                    <Col>
                        <Card className="shadow h-100">
                            <Card.Header className="py-3 text-center bg-primary text-white">Reservations</Card.Header>
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                <Card.Text className="mb-0">{data?.reservations} {data?.reservation < 1 ? "Réservations" : "Réservation"}</Card.Text>
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-muted mt-3 fs-4" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="shadow h-100">
                            <Card.Header className="py-3 text-center bg-secondary text-white">Vehicules</Card.Header>
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                <Card.Text className="mb-0">{data?.cars} {data?.cars > 1 ? "Vehicules" : "Vehicule"}</Card.Text>
                                <FontAwesomeIcon icon={faCar} className="text-muted mt-3 fs-4" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Link to="/">
                            <Card className="shadow h-100">
                                <Card.Header className="py-3 text-center bg-danger text-white">Notifications</Card.Header>
                                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                    <Card.Text className="mb-0">{data?.reservations} {data?.reservations > 1 ? "Notifications" : "Notification"}</Card.Text>
                                    <FontAwesomeIcon icon={faBell} className="text-muted mt-3 fs-4" />
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AdminDashboard;
