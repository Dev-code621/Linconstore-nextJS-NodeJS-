import axios from "axios";
export const key = 'c80ae48d-1edf-45fd-8914-f50f0567b7d9';
export const  ExchangeCurrency :  {value: string, label: string}[] =  [{
        value: 'USD',
        label: 'usd',
    },
    {
        value: 'EUR',
        label: 'eur',
    },
    {
        value: 'Pounds',
        label: 'gbp',
    }]
export const handleRateChange = async (value : string) : Promise<number> => {
    const rateChange :  {value: string, label: string} = ExchangeCurrency.find(rate => rate.value === value )
    const label =  rateChange.label;
    if (label === 'usd') return 1
    const response = await axios.get(`https://api.striperates.com/rates/${label}`, {
        headers : {
            'x-api-key' : key
        }
    });
    const data = response.data;
    const usd  : number =  data.data[0].rates.usd;
      return  Number(usd.toFixed(2))
}