import React from 'react'

const DustManager = () => {
    //{descr,value}
    function getTemperature(place, time) {
        //When sunlight hits the moon's surface, the temperature can reach 260 degrees Fahrenheit (127 degrees Celsius)
        //When the sun goes down, temperatures can dip to minus 280 F (minus 173 C)
        //the lunar poles that never see daylight.
        //minus 396 F (minus 238 C) in craters at the southern pole and minus 413 F (minus 247 C) in a crater at the northern pole.
        const floatLat = parseFloat(place.Lat)
        if (place.Area === 'crater') {
            if (floatLat >= 60) {
                if (place.Quadrant.indexOf('S') > -1) {
                    return { descr: '-396.F -238.C', value: -238 }
                }
                if (place.Quadrant.indexOf('N') > -1) {
                    return { descr: '-413.F -247.C', value: -247 }
                }
            }
        }

/**
 * Temperatures between noon and
midnight at the equator vary ∼290 K while at 85° latitude, the
temperature variation is reduced to ∼120 K.
 */
        if (floatLat >=80 && floatLat <= 90) {
            if(time >= 12 && time < 24) return { descr: '-153.15.C', value: -153 }
        }

                /**
         * Daytime temperatures near the lunar equator reach a boiling
    250 degrees Fahrenheit (120° C, 400 K), while nighttime
    temperatures get to a chilly -208 degrees Fahrenheit
    (-130° C, 140 K). 
         */
        if (floatLat <= 10) {
            if(time >= 12 && time < 24) return { descr: '17.C', value: 17 }
            if(time >= 6 && time <= 7) return { descr: '-123.15', value: -123 }
            if (isDaytime(time)) {
                return { descr: '250.F 120.C', value: 120 }
            } else {
                return { descr: '-208.F -130.C', value: -130 }
            }
        }
        return { descr: '?' }
    }

    function isDaytime(time) {
        if (time >= 8 && time <= 18) return true
        if (time > 18 || time < 8) return false
    }

    /**
     *a hhi: the mean regolith layer thickness. 
     b σh : its standard deviation. 
     c S: the abundance of FeO + TiO2, (Shkuratov et al. 1999a)
     return: {alert,descr}
     */
    function getRegolithThicknessClassification(m) {
        const thickness = m['RegolithThickness']
        if (!thickness) return { alert: -1, descr: '' }
        const thicknessDescr = `${thickness.A}m`//`${thickness.A} / ${thickness.B} / ${thickness.C}`
        if (thickness.A <= 4.1) return { alert: 0, descr: thicknessDescr}//: thin regolith layer` }
        if (thickness.A >= 7) return { alert: 2, descr: thicknessDescr}//: thickest regolith layer` }
        return { alert: 1, descr: thicknessDescr }
    }

    function hasParticlesLevitating(m, time) {
        //it's cold (no frozen), it has sunlight
        if(isDaytime(time) && getRegolithThicknessClassification(m).alert > 0){
            //temperature?
            return true
        }
        return false
    }

    return {
        getTemperature,
        isDaytime,
        getRegolithThicknessClassification,
        hasParticlesLevitating
    }
}

export default DustManager()
