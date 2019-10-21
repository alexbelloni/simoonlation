import React from 'react'
import { FormControl, InputGroup } from 'react-bootstrap';
import themaria from './db/MariaAndOceanus.json'
import lacus from './db/Lacus.json'
import sinusAndPaludes from './db/SinusAndPaludes.json'
import craters from './db/Craters.json'

class SearchMore extends React.PureComponent {
    state = { name: '', names: [] }
    general = themaria.concat(lacus, sinusAndPaludes, craters)

    render() {
        return (
            <div>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">
                            Name
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl id="basic-url" aria-describedby="basic-addon3"
                    placeholder="Enter the area here"
                        value={this.state.name}
                        onChange={(e) => {
                            this.setState({ name: e.target.value }, () => {
                                const filtered = this.general.filter(p => p['Latin Name'].toLowerCase().indexOf(this.state.name.toLowerCase()) > -1)
                                this.setState({ names: filtered })
                            })
                        }
                        }
                    />
                </InputGroup>
                {this.state.names.map((d,i) =>
                    <div key={i}>
                        <a href='#' onClick={(e) => {
                            e.preventDefault()
                            this.props.onClick(d['Lat.'], d['Long.'])
                        }}>{d['Latin Name']}</a>
                    </div>
                )}
            </div>
        )
    }

}

export default SearchMore