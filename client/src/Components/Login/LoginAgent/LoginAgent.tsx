import { useFormik } from 'formik';
import React from 'react'
import { Container, Form, Row } from 'react-bootstrap';
import { LoginAgentSchema } from '../../../Configuration/Schema';
import { toast } from 'react-toastify';
import SubmitButton from '../../../SubComponents/SubmitButton/SubmitButton.tsx';
import "./LoginAgent.css";
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { useDispatch } from "react-redux";
import { loginAgency } from '../../../Configuration/agencySlice.ts';
import { logout } from '../../../Configuration/userSlice.ts';


function LoginAgent() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (values: any, actions: any) => {
        try {
            setLoading(true);
            const res: AxiosResponse<any, any> = await axios.post("http://localhost:5000/agent/login", values, { withCredentials: true });
            if (res.data.success) {
                toast.success("Login Succès");
                dispatch(logout());
                dispatch(loginAgency(res.data.agency));
                actions.resetForm();
                navigate("/agence-dashboard");
            } else if (res.status === 400) {
                toast.warning("Remplissez tous les champs");
                return false;
            } else {
                toast.error("Ops Server Error");
                return false;
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: LoginAgentSchema,
        onSubmit,
    });
    return (
        <section className="login-agent py-5">
            <Container>
                <h3 className="text-light text-center title py-5">Login Agence</h3>
                <Row>
                    <div className="col-11 col-md-6 col-lg-5 col-xlg-4 mx-auto">
                        <Form className="agent-register-form" onSubmit={handleSubmit} autoComplete="off">
                            <Form.Control className="input-form" type="email" value={values.email} onBlur={handleBlur} onChange={handleChange} placeholder="email" name="email" />
                            {errors.email && touched.email && <h6 className="text-danger error-header">{errors.email}</h6>}
                            <Form.Control className="input-form" type="password" value={values.password} onBlur={handleBlur} onChange={handleChange} placeholder="password" name="password" />
                            {errors.password && touched.password && <h6 className="text-danger error-header">{errors.password}</h6>}
                            <SubmitButton disabled={isSubmitting} loading={loading} />
                            <Form.Text id="passwordHelpBlock" muted>
                                <p className="pt-3">Vous navez pas du compte <Link to="/register-agent">Register</Link></p>
                            </Form.Text>
                        </Form>
                    </div>
                </Row>
            </Container>
        </section>
    )
}

export default LoginAgent;