import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { get_accounts } from '../utils/fetcher';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import WebhookForm from './WebhookForm';
import AccountForm from './AccountForm';
import { validate_webhook, send_a_test } from '../utils/webhook';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';



export default function StoreAccordionItem(props) {
    const [account, set_account] = useState(props.account);
    console.log(props.account);
    const [can_edit_wh, set_can_edit_wh] = useState(false);
    const [can_edit_email_pass, set_can_edit_email_pass] = useState(false);
    const [bad_whs, set_bad_whs] = useState(null);
    const [attention_needed, set_attention_needed] = useState(false);
    const [test_whs_bad, set_test_whs_bad] = useState(null);

    useEffect(() => {

        console.log("running pre-check of webhooks");
        const { stats, active, paid, sold } = account;
        Promise.all([
            validate_webhook(active),
            validate_webhook(paid),
            validate_webhook(sold),
            validate_webhook(stats)
        ])
            .then(statuses => {
                console.log(165, statuses);

                const bad_whs = [];
                const order = ["Active", "Paid", "Sold", "Statistics"];
                for (var i = 0; i < statuses.length; i++) {
                    if (!statuses[i]) {
                        bad_whs.push(order[i]);
                    } else {
                        // good webhook
                        continue;
                    }
                }
                if (bad_whs.length > 0) {
                    set_bad_whs(bad_whs);
                    set_attention_needed(true);
                } else {
                    set_bad_whs(null);

                    // checks if the script has invalid login response, and they haven't updated it yet
                    set_attention_needed(!account.email_pass_good && !account.email_pass_updated);
                }
            })
            .catch(e => console.log(e));
    }, [account]);

    const update_webhook_success = (active, paid, sold, stats) => {
        console.log("setting account state in StoreAccordionItem")
        set_account({
            ...account,
            active: active,
            paid: paid,
            sold: sold,
            stats: stats
        });
    };

    const update_email_pass_success = (email) => {
        console.log("setting account EMAIL state in StoreAccordionItem")
        set_account({
            ...account,
            email: email,
            email_pass_updated: true
        });

    };


    return (<Accordion.Item eventKey={props.the_key}>
        <Accordion.Header>
            {`${account.store}`}
            <Badge style={{ "marginLeft": "0.5vw" }} bg="warning">{account.email.toLowerCase()}</Badge>
            {attention_needed ? <Badge style={{ "marginLeft": "0.5vw" }} bg="danger">There are issues with this account</Badge> : null}
        </Accordion.Header>
        <Accordion.Body>
            <Row>
                <Col xs={4}>
                    <Card>
                        <Card.Header as="h5">Account Details</Card.Header>
                        <Card.Body>
                            {/* email pass are wrong and they haven't updated it yet  */}
                            {can_edit_email_pass === false && account.email_pass_good === false && account.email_pass_updated === false ? <Alert variant="danger">
                                {`The login credentials for your ${account.store} consigner account is invalid. Please update it to continue receiving Discord notifications.`}
                            </Alert> : null}
                            {can_edit_email_pass ? <AccountForm can_edit={set_can_edit_email_pass} update_success={update_email_pass_success} account={account} /> :
                                <div>
                                    <Card.Text>
                                        Email: {account.email}
                                        <br></br>
                                        Password: ●●●●●●●●
                                    </Card.Text>
                                    <Button variant="outline-primary"
                                        onClick={() => { set_can_edit_email_pass(true) }}>
                                        Edit details
                                    </Button>
                                </div>}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={8}>
                    <Card>
                        <Card.Header as="h5">Webhook Details</Card.Header>
                        <Card.Body style={{ "overflowWrap": "breakWord" }}>
                            {bad_whs ? <Alert variant="danger">
                                {`Invalid webhooks: ${bad_whs.join(", ")}. Please update them.`}
                            </Alert> : null}
                            {
                                can_edit_wh ? <WebhookForm can_edit={set_can_edit_wh} update_success={update_webhook_success} account={account} /> :
                                    (<div>
                                        <Card.Text>
                                            {"Active: " + account.active}
                                            <br />
                                            {"Sold: " + account.sold}
                                            <br />
                                            {"Paid: " + account.paid}
                                            <br />
                                            {"Statistics: " + account.stats}
                                        </Card.Text>

                                        <Button style={{ "marginRight": "0.125vw" }} disabled={can_edit_wh}
                                            onClick={() => { set_can_edit_wh(true) }}
                                            className="mt-2"
                                            variant="outline-primary">
                                            Edit Webhooks
                                        </Button>
                                        <OverlayTrigger
                                            placement="right"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={(props) => {
                                                return <Tooltip id="button-tooltip" {...props}>
                                                You should receive 4 test messages at the above webhooks
                                              </Tooltip>
                                            }}>
                                            <Button style={{ "marginLeft": "0.125vw" }} disabled={can_edit_wh}
                                                onClick={() => {
                                                    const order = ["Active", "Paid", "Sold", "Statistics"];
                                                    const urls = [account.active, account.paid, account.sold, account.stats];
                                                    console.log(urls);
                                                    console.log(account);
                                                    send_a_test(urls)
                                                        .then(responses => responses.map(res => res.status))
                                                        .then(statuses => {
                                                            const bad = [];
                                                            for (var i = 0; i < statuses.length; i++) {
                                                                if (statuses[i] != 204) {
                                                                    bad.push(order[i]);
                                                                }
                                                            }
                                                            if (bad.length > 0) {
                                                                set_bad_whs(bad);
                                                                set_attention_needed(true);
                                                            }
                                                        })
                                                        .catch(e => console.log("damn"));
                                                }}
                                                className="mt-2"
                                                variant="outline-warning">
                                                Test Webhooks
                                            </Button>
                                        </OverlayTrigger>
                                    </div>)
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Accordion.Body>
    </Accordion.Item>);
}