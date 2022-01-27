import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { get_accounts } from '../utils/fetcher';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import StoreAccordionItem from './StoreAccordionItem';


export default function StoresUserPage(props) {
    if (!props.data) {
        return null;
    } else if (props.data.length === 0) {
        return null;
    } else {
        return <Row>
            {/* for spacing */}
            {/* <Col xs={1}></Col> */}

            <Col style={{ "paddingLeft": "3vw", "paddingRight": "3vw" }}>
                <Accordion>
                    { props.data.map((acc, idx) => {
                        console.log(idx);
                        return <StoreAccordionItem key={idx} the_key={idx.toString()} account={acc} />
                    }) }
                </Accordion>
            </Col>

            {/* for spacing  */}
            {/* <Col xs={1}></Col> */}
        </Row>
    }


}