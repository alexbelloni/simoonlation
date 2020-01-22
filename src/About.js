import React from 'react'
import { Container, Fade, Row, Col, Spinner, InputGroup, FormControl, Button, Card, Badge, Image, Nav } from 'react-bootstrap';
import themaria from './db/MariaAndOceanus.json'
import lacus from './db/Lacus.json'
import sinusAndPaludes from './db/SinusAndPaludes.json'
import craters from './db/Craters.json'
import twitterIcon from './assets/twitter.jfif'
import './about.css'
const About = () => {
    return (
        <div>
            <p>Simoonlation is a simulator of landing on the moon.</p>
            <p>You can choose a specific place or coordinates and time to land on a lunar area.</p>
            <p>Simoonlation was created for the NASA Space Apps Challenge in 2019.</p>
            <p>Our database has {themaria.length} maria, {lacus.length} lacus, {sinusAndPaludes.length} sinus, and {craters.length} craters.</p>
            <p>Alerts of dust are based on the coordinates of the landing areas, temperature, chemical composition and thickness of the soil.</p>
            <ul>
                <li>Temperature: average measures on plains, highlands, and craters</li>
                <li>Chemical composition: typical minerals found by regions</li>
                <li>Thinkness: the mean regolith layer thickness according to the table on Yurij G. Shkuratov's paper</li>
                <li>Age: supposed age of each formation</li>
                <li>Electrostatics: analysis based on the type of area, period of the day, thickness, and temperature</li>
            </ul>
            <div><b>Contact</b></div>
            <p>Visit the page of our project <a href='https://2019.spaceappschallenge.org/challenges/our-moon/dust-yourself-and-try-again/teams/datanauts-n-simoonlators/project' target='_blank'>here</a></p>
            <div class='contact'>
                <a href='https://twitter.com/xbelloni' target='_blank'>
                    <img src={twitterIcon} />
                    <span>alex</span>
                </a>
                <a href='https://twitter.com/An_an_iasz' target='_blank'>
                    <img src={twitterIcon} />
                    <span>anna</span>
                </a>
            </div>
        </div>
    )
}

export default About