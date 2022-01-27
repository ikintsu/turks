import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import './HomePage.css';

const config = require('./config.json');


export default function HomePage() {
    return (
        <div id="login-button">
            <Button
                href={config.test.url}
                variant="success">
                Log In With Discord
            </Button>
        </div>
    )
}