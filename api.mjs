//Consultas a servicios externos. Editar como sea necesario

import axios from "axios";
const urlProductov2 = "http://localhost:5001/v2"

//untested
export const reviewBetweenUsers = async (id1, id2) => {
  const response = await axios.get(`${urlProductov2}/${id1}/${id2}`);
  return response.data;
};
