import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { get_all_stores, post_new_store_user } from '../utils/fetcher';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';


export default function NewStore() {
    const { state } = useLocation();
    const navigate = useNavigate();

    // if there is no user data, go back home and let them log in
    if (state === null) {
        navigate('/');
    }
    if (!state.discord_user) {
        navigate('/');
    }

    // whether or not the add account button is able to submit
    const [submittable, setSubmittable] = useState(false);
    const [stores, set_stores] = useState([]);
    const [selected_sku, set_selected_sku] = useState(null);
    // fields for the form
    const [email, set_email] = useState("");
    const [pass, set_pass] = useState("");
    const [active, set_active] = useState("");
    const [paid, set_paid] = useState("");
    const [sold, set_sold] = useState("");
    const [stats, set_stats] = useState("");
    const [error_message, set_error_message] = useState(null);
    const [success, set_success] = useState(false);

    useEffect(() => {
        get_all_stores()
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    navigate('/user', { state: { discord_user: state.discord_user } });
                }
            })
            .then(stores_arr => set_stores(stores_arr))
            .catch(err => {
                navigate('/user', { state: { discord_user: state.discord_user } });
            })
    }, []);

    return <div>
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#features">Features</Nav.Link>
                    <Nav.Link href="#pricing">Pricing</Nav.Link>
                </Nav>
            </Container>
        </Navbar>

        <Container className="mt-5">
            <Row>
                <Col>
                    <Card style={{ "marginTop": "10%", "marginBottom": "20%" }}>
                        <Card.Header as="h5">Add New Consigner Account</Card.Header>
                        <Card.Body className="mt-2">
                            {success ? <Alert variant="success">Your account has been added</Alert> : null}
                            {error_message !== null && !success ? <Alert variant="danger">{error_message}</Alert> : null}
                            {success ? null : <div>
                                <Row className="mb-4">
                                    <Col xs={3}></Col>
                                    <Col>
                                        <Form.Select onChange={(e) => { set_selected_sku(e.target.value); console.log(e.target.value) }} aria-label="Default select example" >
                                            <option>Select Store</option>

                                            {stores.map(store => <option value={[`${store.store_sku}`, `${store.store}`]}>{`${store.store}`}</option>)}
                                        </Form.Select>
                                    </Col>

                                    <Col xs={3}></Col>
                                </Row>
                                <Form className="mt-3" style={{ "paddingLeft": "1vw", "paddingRight": "1vw" }}>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-1" controlId="formBasicEmail">
                                                <Form.Label>Consigner email address</Form.Label>
                                                <Form.Control type="email" autoComplete="none" placeholder="Enter email" onChange={(e) => set_email(e.target.value)} />
                                                < Form.Text className="text-muted" >
                                                    We'll never share your email with anyone else.
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-1" controlId="formBasicPassword">
                                                <Form.Label>Consigner password</Form.Label>
                                                <Form.Control type="password" autoComplete="nope" placeholder="Enter Password" onChange={(e) => set_pass(e.target.value)} />
                                                <Form.Text className="text-muted">
                                                    Passwords are Fernet encrypted.
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mt-4">
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Statistics Discord Webhook</Form.Label>
                                                <Form.Control onChange={(e) => set_stats(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Sold Discord Webhook</Form.Label>
                                                <Form.Control onChange={(e) => set_sold(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Paid Out Discord Webhook</Form.Label>
                                                <Form.Control onChange={(e) => set_paid(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Active Discord Webhook</Form.Label>
                                                <Form.Control onChange={(e) => set_active(e.target.value)} />
                                            </Form.Group>
                                        </Col>

                                    </Row>

                                    <Row>
                                        <Col>
                                            <Button onClick={(e) => {
                                                e.preventDefault();
                                                console.log(selected_sku);
                                                console.log(typeof (selected_sku));
                                                if (selected_sku === "Select Store" || selected_sku === null) {
                                                    // TODO show error message
                                                } else {
                                                    const s = selected_sku.split(',')
                                                    post_new_store_user(state.discord_user.id, email, pass, active, paid, sold, stats, s[0], s[1])
                                                        .then(res => res.status)
                                                        .then(code => {
                                                            if (code === 201) {
                                                                set_success(true);
                                                                setTimeout(() => navigate('/user', { state: { discord_user: state.discord_user } }), 2000);
                                                            } else if (code === 409) {
                                                                set_error_message(`You already have an account at ${s[1]} with the email ${email}.`);
                                                            } else if (code === 404) {
                                                                set_error_message(`An internal error occurred. Please try again later or contact admins.`);
                                                            }
                                                        })
                                                        .catch(err => console.log(err));
                                                }
                                            }} variant="outline-primary" type="submit">
                                                Add Account
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </div >;
}