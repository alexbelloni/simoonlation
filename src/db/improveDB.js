const MariaAndOceanus = require('./MariaAndOceanus-original.json')
const Lacus = require('./Lacus-original.json')
const SinusAndPaludes = require('./SinusAndPaludes-original.json')
const Craters = require('./Craters-original.json')

function getQuadrante(lat, lon) {
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

function getDiameterToDegrees(diam) {
    return diam / 111
}

function getLatNumber(lat) {
    return lat.substr(0, lat.indexOf('°'))
}

function getLonNumber(lon) {
    return lon.substr(0, lon.indexOf('°'))
}

function recreateDB(){
    const fs = require('fs')
    let arr = []
    MariaAndOceanus.forEach(e => {
        arr.push({
            ...e, Area:'maria', Quadrant: getQuadrante(e['Lat.'], e['Long.']), Lat: getLatNumber(e['Lat.']), Lon: getLonNumber(e['Long.']), Diameter: getDiameterToDegrees(e["Diameter (km)"]),
            RegolithThickness:getThickness(e['Latin Name'], 'maria'),
            Age:getAge(e['Latin Name'])
        })
    });
    fs.writeFileSync('./MariaAndOceanus.json', JSON.stringify(arr))
    
    // arr = []
    // Lacus.forEach(e => {
    //     arr.push({
    //         ...e, Area:'lacus', Quadrant: getQuadrante(e['Lat.'], e['Long.']), Lat: getLatNumber(e['Lat.']), Lon: getLonNumber(e['Long.']), Diameter: getDiameterToDegrees(e["Diameter (km)"])
    //     })
    // });
    // fs.writeFileSync('./Lacus.json', JSON.stringify(arr))
    
    arr = []
    SinusAndPaludes.forEach(e => {
        arr.push({
            ...e, Area:'sinus', Quadrant: getQuadrante(e['Lat.'], e['Long.']), Lat: getLatNumber(e['Lat.']), Lon: getLonNumber(e['Long.']), Diameter: getDiameterToDegrees(e["Diameter (km)"]),
            RegolithThickness:getThickness(e['Latin Name'], 'sinus'),
            Age:getAge(e['Latin Name'])
        })
    });
    fs.writeFileSync('./SinusAndPaludes.json', JSON.stringify(arr))
    
    // arr = []
    // Craters.forEach(e => {
    //     const coords = e['Coordinates'].split(' ')//"10.21°N 64.01°E",
    //     const Lat = coords[0].replace('°', '° ')
    //     const Lon = coords[1].replace('°', '° ')
    //     arr.push({
    //         Area:"crater",
    //         "Latin Name": e.Crater,
    //         "English Name": e.Crater,
    //         "Lat.": Lat,
    //         "Long.": Lon,
    //         "Diameter (km)": e.Diameter,
    //         Diameter: getDiameterToDegrees(e["Diameter"]),
    //         "Quadrant": getQuadrante(Lat, Lon),
    //         "Lat": getLatNumber(Lat),
    //         "Lon": getLonNumber(Lon)
    //     })
    // });
    // fs.writeFileSync('./Craters.json', JSON.stringify(arr))
}

//thickness
const regolith_thickness = require('./regolith_thickness.json')
function getThickness(latinName, areaType){
    const AverageMare = {
        "Area": "Average mare",
        "A": 5.2,
        "B": 5.3,
        "C": 5.1
      }
      const AverageHighland = {
        "Area": "Average highland",
        "A": 11,
        "B": 10.7,
        "C": 10.6
      }

    const thickness = regolith_thickness.filter(m=>m["Area"].trim() === latinName)
    return thickness.length > 0 ? thickness[0] : (areaType === 'maria' ? AverageMare : '')
}

const ages = require('./Ages.json')
function getAge(latinName){
    const age = ages.filter(m=>m["area"].trim() === latinName)
    return age.length > 0 ? age[0]["age in billion years ago"] : ''
}
recreateDB()

