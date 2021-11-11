import axios from 'axios';

const api = {
    getAllCountries: () =>
        axios.get('http://api.countrylayer.com/v2/all', {
            params: {access_key: 'd30ca1aa48e672c9407e1457bd6c520e'}
        }),
    getEuropeanCountryVat: (countryCode) =>
        axios.get(`http://api.vatlookup.eu/rates/${countryCode}`)
}

export default api;
