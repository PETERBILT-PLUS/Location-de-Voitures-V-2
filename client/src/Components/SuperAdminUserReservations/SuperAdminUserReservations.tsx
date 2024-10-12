import axios, { AxiosResponse } from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import { Card, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


function SuperAdminUserReservations() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const params = useParams();

    useLayoutEffect(() => {
        document.title = "Réservations D'utilisateur";
    }, []);

    useEffect(() => {
        const getUserReservations = async () => {
            try {
                const res: AxiosResponse<any> = await axios.get(`${SERVER}/super-admin/get-user-reservations?user=${params.id}`, { withCredentials: true });
                if (res.data.success) {
                    setReservations(res.data.reservations);
                    console.log(res.data.reservations);
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error(error?.message);
                }
            } finally {
                setLoading(false);
            }
        };

        getUserReservations();
    }, []);

    if (loading) {
        return (
            <div className="min-vh-100 bg-light d-flex flex-row justify-content-center align-items-center">
                <Spinner></Spinner>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light py-5">
            <Container>

                <h1 className="fs-3 text-center pb-5 pt-2" style={{ color: "var(--lightBlue)" }}>Réservations D'utilisateur:</h1>
                {!reservations.length && !loading && <h2 className="text-center fs-4" style={{ color: "var(--highBlue)" }}>Pas de Réservation</h2>}

                <Row xs={12} md={6}>
                    {!!reservations.length && reservations.map((elem: any, index: number) => {
                        return (
                            <Col xs={12} md={12} key={index}>
                                <Card>
                                    <Card.Header className="px-5 py-4 d-flex flex-row justify-content-start align-items-center gap-2">
                                        <Card.Title className="text-success text-start w-50">Nom: {elem.user.nom} {elem.user.prenom}</Card.Title>
                                        <div className="w-50 d-flex flex-row justify-content-center align-items-center">
                                            <Image src={elem.user.profilePicture} width={80} height={80} />
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="row px-5 pt-4 gap-3 gap-md-0">
                                        <Col xs={12} md={6}>
                                            <Card.Text className="text-primary fs-5">Voiture: {elem.car.carName}</Card.Text>
                                            <Card.Text className="text-secondary fs-6">Voiture Etat: {elem.car.carEtat}</Card.Text>
                                            <Card.Text className="text-secondary fs-6">Marque: {elem.car.carMarque}</Card.Text>
                                            <Card.Text className="text-secondary fs-6">Prix: {elem.car.pricePerDay} DH/Jour</Card.Text>
                                            <Card.Text className="text-secondary fs-6">Jours: {elem.totalDays} {elem.totalDays > 1 ? "Jours" : "Jour"}</Card.Text>
                                            <Card.Text className="text-secondary fs-6">Total: {elem.totalDays * elem.car.pricePerDay} DH</Card.Text>
                                        </Col>

                                        <Col xs={12} md={6}>
                                            <Image src={elem.car.carPhotos[0]} className="w-100 rounded" />
                                        </Col>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </div>
    )
}

export default SuperAdminUserReservations;