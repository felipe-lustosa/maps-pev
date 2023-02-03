import { Modal } from '@mui/material';
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai';

// const inputStyle = 'border border-gray-400 rounded shadow px-2 py-1 focus:outline-none text-lg'

const style = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 border shadow p-1 bg-white focus:outline-none"


const ModalTable = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <div className={style}>
        <div className='absolute top-4 right-8 cursor-pointer hover:bg-gray-300 rounded-full px-2 py-2 shadow' onClick={handleClose}>
          <AiOutlineClose size={24} />
        </div>
        <div className='flex flex-col gap-4 items-center px-8 py-4 max-h-[calc(80vh)] overflow-y-scroll'>
          <div className='border-b border-gray-500'>
            <h3 className='text-3xl font-semibold tracking-wide'>Tabela de CO2</h3>
          </div>

        </div>
      </div>
    </Modal>
  )
}

export default ModalTable