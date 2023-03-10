import { GoogleMap, InfoWindow } from "@react-google-maps/api"
import axios from "axios";
import { useEffect, useState } from "react";
import { getStateEmissions, getTotalEmissions } from "./services/api";
import mapStyle from "./styles/mapStyle";
import ClipLoader from "react-spinners/ClipLoader";
import { PieChart } from "./components/PieChart";
import { IoMdMenu } from 'react-icons/io'
import { motion } from 'framer-motion'
import Menu from "./components/Menu";
import ModalAbout from "./components/menuModals/ModalAbout";
import ModalReferences from "./components/menuModals/ModalReferences";
import logoPev from "./assets/Logo-PEV_site.png"
import ModalWhatIs from "./components/menuModals/ModalWhatIs";
import ModalObjectives from "./components/menuModals/ModalObjectives";
import ModalCatalogSheet from "./components/menuModals/ModalCatalogSheet";

const initialMapCenter = { lat: -12.681795, lng: -51.034334 }

const containerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions = {
  scrollwheel: true,
  disableDefaultUI: true,
  minZoom: 2,
  styles: mapStyle,
};

function App() {
  const [mapZoom, setMapZoom] = useState(4.5);
  const [totalEmissions, setTotalEmissions] = useState(null)
  const [selectedYear, setSelectedYear] = useState(2021)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [stateEmissions, setStateEmissions] = useState(null)
  const [isLoadingTotal, setIsLoadingTotal] = useState(false)
  const [isLoadingState, setIsLoadingState] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [openModal, setOpenModal] = useState('')

  useEffect(() => {
    setIsLoadingTotal(true)
    getEmissionsInfo()
    getStateEmissionsInfo()
  }, [selectedYear])

  useEffect(() => {
    getStateEmissionsInfo()
  }, [selectedPlace])

  const getEmissionsInfo = async () => {
    await getTotalEmissions(selectedYear).then((response) => {
      setTotalEmissions({ country: response?.data?.allocated_in_country, state: response?.data?.biggest_state_emission })
    }).finally(() => setIsLoadingTotal(false))
  }

  const getStateEmissionsInfo = async () => {
    if (!!selectedPlace?.state && selectedPlace?.state != '') {
      setIsLoadingState(true)
      await getStateEmissions(selectedPlace?.state, selectedYear).then((response) => {
        const emissionsResponse = response?.data
        setStateEmissions({
          totalEmission: emissionsResponse?.total_allocated_emission,
          emissionTypes: emissionsResponse?.series
        })
      }).catch(() => { setStateEmissions(null) }).finally(() => setIsLoadingState(false))
    }
  }

  const handleMapClick = (e) => {
    var latlng = e.latLng
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        alert(status);
      }
      // This is checking to see if the Geoeode Status is OK before proceeding
      if (status == google.maps.GeocoderStatus.OK) {
        var address = (results[1]);
        var stateName = address?.address_components?.find(item => item.types[0] == 'administrative_area_level_1')?.long_name
        setSelectedPlace({
          stateName: stateName,
          state: stateName?.toLowerCase().replaceAll(/ /g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
          position: e.latLng
        })
      }
    });
  }

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute z-10 w-full flex flex-col items-center top-4 gap-4">
        <div className="w-fit flex px-2 py-2 bg-gray-700 text-white shadow rounded justify-center">
          <h2 className="font-semibold text-xl">
            Mapa de Emiss??es de CO2
          </h2>
        </div>
        {!!!selectedPlace ? <div className="bg-white rounded px-1 py-1">
          <h3 className="text-sm">Selecione um Estado brasileiro para ver as suas emiss??es</h3>
        </div> : null}
      </div>
      <div className="z-40">
        <ModalWhatIs open={openModal == 'O que ?? o CO2'} handleClose={() => setOpenModal('')} />
        <ModalObjectives open={openModal == 'Objetivos'} handleClose={() => setOpenModal('')} />
        <ModalAbout open={openModal == 'Sobre'} handleClose={() => setOpenModal('')} />
        <ModalCatalogSheet open={openModal == 'Ficha Catalogr??fica'} handleClose={() => setOpenModal('')} />
        <ModalReferences open={openModal == 'Fontes'} handleClose={() => setOpenModal('')} />
      </div>
      <div className="absolute top-4 left-4 z-10 space-y-6">
        {/* <div className="w-fit flex px-2 py-2 bg-gray-700 text-white shadow rounded justify-center">
          <h2 className="font-semibold text-xl">
            Mapa de Emiss??es de CO2
          </h2>
        </div> */}
        <div className="flex gap-4">
          <div className={"p-3 w-fit cursor-pointer rounded shadow z-10 hover:bg-gray-700 hover:text-white " + (openMenu ? "bg-gray-700 text-white" : "bg-white")} onClick={() => setOpenMenu(!openMenu)} >
            <IoMdMenu size={24} />
          </div>
          {openMenu && <Menu handleMenuClick={setOpenModal} />}
        </div>
        <div className="flex flex-col items-center bg-white shadow w-32 md:w-48 lg:w-64">
          <div className="w-full bg-gray-700 px-4 py-2 text-center">
            <h2 className="font-semibold text-white">EMISS??ES TOTAIS DE CO2</h2>
          </div>
          <div className="py-2">
            {isLoadingTotal ? <ClipLoader loading={isLoadingTotal} size={16} /> : <h3 className="font-semibold text-center">{totalEmissions?.country + " Toneladas"}</h3>}
          </div>
        </div>
        <div className="flex flex-col items-center bg-white shadow w-32 md:w-48 lg:w-64">
          <div className="w-full bg-gray-700 px-4 py-2 text-center">
            <h2 className="font-semibold text-white md:sm">ESTADO COM MAIS EMISS??ES</h2>
          </div>
          <div className="py-2">
            {isLoadingTotal ? <ClipLoader loading={isLoadingTotal} size={16} /> : <h3 className="font-semibold text-center">{totalEmissions?.state + " Toneladas"}</h3>}
          </div>
        </div>
        <div className="flex flex-col items-center bg-white shadow w-32 md:w-48 lg:w-64">
          <div className="w-full bg-gray-700 px-4 py-2 text-center">
            <h2 className="font-semibold text-white">ESCOLHER ANO DA EMISS??O</h2>
          </div>
          <div className="py-2">
            <select className="font-semibold text-center" type="select" value={selectedYear} onChange={(e) => setSelectedYear(e?.target?.value)}>
              {Array.from(Array(32), (e, i) => {
                return <option key={i}>{2021 - i}</option>
              })}
            </select>
          </div>
        </div>
        <div className="cursor-pointer">
          <a href="https://escolaverde.org/site/">
            <img src={logoPev} className="w-64" />
          </a>
        </div>
        <div className="flex flex-col items-center bg-white shadow w-32 md:w-48 lg:w-64">
          <div className="w-full bg-gray-700 px-4 py-2 text-center">
            <h2 className="font-semibold text-white">ISBN</h2>
          </div>
          <div className="py-2">
            <h3 className="font-semibold text-center">978-65-00-63620-8</h3>
          </div>
        </div>
      </div>
      <GoogleMap options={mapOptions} onClick={handleMapClick} mapContainerStyle={containerStyle} center={initialMapCenter} zoom={mapZoom}>
        {!!selectedPlace?.position && !!selectedPlace?.stateName ? <InfoWindow position={selectedPlace?.position}>
          <div className="overscroll-none overflow-hidden flex flex-col items-start truncate gap-2 pb-2 bg-white w-64">
            <h3 className="text-xl font-semibold">{selectedPlace?.stateName}</h3>
            {isLoadingState ? <div className="w-full flex justify-center"><ClipLoader loading={isLoadingState} size={36} /></div>
              : stateEmissions ? <div className="w-full flex flex-col items-center justify-center text-center">
                <h3 className="text-base font-medium">Total de emiss??es do estado: <br></br>{stateEmissions?.totalEmission} Toneladas</h3>
                <PieChart emissionsData={stateEmissions?.emissionTypes} />
              </div> : <h2 className="text-base font-medium break-all">Selecione um estado Brasileiro</h2>}
          </div>
        </InfoWindow> : null}
      </GoogleMap>
    </div>
  )
}

export default App
