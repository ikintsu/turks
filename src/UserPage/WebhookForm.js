import React from 'react';
import { useState } from "react";
import { update_webhooks } from '../utils/fetcher';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { validate_webhook } from '../utils/webhook';
import Alert from 'react-bootstrap/Alert';


export default function WebhookForm(props) {
    const [stats, set_stats] = useState(props.account.stats);
    const [active, set_active] = useState(props.account.active);
    const [sold, set_sold] = useState(props.account.sold);
    const [paid, set_paid] = useState(props.account.paid);
    const [validate_success, set_validate_success] = useState(false);
    const [validate_responded, set_validate_responded] = useState(false);
    const [update_success, set_update_success] = useState(null);


    return <Form className="">
        {update_success ? <Alert variant="warning">
            Successfully updated
        </Alert> : null}

        {validate_responded ? (
            validate_success ? <Alert variant="success">
                Your webhooks are valid! Submission is open.
            </Alert> : <Alert variant="danger">
                One or more webhooks are invalid! Try again.
            </Alert>
        ) : null}
        <Row className="">
            <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Statistics</Form.Label>
                    <Form.Control defaultValue={stats} onChange={(e) => {
                        set_validate_responded(false);
                        set_stats(e.target.value)
                    }} />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Sold</Form.Label>
                    <Form.Control defaultValue={sold} onChange={(e) => {
                        set_validate_responded(false);
                        set_sold(e.target.value)
                    }} />
                </Form.Group>
            </Col>

        </Row>

        <Row>
            <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Paid</Form.Label>
                    <Form.Control defaultValue={paid} onChange={(e) => {
                        set_validate_responded(false);
                        set_paid(e.target.value)
                    }} />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Active</Form.Label>
                    <Form.Control defaultValue={active} onChange={(e) => {
                        set_validate_responded(false);
                        set_active(e.target.value)
                    }} />
                </Form.Group>
            </Col>
        </Row>


        <Row>
            <Col>
                <Button onClick={(e) => {
                    e.preventDefault();
                    Promise.all([
                        validate_webhook(stats),
                        validate_webhook(active),
                        validate_webhook(paid),
                        validate_webhook(sold)
                    ])
                        .then(statuses => {
                            console.log(statuses);
                            var all_true = true;
                            for (var i = 0; i < statuses.length; i++) {
                                all_true = all_true && statuses[i];
                            }

                            if (all_true) {
                                set_validate_success(true);
                            } else {
                                set_validate_success(false);
                            }

                            set_validate_responded(true);
                        })
                        .catch(e => console.log(e));


                }} variant="outline-success" type="submit">
                    Validate Webhooks
                </Button>
            </Col>

            <Col>
                <Button disabled={!(validate_responded && validate_success)} onClick={(e) => {
                    e.preventDefault();

                    update_webhooks(props.account._id, active, paid, sold, stats)
                        .then(res => res.status)
                        .then(code => {
                            console.log("code from update_webhooks", code)
                            if (code !== 201) {
                                // update failed, show a Error message or something
                                console.log("Webhook update was unsucessful");
                                // TODO
                            } else {
                                // update was successful
                                console.log("Webhook update was sucessful");
                                props.update_success(active, paid, sold, stats);
                                set_validate_responded(false);
                                set_validate_success(false);
                                set_update_success(true);
                                setTimeout(() => {
                                    console.log("changing can edit to false");
                                    props.can_edit(false);
                                }, 3500);
                            }
                        })
                        .catch(e => {
                            // Some error message about trying again here
                        });
                }} variant="outline-primary" type="submit">
                    Submit
                </Button>
            </Col>
        </Row>

        <Row>
            <Form.Text className="mt-3 text-muted">
                Submit button is available only after validating webhooks
            </Form.Text>
        </Row>

        <Row className="mt-3">
            <Col xs={2} />
            <Col>
                <Button style={ {"align": "right"} } onClick={(e) => {
                    e.preventDefault();
                    props.can_edit(false);
                }} variant="outline-danger" type="submit">
                    Exit
                </Button>
            </Col>
            <Col xs={2} />
        </Row>
    </Form>
}