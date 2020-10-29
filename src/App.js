import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import './App.css'
import Box from './components/Box'
import LineGraph from './components/LineGraph'
import Map from './components/Map'
import Table from './components/Table'
import { sortData, prettyPrintStat } from './util'
import numeral from 'numeral'
import 'leaflet/dist/leaflet.css'

function App () {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [casesType, setCasesType] = useState('cases')
  const [mapCenter, setMapCenter] = useState([20, 77])
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data)
      })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      fetch('https://disease.sh/v3/covid-19/countries')
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          }))
          const sortedData = sortData(data)
          setCountries(countries)
          setTableData(sortedData)
          setMapCountries(data)
        })
    }

    getCountriesData()
  }, [])

  const onCountryChange = async event => {
    const countryCode = event.target.value

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode)
        setCountryInfo(data)
        if (countryCode === 'worldwide') {
          setMapCenter([20, 77])
          setMapZoom(3)
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long])
          setMapZoom(4)
        }
      })
  }

  return (
    <div>
      <div className='app'>
        <div className='app__left'>
          <div className='app__header'>
            <h1>COVID19 TRACKER</h1>
            <FormControl className='app__dropdown'>
              <Select
                variant='outlined'
                value={country}
                onChange={onCountryChange}
              >
                <MenuItem value='worldwide'>Worldwide</MenuItem>
                {countries.map((country, index) => (
                  <MenuItem key={index} value={country.value}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className='app__stats'>
            <Box
              onClick={e => setCasesType('cases')}
              title='Coronavirus Cases'
              isRed
              active={casesType === 'cases'}
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format('0.0a')}
            />
            <Box
              onClick={e => setCasesType('recovered')}
              title='Recovered'
              active={casesType === 'recovered'}
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={numeral(countryInfo.recovered).format('0.0a')}
            />
            <Box
              onClick={e => setCasesType('deaths')}
              title='Deaths'
              isRed
              active={casesType === 'deaths'}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={numeral(countryInfo.deaths).format('0.0a')}
            />
          </div>

          <Map
            center={mapCenter}
            zoom={mapZoom}
            countries={mapCountries}
            casesType={casesType}
          />
        </div>
        <Card className='app__right'>
          <CardContent>
            <h3>Live cases</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </CardContent>
        </Card>
      </div>
      <div className='footer'>
        <div className='footer__link'>
          ⭐{' '}
          <a href='https://github.com/ravivarshney01/covid19-tracker'>
            on github
          </a>
        </div>
        <div className='footer__text'>
          Made with<span className='heart'> ❤️ </span>by{' '}
          <a href='https://github.com/ravivarshney01'>Ravi</a>
        </div>
      </div>
    </div>
  )
}

export default App
