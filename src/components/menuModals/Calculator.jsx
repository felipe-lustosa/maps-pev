import React from 'react'
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const modalIsOpen = true

const Calculator = () => {
  return (
    <Modal
      isOpen={modalIsOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={() => console.log('close')}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <h2>Hello</h2>
    </Modal>
  )
}

export default Calculator