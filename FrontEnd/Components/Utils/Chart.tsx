import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {useMediaQuery} from "@mui/material";
import charts from "./Admin/Charts";
import {getLastweek} from "../../Helpers/getDate";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
interface IChart {
    chart: number[]
}
export const options = {
    responsive: true,
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            grid: {
                display: false
            },
        },
    },

};

const labels = [getLastweek(0) , getLastweek(1) , getLastweek(2) , getLastweek(3) , getLastweek(4), getLastweek(5),  getLastweek(6)];
const ChartBar : React.FC<IChart> = ({chart}) => {
    const  isMobile = useMediaQuery('(max-width: 600px)');

    const data = {
        labels,
        datasets: [
            {
                label: 'Sales',
                data: chart,
                barPercentage:1,
                categoryPercentage: 0.5,
                backgroundColor: '#60AA45',
                pointBorderWidth: 1,
                borderRadius: 50,
                barThickness : isMobile ? 13 : 20,
                pointHoverRadius: 5,

            }
        ],

    };


    return <Bar options={options} data={data} />;
}

export default ChartBar;