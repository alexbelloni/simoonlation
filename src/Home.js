import React from 'react';
import { Container, Fade, Row, Col, Spinner, InputGroup, FormControl, Button, Card, Badge, Image, Nav } from 'react-bootstrap';
import './Home.css'
import themaria from './db/MariaAndOceanus.json'
import lacus from './db/Lacus.json'
import sinusAndPaludes from './db/SinusAndPaludes.json'
import craters from './db/Craters.json'
import composition from './db/SurfaceComposition.json'
import moonLoading from './assets/152.gif'
import DustManager from './DustManager'
import About from './About'

export default class Home extends React.Component {
  state = { Lat: "54.0° N", Lon: "56.6° W", places: '', time: 12, loading: false, isHome: true }
  constructor(props) {
    super(props);
  }

  getFieldValue(field, value, component) {
    return <div><span>{field}: </span> <span><b>{value}</b></span> {component}</div>
  }

  getBadgeThickness(m, thickness) {
    let badge = <Badge variant="warning">Warning</Badge>
    switch (thickness.alert) {
      case 0:
        badge = <Badge variant="success">Success</Badge>
        break
      case 2:
        badge = <Badge variant="danger">Danger</Badge>
        break
    }
    return badge
  }

  getBadgeTemperature(m, temperature) {
    let badgeTemperature = <Badge variant="warning">Warning</Badge>
    if (temperature.value < -100) {
      badgeTemperature = <Badge variant="danger">Danger</Badge>
    } else if (temperature.value > 100) {
      badgeTemperature = <Badge variant="danger">Danger</Badge>
    }
    else if (temperature.value > -30 && temperature.value < 40) {
      badgeTemperature = <Badge variant="success">Normal</Badge>
    }
    return badgeTemperature
  }

  getBadgeAge(m) {
    return m.Age ? <Badge variant="danger">Danger</Badge> : <Badge variant="warning">Warning</Badge>
  }

  getBadgeElectrostatics(hasParticles) {
    return hasParticles ? <Badge variant="danger">Danger</Badge> : <Badge variant="warning">Warning</Badge>
  }

  getChemicalComposition(m) {
    return (
      m.Area === 'maria' ?
        composition.Maria.map(c => <div className='small'>{`${c.Compound} - ${c.Formula} - ${c.Composition}`}</div>) :
        composition.Highlands.map(c => <div className='small'>{`${c.Compound} - ${c.Formula} - ${c.Composition}`}</div>)
    )
  }

  getJSXArea(m) {
    const thickness = DustManager.getRegolithThicknessClassification(m)
    const badgeThickness = this.getBadgeThickness(m, thickness)
    const temperature = DustManager.getTemperature(m, this.state.time)
    const badgeTemperature = this.getBadgeTemperature(m, temperature)

    return (
      <Card key={m['Latin Name']} bg="light">
        <Card.Header><b>{m['Latin Name']}</b></Card.Header>
        <Card.Body>
          <Card.Text>
            <Row>
              <Col md={4}>
                <h4>Dust-wise:</h4>
                {/* <div>Thickness <Badge variant="danger"
                  onClick={() => alert('The thickness of the lunar regolith varies between around 2 meters (6.6 ft) beneath the maria, to up to 20 meters (66 ft) beneath the highlands')}>?</Badge>: */}
                {this.getFieldValue('Thickness', thickness.descr || 'unknown', badgeThickness)}
                {this.getFieldValue('Temperature', temperature.descr || 'unknown', badgeTemperature)}
                {this.getFieldValue('Electrostatics', this.getBadgeElectrostatics(DustManager.hasParticlesLevitating(m, this.state.time)))}
                {this.getFieldValue('Age', m['Age'] ? `${m['Age']} billion years ago` : 'unknown', this.getBadgeAge(m))}
              </Col>
              <Col md={4}>
                {this.getFieldValue('English Name', m['English Name'])}
                {this.getFieldValue('Area', m['Area'])}
                {this.getFieldValue('Diameter', `${m['Diameter (km)']}km`)}
                {this.getFieldValue('Coordinates', `${m['Lat.']} ${m['Long.']}`)}
              </Col>
              <Col md={4}>
                <div>Chemical Composition: {this.getChemicalComposition(m)}</div>
              </Col>
            </Row>
          </Card.Text>
        </Card.Body>
      </Card>
    )
  }

  getQuadrante(lat, lon) {
    if (lat.indexOf('N') > -1) {
      if (lon.indexOf('E') > -1) {
        return 'NE'
      } else {
        return 'NW'
      }
    } else {
      if (lon.indexOf('E') > -1) {
        return 'SE'
      } else {
        return 'SW'
      }
    }
  }

  getLatNumber(lat) {
    return lat.replace('°', '').substr(0, lat.indexOf(' '))
  }

  getLonNumber(lon) {
    return lon.replace('°', '').substr(0, lon.indexOf(' '))
  }

  isInsideCircle(a, b, x, y, r) {
    var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
    r *= r;
    if (dist_points < r) {
      return true;
    }
    return false;
  }

  whereAmI(lat, lon) {
    const quadrant = this.getQuadrante(lat, lon)
    const arrGeneral = themaria.concat(lacus, sinusAndPaludes, craters)
    const arrFiltered = arrGeneral.filter(a => a.Quadrant === quadrant)
    const lat1 = this.getLatNumber(lat)
    const lon1 = this.getLonNumber(lon)
    return arrFiltered.filter(a => this.isInsideCircle(lat1, lon1, a.Lat, a.Lon, a.Diameter))
  }

  setStateAndGo(Lat, Lon) {
    const me = this

    this.setState({ loading: true, Lat, Lon }, () => {
      setTimeout(() => {
        me.setState({ loading: false, places: me.whereAmI(me.state.Lat, me.state.Lon).map(m => me.getJSXArea(m)) })

      }, 1000);
    })
  }

  getAbout() {
    return <About />
  }

  getHome() {
    const me = this
    function getButton(name, lat, lon) {
      return <Col><Button variant="primary" size="sm" onClick={() => me.setStateAndGo(lat, lon)}>{name}</Button></Col>
    }
    return (
      <div>
        <Row>
          <Col md={9}>
            <h4 htmlFor="basic-url">Calibrate our direction:</h4>
            <label htmlFor="basic-url">Specific Areas</label>
            <Row>
              {getButton('Mare Vaporum', "13.3° N", "3.6° E")}
              {/* {getButton('Lacus Excellentiae', "35.4° S", "44.0° W")} */}
              {getButton('Sinus Roris', "54.0° N", "56.6° W")}
              {/* {getButton('Crater Atlas', "46.74° N", "44.38° E")} */}
              {getButton('Crater Arnold', "66.98° N", "35.83° E")}
              {getButton('Sinus Successus', "0.9° N", "59.0° E")}
            </Row>
            <label htmlFor="basic-url">Coordinates</label>
            <Row>
              <Col md={3}>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">
                      Latitude
              </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl id="basic-url" aria-describedby="basic-addon3" value={this.state.Lat} onChange={(e) => { this.setState({ Lat: e.target.value }) }} />
                </InputGroup>
              </Col>
              <Col md={3}>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon2">
                      Longitude
              </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl id="basic-url" aria-describedby="basic-addon3" value={this.state.Lon} onChange={(e) => { this.setState({ Lon: e.target.value }) }} />
                </InputGroup>
              </Col>
              <Col md={3}>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon2">
                      Time
              </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl id="basic-url" aria-describedby="basic-addon3" value={this.state.time} onChange={(e) => { this.setState({ time: e.target.value }, () => console.log(this.state.time)) }} />
                </InputGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="dark" size="lg" onClick={
              () => {
                const me = this
                if (
                  (
                    this.state.Lat.indexOf(' N') > -1 ||
                    this.state.Lat.indexOf(' S') > -1
                  ) &&
                  (
                    this.state.Lon.indexOf(' E') > -1 ||
                    this.state.Lon.indexOf(' W') > -1
                  )
                ) {
                  this.setState({ loading: true }, () => {
                    setTimeout(() => {
                      me.setState({ loading: false, places: this.whereAmI(this.state.Lat, this.state.Lon).map(m => this.getJSXArea(m)) })
                    }, 1000);
                  })
                }
              }
            }>Land!</Button>
          </Col>
        </Row>

      </div>
    )
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
          <h1 style={{ marginTop: '10px', marginBottom: '15px' }}><Image src={moonLoading} fluid /> Si<b>moon</b>lation</h1>
          </Col>
        </Row>      

        <Button variant="outline-primary" onClick={(e) => { e.preventDefault(); this.setState({ isHome: true }) }}>Home</Button>
        <Button variant="outline-primary" onClick={(e) => { e.preventDefault(); this.setState({ isHome: false }) }}>About</Button>

        <div style={{ marginTop: '10px' }}>
          {this.state.isHome ? this.getHome() : this.getAbout()}
        </div>

        <Row>
          <Col md={12} style={this.state.loading ? { textAlign: 'center' } : { textAlign: 'left' }}>
            <br />


            {this.state.loading ? <Spinner animation="grow" /> : (this.state.places && this.state.isHome && this.state.places.length > 0 ?
              <div><h6>Landed on:</h6>{this.state.places}</div>
            : this.state.isHome && <p>Area not mapped</p>)}
          </Col>
        </Row>

      </Container>
    );
  }
}