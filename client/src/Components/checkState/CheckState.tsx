import React, { useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function CheckState() {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user.currentUser);
    const agency = useSelector((state: any) => state.auth.agency.currentAgency);
    const [agentState, setAgentState] = React.useState<boolean | string>(() => {
        const storedAgentState = localStorage.getItem("agent-state");
        return storedAgentState ? JSON.parse(storedAgentState) : false;
    });

    React.useEffect(() => {
        const handleBeforeUnload = () => {
            // Perform actions when the user exits the page or closes the browser
            localStorage.setItem("agent-state", "false");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            // Cleanup: Remove event listener when the component unmounts
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    React.useEffect(() => {
        const getState = async () => {
            if (user) {
                const res: AxiosResponse<any, any> = await axios.post("http://localhost:5000/user-state", null, { withCredentials: true });
                console.log(res);
                if (res.data.success === false && res.status === 403) {
                    navigate("/login");
                    toast.warning("Votre inscription est expiré, incriré une aute fois");
                } else if (res.data.success) {
                    return true;
                } else if (res.status === 500) {
                    navigate("/login");
                    toast.warning("Ops Server Error");
                }

            } else if (agency) {
                const res: AxiosResponse<any, any> = await axios.post("http://localhost:5000/agent-state", null, { withCredentials: true });
                console.log(res);
                if (res.data.success === false && res.status === 403) {
                    navigate("/login-agent");
                    toast.warning("Votre inscription est expiré, incriré une aute fois");
                } else if (res.data.success) {
                    if (agentState === false) {
                        navigate("/agence-dashboard");
                        toast.info("Bienvenue");
                        localStorage.setItem("agent-state", "true");
                        setAgentState(true);
                    } else {
                        return false;
                    }
                } else if (res.status === 500) {
                    navigate("/login-agent");
                    toast.error("Votre inscription est expiré, incriré une aute fois");
                }
            }
        };

        if (user || agency) {
            getState();
        }
    }, [user, agency]);

    return (
        <Outlet />
    );
}

export default CheckState;
