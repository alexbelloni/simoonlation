import React from 'react';
import { Container, Fade, Row, Col, Spinner, InputGroup, FormControl, Button, Card, Badge } from 'react-bootstrap';
import './Home.css'
import themaria from './db/MariaAndOceanus.json'
import lacus from './db/Lacus.json'
import sinusAndPaludes from './db/SinusAndPaludes.json'
import craters from './db/Craters.json'
import composition from './db/SurfaceComposition.json'

export default class Home extends React.Component {
  state = { Lat: '9.9° S', Lon: '85° W', places: '' }
  constructor(props) {
    super(props);
  }

  //{descr,alert}
  getRegolithThicknessClassification(thickness) {
    if (!thickness) return { alert: -1, descr: '' }
    const thicknessDescr = `${thickness.A} / ${thickness.B} / ${thickness.C}`
    if (thickness.A <= 4.1) return { alert: 0, descr: `${thicknessDescr}: thin regolith layer` }
    if (thickness.A >= 7) return { alert: 2, descr: `${thicknessDescr}: thickest regolith layer` }
    return { alert: 1, descr: thicknessDescr }
  }

  getJSXArea(m) {
    const thickness = this.getRegolithThicknessClassification(m['RegolithThickness'])
    let badge = <Badge variant="warning">Warning</Badge>
    switch (thickness.alert) {
      case 0:
        badge = <Badge variant="success">Success</Badge>
        break
      case 2:
        badge = <Badge variant="danger">Danger</Badge>
        break
    }
    return (
      <Card key={m['Latin Name']} bg="light">
        <Card.Header><b>{m['Latin Name']}</b></Card.Header>
        <Card.Body>
          <Card.Text>
            <div>{m['English Name']} . Diameter(km): {m['Diameter (km)']}<span>{m['Age'] && ` Age: ${m['Age']} billion years ago`}</span></div>
            <div>Coordinates: {m['Lat.']} {m['Long.']}</div>
            {badge}
            <div>Temperature: {this.getTemperature(m).descr}</div>
            <div>Composition: {composition.Maria.map(c => <div className='small'>{`${c.Compound} - ${c.Formula} - ${c.Composition}`}</div>)}</div>
          </Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">Thickness: {thickness.descr}</Card.Footer>
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

  check_a_point(a, b, x, y, r) {
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
    return arrFiltered.filter(a => this.check_a_point(lat1, lon1, a.Lat, a.Lon, a.Diameter))
  }

  setStateAndGo(Lat, Lon) {
    const me = this
    this.setState({ Lat, Lon }, () => me.setState({
      places: me.whereAmI(this.state.Lat, this.state.Lon).map(m => me.getJSXArea(m))
    }))
  }

  //{descr,value}
getTemperature(place, time){
  //When sunlight hits the moon's surface, the temperature can reach 260 degrees Fahrenheit (127 degrees Celsius)
  //When the sun goes down, temperatures can dip to minus 280 F (minus 173 C)
  //the lunar poles that never see daylight.
  //minus 396 F (minus 238 C) in craters at the southern pole and minus 413 F (minus 247 C) in a crater at the northern pole.
  if(place.Area === 'crater'){
    if(parseFloat(place.Lat) >= 60){
      if(place.Quadrant.indexOf('S')>-1){
        return {descr:'-396.F -238.C'}
      }
      if(place.Quadrant.indexOf('N')>-1){
        return {descr:'-413.F -247.C'}
      }
    } 
  }
  return {descr:'?'}
}

getAbout(){
return (
  <div>
  <label htmlFor="basic-url">About our Data:</label>
  <Row>
    <Col>
      <p>Quantity of Maria: {themaria.length}</p>
      <p>Quantity of Lacus: {lacus.length}</p>
      <p>Quantity of Sinus: {sinusAndPaludes.length}</p>
      <p>Quantity of Craters: {craters.length}</p>
      <br/>
      <p>Coordinates, composition and thickness of the moon areas, and temperatures</p>
    </Col>
  </Row>  
  </div>
)
}

  render() {
    return (
      <Container>
        <h1>Si<b>moon</b>lation</h1>
        <Row>
          <Col md={9}>
            <h4 htmlFor="basic-url">Calibrate our direction:</h4>
            <label htmlFor="basic-url">Specific Areas</label>
            <Row>
              <Col md={2}><Button variant="primary" onClick={() => this.setStateAndGo("13.3° N", "3.6° E")}>Mare Vaporum</Button></Col>
              <Col md={2}><Button variant="primary" onClick={() => this.setStateAndGo("35.4° S", "44.0° W")}>Lacus Excellentiae</Button></Col>
              <Col md={2}><Button variant="primary" onClick={() => this.setStateAndGo("54.0° N", "56.6° W")}>Sinus Roris</Button></Col>
              <Col md={2}><Button variant="primary" onClick={() => this.setStateAndGo("46.74° N", "44.38° E")}>Crater Atlas</Button></Col>
              <Col md={2}><Button variant="primary" onClick={() => this.setStateAndGo("66.98° N","35.83° E")}>Crater Arnold</Button></Col>
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
            </Row>
            <Row>
              <Col md={3}>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon2">
                      Time
              </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl id="basic-url" aria-describedby="basic-addon3" />
                </InputGroup>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
           {this.getAbout()}
          </Col>
        </Row>

        <Row>
          <Col>
            <Button variant="dark" onClick={
              () => {
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
                  this.setState({
                    places: <div><h6>Landed on:</h6>{this.whereAmI(this.state.Lat, this.state.Lon).map(m => this.getJSXArea(m))}</div>
                  })
                }
              }
            }>Land!</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
            {
              this.state.places
            }
          </Col>
        </Row>
      </Container>
    );
  }
}