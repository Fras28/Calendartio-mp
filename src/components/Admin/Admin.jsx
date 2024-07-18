import React from "react";

import Calendario from "./Calendario";
import { useSelector } from "react-redux";
import HorariosAdmin from "./HorariosAdmin";
import DisponibilidadPrestador from "./DisponibilidadPrestador";



const Admin = () =>{

    return(
        <div>
            <Calendario/>
            {/* <DisponibilidadPrestador/> */}
            <HorariosAdmin/>
        </div>
    )
}

export default Admin