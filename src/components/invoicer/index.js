import {useEffect, useState} from 'react';
import {TextField, Card, Checkbox, Divider, Button, MenuItem} from '@mui/material';
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import api from '../../api';
import './styles.scss';
import Invoice from '../invoice';

const initialFormState = {
    serviceName: '',
    servicePrice: '',
    providerName: '',
    providerCountry: '',
    isProviderVatPayer: true,
    clientName: '',
    clientCountry: '',
    isClientVatPayer: true,
};

const invoiceFormSchema = Yup.object().shape({
    serviceName: Yup.string().required('Service name is required'),
    servicePrice: Yup.string()
        .required('Service price is required')
        .matches(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/, 'Service price must be a number'),
    providerName: Yup.string().required('Provider name is required'),
    providerCountry: Yup.object().nullable().required('Provider country is required'),
    isProviderVatPayer: Yup.bool().required(),
    clientName: Yup.string().required('Client name is required'),
    clientCountry: Yup.object().nullable().required('Client country is required'),
    isClientVatPayer: Yup.bool().required(),
});

const backupCountriesArray = [
    {code: 'de', name: 'Denmark'},
    {code: 'lt', name: 'Lithuania'},
    {code: 'ru', name: 'Russia'},
];

function Invoicer() {
    const {
        control,
        handleSubmit: submitForm,
        reset: resetForm,
        getValues: getFormValues,
    } = useForm({
        resolver: yupResolver(invoiceFormSchema),
        defaultValues: initialFormState,
    });

    const [displayInvoice, setDisplayInvoice] = useState(false);

    const [countryChoices, setCountryChoices] = useState([{code: 'Loading', name: 'Loading...'}]);

    const onSubmit = () => {
        setDisplayInvoice(true);
    };

    const onClose = () => {
        setDisplayInvoice(false);
    };

    useEffect(() => {
        api.getAllCountries()
            .then((res) => {
                setCountryChoices(
                    res.data.map((choice) => ({code: choice.alpha2Code, name: choice.name}))
                );
            })
            .catch(() => setCountryChoices(backupCountriesArray));
    }, []);

    return (
        <Card
            component="form"
            onSubmit={submitForm(onSubmit)}
            className="invoicer"
            sx={{borderRadius: '20px'}}
        >
            {displayInvoice && <Invoice {...getFormValues()} onClose={onClose} />}
            <h2>Little Invoicer</h2>

            <Divider flexItem>
                <h3>Service</h3>
            </Divider>
            <Controller
                name="serviceName"
                control={control}
                render={({field, fieldState: {error}}) => (
                    <TextField
                        variant="filled"
                        label="Service name"
                        {...field}
                        error={!!error}
                        helperText={error ? error.message : ''}
                    />
                )}
            />
            <Controller
                name="servicePrice"
                control={control}
                render={({field, fieldState: {error}}) => (
                    <TextField
                        variant="filled"
                        label="Service price"
                        {...field}
                        error={!!error}
                        helperText={error ? error.message : ''}
                    />
                )}
            />

            <Divider flexItem>
                <h3>Provider</h3>
            </Divider>
            <Controller
                name="providerName"
                control={control}
                render={({field, fieldState: {error}}) => (
                    <TextField
                        variant="filled"
                        label="Provider name"
                        {...field}
                        error={!!error}
                        helperText={error ? error.message : ''}
                    />
                )}
            />
            <Controller
                name="providerCountry"
                control={control}
                render={({field, fieldState: {error}}) => (
                    <TextField
                        select
                        variant="filled"
                        label="Country"
                        {...field}
                        error={!!error}
                        helperText={error ? error.message : ''}
                    >
                        {countryChoices.map((choice) => (
                            <MenuItem value={choice} key={choice.code}>
                                {choice.name}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            />
            <div className="invoicer__checkbox">
                <Controller
                    name="isProviderVatPayer"
                    id="isProviderVatPayer"
                    control={control}
                    render={({field}) => (
                        <Checkbox
                            id="isProviderVatPayer"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                        />
                    )}
                />
                <label htmlFor="isProviderVatPayer">Provider is subject to VAT</label>
            </div>

            <Divider flexItem>
                <h3>Client</h3>
            </Divider>
            <Controller
                name="clientName"
                control={control}
                render={({field, fieldState: {error}}) => (
                    <TextField
                        variant="filled"
                        label="Client name"
                        {...field}
                        error={!!error}
                        helperText={error ? error.message : ''}
                    />
                )}
            />
            <Controller
                name="clientCountry"
                control={control}
                render={({field, fieldState: {error}}) => (
                    <TextField
                        select
                        variant="filled"
                        label="Country"
                        {...field}
                        error={!!error}
                        helperText={error ? error.message : ''}
                    >
                        {countryChoices.map((choice) => (
                            <MenuItem value={choice} key={choice.code}>
                                {choice.name}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            />
            <div className="invoicer__checkbox">
                <Controller
                    name="isClientVatPayer"
                    id="isClientVatPayer"
                    control={control}
                    render={({field}) => (
                        <Checkbox
                            id="isClientVatPayer"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                        />
                    )}
                />
                <label htmlFor="isClientVatPayer">Client is subject to VAT</label>
            </div>
            <div className="invoicer__button-row">
                <Button variant="outlined" onClick={() => resetForm(initialFormState)}>
                    Reset
                </Button>
                <Button variant="contained" type="submit">
                    Form Invoice
                </Button>
            </div>
        </Card>
    );
}

export default Invoicer;
