import {useEffect, useState} from 'react';
import {Dialog, Button, CircularProgress} from '@mui/material';
import './styles.scss';
import api from '../../api';

const outsideEuropeVatPercentage = 0;

function Invoice({
    serviceName,
    servicePrice,
    providerName,
    providerCountry,
    isProviderVatPayer,
    clientName,
    clientCountry,
    isClientVatPayer,
    onClose,
}) {
    const [providerVat, setProviderVat] = useState(null);
    const [clientVat, setClientVat] = useState(null);

    useEffect(() => {
        api.getEuropeanCountryVat(providerCountry.code)
            .then((res) => {
                const rate = res.data.rates.find((rate) => rate.name === 'Standard');
                setProviderVat(rate.rates[0]);
            })
            .catch(() => setProviderVat(outsideEuropeVatPercentage));

        api.getEuropeanCountryVat(clientCountry.code)
            .then((res) => {
                const rate = res.data.rates.find((rate) => rate.name === 'Standard');
                setClientVat(rate.rates[0]);
            })
            .catch(() => setClientVat(outsideEuropeVatPercentage));
    }, [providerCountry, clientCountry]);

    const determineApplicableVat = () => {
        if (!isProviderVatPayer) {
            return 0;
        } else if (
            clientVat === outsideEuropeVatPercentage ||
            providerVat === outsideEuropeVatPercentage
        ) {
            return 0;
        } else if (clientCountry === providerCountry) {
            return clientVat;
        } else if (isClientVatPayer) {
            return 0;
        } else return clientVat;
    };

    const vatPercentage = determineApplicableVat();
    const servicePriceFloat = parseFloat(servicePrice);
    const vatAmount = (servicePriceFloat * (vatPercentage / 100)).toFixed(2);
    const totalCost = (servicePriceFloat + parseFloat(vatAmount)).toFixed(2);

    return (
        <Dialog open={true}>
            <div className="invoice-dialog">
                {providerVat === null || clientVat === null ? (
                    <CircularProgress />
                ) : (
                    <>
                        <div className="invoice-dialog__header">
                            <div>
                                <p>
                                    <strong>{providerName}</strong>
                                </p>
                                <p>{providerCountry.name}</p>
                            </div>
                            <div>
                                <p>Billed to:</p>
                                <p>
                                    <strong>{clientName}</strong>
                                </p>
                                <p>{clientCountry.name}</p>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Service price</th>
                                    <th>VAT({vatPercentage}%)</th>
                                    <th>Total price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{serviceName}</td>
                                    <td>{servicePriceFloat}</td>
                                    <td>{vatAmount}</td>
                                    <td>{totalCost}</td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
            </div>
            <Button variant="text" onClick={onClose}>
                Close
            </Button>
        </Dialog>
    );
}

export default Invoice;
