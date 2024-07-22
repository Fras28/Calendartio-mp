
import React, { useState } from 'react';
import NuevaReserva from './NuevaReserva'; // Importa el componente de NuevaReserva aquí
import { Checkbox, Radio, RadioGroup } from '@chakra-ui/react';
import maia from "./assets/maia.png"
import fondo from "./assets/bgCard.jpg"


const API_URL = process.env.REACT_APP_API_URL;
const COMERCIO_ID = process.env.REACT_APP_COMERCIO_ID;

const Card = ({ prestador, idPrestador }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const cardRef = useRef(null);

  const name = prestador?.nombre;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePriceChange = (value) => {
    setSelectedPrice(value);
  };

  const handleClickOutside = (event) => {
    if (cardRef.current && !cardRef.current.contains(event.target)) {
      setIsFlipped(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (

    <div className="card">
      <div className="card__img">
        {/* <img src={`${API_URL}${prestador?.fondoPerfil.data.attributes.url}`} alt="Card Image" /> */}
        <img src={fondo} alt="Card Image" />
      </div>
      <div className="card__avatar">
        {/* <img src={`${API_URL}${prestador?.avatar.data.attributes.url}`} alt="Avatar" /> */}
        <img src={maia} alt="Avatar" />
      </div>
      <div className="card__title titMai">{prestador?.nombre}</div>
      <div className="card__subtitle">{prestador?.servicio?.length > 3 ? prestador?.servicio : null}</div>
      <div className="card__prices">
        <RadioGroup onChange={handlePriceChange} value={selectedPrice}>
          {prestador?.valors.data.map(valor => (
            <div key={valor.id}  style={{color:"wheat", borderBottom:"dashed 1px wheat", padding:"4px"}} className='titMai'>
              <Radio value={JSON.stringify(valor.attributes)} ><b>{valor.attributes.nombre} <br/> </b>  ${valor.attributes.precio} {valor.attributes.tiempo? <div><b>duración:</b> valor.attributes.tiempo'</div> :null}</Radio>
            </div>
          ))}
        </RadioGroup>

 
      </div>
      <div className="card__back">
        <NuevaReserva
          prestador={{ idPrestador, name }}
          precio={selectedPrice}
        />
      </div>
    </div>
  );
};

export default Card;
