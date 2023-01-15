import axios from "axios";

export const api = axios.create({
  headers: {
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  baseURL: "https://plataforma.seeg.eco.br",
});

export const getTotalEmissions = (year) => {
  return api.get("/map/emissions_info?sector=all&year=" + year + "&gas=6&cities=false");
};

export const getStateEmissions = (state, year) => {
  console.log(state)
  return api.get("/territories/" + state + "/popup_chart?sector=all&year=" + year + "&gas=6");
};
