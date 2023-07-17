import {stepperStore} from './Stepper';
import {configureStore} from '@reduxjs/toolkit'
import store from './Modal';
import util from "./Utils";
import  auth from  "./Auth"
import currency from "./Currency";
import payout from "./Payout";
const Store = configureStore({
    reducer: {stepper: stepperStore, modal:store, util : util, auth : auth, currency: currency, payout: payout}
})
export  default Store;