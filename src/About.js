import React from 'react'
import { Container, Fade, Row, Col, Spinner, InputGroup, FormControl, Button, Card, Badge, Image, Nav } from 'react-bootstrap';
import themaria from './db/MariaAndOceanus.json'
import lacus from './db/Lacus.json'
import sinusAndPaludes from './db/SinusAndPaludes.json'
import craters from './db/Craters.json'

const About = ()=>{
    return (
        <div>
            <p>Simoonlation is a simulator of landing on the moon.</p>
            <p>You can choose a specific place or coordinates and time to land on a lunar area.</p>
            <p>Simoonlation was created for the NASA Space Apps Challenge</p>
            <p>Our database has {themaria.length} maria, {lacus.length} lacus, {sinusAndPaludes.length} sinus, and {craters.length} craters.</p>
            <p>Alerts of dust are based on the coordinates of the landing areas, temperature, chemical composition and thickness of the soil</p>
            <p>Temperature: average measures on plains, highlands, and craters</p>
            <p>Chemical composition: typical minerals found by regions</p>
            <p>Thinkness: the mean regolith layer thickness according to the table on Yurij G. Shkuratov's paper.</p>
            <p>Age: supposed age of each formation.</p>
            <p>Electrostatics: analysis based on the type of area, period of the day, thickness, and temperature.</p>
            <p>Visit the page of our project here: ...</p>
        </div>
      )
}

export default About