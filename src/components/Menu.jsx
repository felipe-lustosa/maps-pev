import React from 'react'
import { motion } from 'framer-motion'
import Calculator from './menuModals/Calculator'

const menuTabs = ['Calculadora', 'Tabela', 'Sobre']

const Menu = ({ }) => {
  return (
    <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded shadow flex gap-2">
      {menuTabs.map((tab) => {
        return <div className="cursor-pointer h-full p-3 hover:bg-gray-700 hover:text-white">
          <h3>{tab}</h3>
        </div>
      })}

    </motion.div>
  )
}

export default Menu