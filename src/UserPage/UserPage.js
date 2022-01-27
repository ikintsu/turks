import React from 'react';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { get_tattoo } from '../utils/fetcher';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
// import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AccountForm from './AccountForm';


export default function UserPage() {
    const [data, set_data] = useState(null);
    const [done, set_done] = useState(false);

    const next = () => {
        get_tattoo()
            .then(res => {
                const code = res.status;

                if (code === 200) {
                    return res.json();
                } else {
                    window.location.reload();
                }
            })
            .then(data => {
                if (data === null) {

                    set_done(true);
                }
                console.log(data);
                set_data(data);
            })
    };
    

    useEffect(() => {
        get_tattoo()
            .then(res => {
                const code = res.status;

                if (code === 200) {
                    return res.json();
                } else {
                    window.location.reload();
                }
            })
            .then(data => {
                if (data === null) {

                    set_done(true);
                }
                console.log(data);
                set_data(data);
            })
    }, []);


    return <div>
        {done === true ? <p>{"DONE"}</p> : 
        <Container className="">
            <Row>
                <Col>
                    <Card style={{ "paddingBottom": "2vh", "marginTop": "10%", "marginBottom": "10%" }}>
                        <Card.Header as="h5">Hey daddy</Card.Header>
                        <Card.Body>
                            <Card.Title>Do that shit!</Card.Title>
                            {data !== null ? <img src={data.image} style={{ 'width': "50vw", "marginBottom": "2vh"}} /> : null}
                            {data !== null ? <AccountForm next={next} _id={data._id}/> : null}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container> }
    </div>;
}