import { useState, useEffect, useCallback } from 'react';
import { Container, Card, Spinner, Row, Col, Form } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { carMarques, moroccanCities, typesVoitures } from "../../Configuration/values";
import "./Home.css";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

interface IVehicle {
    _id: string;
    carEtat: string;
    carFuel: string;
    carKm: number;
    carMarque: string;
    carPhotos: string[];
    carType: string;
    insurance: {
        expirationDate: Date;
        insuranceCompany: string;
        policyNumber: string;
    };
    places: number;
    registration: {
        registrationDate: Date;
        registrationExpiration: Date;
        registrationNumber: string;
        vehicleIdentificationNumber: string;
    };
    ownerId: string;
    // Add more fields as needed
}

interface IFilter {
    marque: string;
    fuelType: string;
    city: string;
    carType: string;
}

function Home() {
    const [vehicles, setVehicles] = useState<IVehicle[]>([]);
    const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<IFilter>({
        marque: "",
        fuelType: "",
        city: "",
        carType: "",
    });
    const [myCount, setMyCount] = useState<number>();

    // Fetch vehicles data based on filters and pagination
    const fetchVehicles = async (reset: boolean = false) => {
        if (loading) return;

        setLoading(true);

        try {
            const response: AxiosResponse<any, any> = await axios.get(`http://localhost:5000/user`, {
                params: {
                    cursor: reset ? null : nextCursor,
                    marque: filter.marque,
                    fuelType: filter.fuelType,
                    city: filter.city,
                    carType: filter.carType
                }
            });

            console.log(response.data);


            const { vehicles: newVehicle, nextCursor: newNextCursor, count } = response.data;
            setMyCount(count);
            console.log(newVehicle);


            if (reset) {
                setVehicles([...newVehicle]);
            } else {
                setVehicles((prevVehicles) => [...prevVehicles, ...newVehicle]);
            }
            setNextCursor(newNextCursor);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message || 'Error fetching vehicles');
            } else {
                toast.error("An Error Happened While Fetching Data");
            }
        } finally {
            setLoading(false);
        }
    };

    // Effect to fetch data on filter change
    useEffect(() => {
        fetchVehicles(true); // Reset vehicle list when filters change
    }, [filter]); // Depend on filters

    const loadMoreVehicles = useCallback(() => {
        if (nextCursor && !loading) {
            fetchVehicles();
        }
    }, [nextCursor, loading]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name && value) {
            setFilter(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFuelOptionChange = (fuelType: string) => {
        setFilter(prev => ({ ...prev, fuelType }));
    };

    const handleClearFuelOption = () => {
        if (!filter.fuelType) return;
        setFilter(prev => ({ ...prev, fuelType: "" }));

    };

    const handleClearCarMarque = () => {
        if (!filter.marque) return;
        setFilter((prev) => ({ ...prev, marque: "" }));
    }

    const handleClearCity = () => {
        if (!filter.city) return;
        setFilter((prev) => ({ ...prev, city: "" }));
    }

    const handleClearCarType = () => {
        if (!filter.carType) return;
        setFilter((prev) => ({ ...prev, carType: "" }));
    }

    return (
        <section className="cars-section py-5 min-h-100">
            <Container className="mt-5">
                <Row>
                    <Col md={{ span: 4, order: 'last' }} lg={3} className="py-3 d-none d-md-block">
                        <div className="rounded bg-light py-4 px-3">
                            <h3 className="title fs-3 filter-title">Filter</h3>
                            <div className="text-center w-50" style={{ backgroundColor: "var(--lightBlue)", height: "1px", borderRadius: "5px" }} />
                            <Form.Group className="py-3">
                                <h4 className="title py-3">Marque</h4>
                                <Form.Select className="w-75" defaultValue="" name="marque" onChange={handleChange} value={filter.marque}>
                                    <option value="" disabled>Marque du Voiture</option>
                                    {carMarques.map((elem: string, index: number) => (
                                        <option key={index} value={elem}>{elem}</option>
                                    ))}
                                </Form.Select>

                                <button type="button" className="btn btn-primary px-3 py-2 m-2" onClick={handleClearCarMarque}>Clear</button>
                            </Form.Group>

                            <Form.Group>
                                <h4 className="title py-3">Carburant</h4>
                                <Form.Label className="d-flex flex-row px-3">
                                    <Form.Check type="radio" name="fuelType" id="essence" onChange={() => handleFuelOptionChange("Essence")} checked={filter.fuelType === "Essence"} />
                                    <Form.Check className="px-2">Essence</Form.Check>
                                </Form.Label>
                                <Form.Label className="d-flex flex-row px-3">
                                    <Form.Check type="radio" name="fuelType" id="diesel" onChange={() => handleFuelOptionChange("Diesel")} checked={filter.fuelType === "Diesel"} />
                                    <Form.Check className="px-2">Diesel</Form.Check>
                                </Form.Label>
                                <Form.Label className="d-flex flex-row px-3">
                                    <Form.Check type="radio" name="fuelType" id="hybrid" onChange={() => handleFuelOptionChange("Hybrid")} checked={filter.fuelType === "Hybrid"} />
                                    <Form.Check className="px-2">Hybrid</Form.Check>
                                </Form.Label>
                                <Form.Label className="d-flex flex-row px-3">
                                    <Form.Check type="radio" name="fuelType" id="electrique" onChange={() => handleFuelOptionChange("Electrique")} checked={filter.fuelType === "Electrique"} />
                                    <Form.Check className="px-2">Electrique</Form.Check>
                                </Form.Label>

                                <button type="button" className="btn btn-primary px-3 py-2 m-2" onClick={handleClearFuelOption}>Clear</button>
                            </Form.Group>

                            <Form.Group className="py-3">
                                <h4 className="title py-3">Ville</h4>
                                <Form.Select className="w-75" defaultValue="" name="city" onChange={handleChange}>
                                    <option value="" disabled>Ville</option>
                                    {moroccanCities.map((elem: string, index: number) => (
                                        <option key={index} value={elem}>{elem}</option>
                                    ))}
                                </Form.Select>

                                <button type="button" className="btn btn-primary px-3 py-2 m-2" onClick={handleClearCity}>Clear</button>
                            </Form.Group>

                            <Form.Group>
                                <h4 className="title py-3">Type de Voiture</h4>
                                <Form.Select defaultValue="" name="carType" onChange={handleChange}>
                                    <option value="" disabled>Type De Voiture</option>
                                    {typesVoitures.map((elem: any, index: number) => (
                                        <option key={index} value={elem}>{elem}</option>
                                    ))}
                                </Form.Select>

                                <button type="button" className="btn btn-primary px-3 py-2 m-2" onClick={handleClearCarType}>Clear</button>
                            </Form.Group>
                        </div>
                    </Col>
                    <Col md={8} lg={9}>
                        <InfiniteScroll
                            dataLength={vehicles.length}
                            next={loadMoreVehicles}
                            hasMore={vehicles.length < Number(myCount)} // Check if there's a nextCursor
                            loader={<div key={0} className="text-center"><Spinner animation="border" role="status"><span className="sr-only text-center">Loading...</span></Spinner></div>}
                            endMessage={<p className="text-center w-100">No more vehicules to load.</p>}
                            className="row w-100"
                        >
                            {vehicles?.map((vehicle: any, index: number) => (
                                <Link to={`/cars/${vehicle._id}`} className="col-12 col-lg-6 text-decoration-none" key={index}>
                                    <Card className="my-3" style={{ width: "100%" }}>
                                        <Card.Img
                                            variant="top"
                                            src={vehicle.carPhotos[0]}
                                            style={{ width: "100%", height: '300px', objectFit: 'cover' }}
                                        />
                                        <Card.Body>
                                            <Card.Text>{vehicle.carMarque}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            ))}

                        </InfiniteScroll>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default Home;
