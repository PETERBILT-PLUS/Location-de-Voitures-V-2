import { useEffect, useState } from 'react';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Container, Modal, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import "./AgenceAdminVehicule.css";
import { Link } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

function AgenceAdminVehicules() {
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const [data, setData] = useState<any[]>([]);
    const [show, setShow] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

    const handleClose = () => setShow(false);
    const handleShow = (carId: string) => {
        setSelectedCarId(carId);
        setShow(true);
    };

    const handleDelete = async () => {
        if (selectedCarId) {
            try {
                const res: AxiosResponse<any, any> = await axios.delete(`${SERVER}/agent/delete-car/${selectedCarId}`, { withCredentials: true });
                if (res.data.success) {
                    toast.success('Voiture supprimée avec succès');
                    setData(data.filter(car => car._id !== selectedCarId));
                    handleClose();
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error(error?.message);
                }
            }
        }
    };

    useEffect(() => {
        const getAgencyCars = async () => {
            try {
                const res: AxiosResponse<any, any> = await axios.get(`${SERVER}/agent/get-cars`, { withCredentials: true });
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error(error?.message);
                }
            }
        };

        getAgencyCars();
    }, []);

    return (
        <div>
            <div className="py-5 d-flex justify-content-center">
                <Container>
                    <Row xs={1} md={3} className="g-4">
                        <Col>
                            <Card className="shadow h-100">
                                <Card.Header className="py-3 text-center bg-primary text-white">Vehicules</Card.Header>
                                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                    <Card.Text className="mb-0">{data.length === 0 ? null : data.length } {!data.length ? "Pas De Voitures" : data.length === 1 ? "Vehicule" : "Vehicules"}</Card.Text>
                                    <FontAwesomeIcon icon={faCar} className="text-muted mt-3 fs-4" />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="py-5">
                <Container>
                    <h1 className="text-center title display-6 pb-5 pt-3">Votre Voitures</h1>
                    <Row xs={1} md={3} className="g-4">
                        {data.length ? (
                            data.map((elem: any) => {
                                return (
                                    <Col key={elem._id}>
                                        <Card style={{ width: '18rem' }}>
                                            <Card.Img variant="top" src={elem.carPhotos[0]} />
                                            <Card.Body>
                                                <Card.Title className="text-primary">Nom: {elem.carName}</Card.Title>
                                                <Card.Title>Marque: {elem.carMarque}</Card.Title>
                                                <Card.Title>Etat: {elem.carEtat}</Card.Title>
                                                <div className="d-flex gap-3 border-top pt-3">
                                                    <Link to={`/agence-dashboard/edit-vehicule/${elem._id}`}><button className="edit-car-btn">Modifier</button></Link>
                                                    <button className="delete-car-btn" onClick={() => handleShow(elem._id)}>Supprimer</button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })
                        ) : (
                            <h2 className="text-primary text-center w-100">Pas De Voitures</h2>
                        )}
                    </Row>
                </Container>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation de Suppression</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Êtes-vous sûr de vouloir supprimer ce véhicule ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Annuler
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Supprimer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default AgenceAdminVehicules;
