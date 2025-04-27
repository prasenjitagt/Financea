//lib/helpers/create_invoice/fetchClients.ts

import { Client } from "@/components/invoices/create_invoice_form";
import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { clients_route } from "../api-endpoints";



export const fetchClients = async (setClients: Dispatch<SetStateAction<Client[]>>) => {

    try {
        const res = await axios.get(clients_route);
        setClients(res.data);
    } catch (error) {
        console.error("Error fetching clients:", error);
    }

};

