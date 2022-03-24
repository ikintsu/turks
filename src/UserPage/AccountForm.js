import React from 'react';
import { useState } from "react";
import { post_tattoo } from '../utils/fetcher';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { validate_webhook } from '../utils/webhook';
import Alert from 'react-bootstrap/Alert';


export default function AccountForm(props) {
    const [tag_str, set_tag_str] = useState("");

    const [head, set_head] = useState(false);
    const [neck, set_neck] = useState(false);
    const [arm, set_arm] = useState(false);
    const [hand, set_hand] = useState(false);
    const [finger, set_finger] = useState(false);
    const [stomach, set_stomach] = useState(false);
    const [chest, set_chest] = useState(false);
    const [butt, set_butt] = useState(false);
    const [genital, set_genital] = useState(false);
    const [thigh, set_thigh] = useState(false);
    const [calf, set_calf] = useState(false);
    const [leg, set_leg] = useState(false);
    const [feet, set_feet] = useState(false);


    const get_body = () => {
        return {
            head: document.getElementById("head").checked,
            neck: document.getElementById("neck").checked,
            arm: document.getElementById("arm").checked,
            hand: document.getElementById("hand").checked,
            finger: document.getElementById("finger").checked,
            stomach: document.getElementById("stomach").checked,
            chest: document.getElementById("chest").checked,
            butt: document.getElementById("butt").checked,
            genital: document.getElementById("genital").checked,
            thigh: document.getElementById("thigh").checked,
            calf: document.getElementById("calf").checked,
            leg: document.getElementById("leg").checked,
            feet: document.getElementById("feet").checked,
            back: document.getElementById("back").checked,
        };
    }

    const submit = (e, is_tattoo) => {
        e.preventDefault();

        const clean_tags = document.getElementById("tags").value.split(",").map(word => word.trim().toLowerCase());

        const non_empty = [];

        for (var i = 0; i < clean_tags.length; i++) {
            if (clean_tags[i] !== "") {
                non_empty.push(clean_tags[i]);
            }
        }

        console.log(non_empty);
        const data = {
            reviewed: true,
            is_tattoo: is_tattoo
        }

        if (is_tattoo) {
            data.data = {
                body: get_body(),
                tags: non_empty
            };
        }

        post_tattoo(props._id, data)
            .then(res => {
                if (res.status === 201) {
                    props.next();
                } else {
                    console.log("fuck")
                    window.location.reload();
                }
                document.getElementById("tags").value = "";
                document.getElementById("head").checked = false;
                document.getElementById("neck").checked = false;
                document.getElementById("arm").checked = false;
                document.getElementById("hand").checked = false;
                document.getElementById("finger").checked = false;
                document.getElementById("stomach").checked = false;
                document.getElementById("chest").checked = false;
                document.getElementById("butt").checked = false;
                document.getElementById("genital").checked = false;
                document.getElementById("thigh").checked = false;
                document.getElementById("calf").checked = false;
                document.getElementById("leg").checked = false;
                document.getElementById("feet").checked = false;
                document.getElementById("back").checked = false;
            })
            .catch(err => console.log(err));



        console.log(data);
    };


    return <Form className="">
        <Row>
            <Col xs={6}>
                <Form.Group className="mb-3" controlId="2">
                    <Form.Label>Where on the body?</Form.Label>
                    <Form.Check id="back" onChange={e => {
                        set_head(e.target.checked);
                    }} type="checkbox" label="Back" />
                    <Form.Check id="head" onChange={e => {
                        set_head(e.target.checked);
                    }} type="checkbox" label="Head" />
                    <Form.Check id="neck" onChange={e => {
                        set_neck(e.target.checked);
                    }} type="checkbox" label="Neck" />
                    <Form.Check id="arm" onChange={e => {
                        set_arm(e.target.checked);
                    }} type="checkbox" label="Arm" />
                    <Form.Check id="hand" onChange={e => {
                        set_hand(e.target.checked);
                    }} type="checkbox" label="Hand" />
                    <Form.Check id="finger" onChange={e => {
                        set_finger(e.target.checked);
                    }} type="checkbox" label="Fingers" />
                    <Form.Check id="stomach" onChange={e => {
                        set_stomach(e.target.checked);
                    }} type="checkbox" label="Stomach/Belly" />
                    <Form.Check id="chest" onChange={e => {
                        set_chest(e.target.checked);
                    }} type="checkbox" label="Chest" />
                    <Form.Check id="butt" onChange={e => {
                        set_butt(e.target.checked);
                    }} type="checkbox" label="Butt" />
                    <Form.Check id="genital" onChange={e => {
                        set_genital(e.target.checked);
                    }} type="checkbox" label="Genital" />
                    <Form.Check id="thigh" onChange={e => {
                        set_thigh(e.target.checked);
                    }} type="checkbox" label="Thigh" />
                    <Form.Check id="calf" onChange={e => {
                        set_calf(e.target.checked);
                    }} type="checkbox" label="Calf" />
                    <Form.Check id="leg" onChange={e => {
                        set_leg(e.target.checked);
                    }} type="checkbox" label="Leg" />
                    <Form.Check id="feet" onChange={e => {
                        set_feet(e.target.checked);
                    }} type="checkbox" label="Feet" />
                </Form.Group>
            </Col>

            <Col>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Tags (comma separated, lowercase and singular nouns please)</Form.Label>
                    <Form.Control id="tags" defaultValue="" onChange={(e) => {
                        set_tag_str(e.target.value);
                    }} />
                </Form.Group>
            </Col>
        </Row>


        <Row>
            <Col>
                <Button style={{ "marginRight": "0.25vw" }} onClick={(e) => {
                    submit(e, false)

                }} variant="outline-danger" type="submit">
                    Not A Tattoo
                </Button>

                <Button style={{ "marginLeft": "0.25vw" }} onClick={e => { submit(e, true) }} variant="outline-primary" type="submit">
                    Submit
                </Button>
            </Col>
        </Row>
    </Form >
}