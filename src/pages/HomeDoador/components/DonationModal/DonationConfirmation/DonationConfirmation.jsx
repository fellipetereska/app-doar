import React from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import goodwillDonationGif from "../../goodwill-donation.gif";

const DonationConfirmation = ({ isOpen, onClose, companyName }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmação de Doação"
      className="bg-white p-6 rounded-lg max-w-md w-full mx-4 sm:mx-auto relative shadow-lg z-[1003] outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]"
      appElement={document.getElementById("root")}
      closeTimeoutMS={200}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-center"
      >
        <div className="mx-auto mb-4">
          <img
            src={goodwillDonationGif}
            alt="Confirmação de doação"
            className="h-32 mx-auto rounded-lg"
          />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4"
        >
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-green-600 mb-2"
        >
          Obrigado pela sua doação!
        </motion.h2>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 space-y-2"
        >
          <p className="text-gray-700">
            Sua solicitação de doação para <span className="font-semibold">{companyName}</span>{" "}
            foi confirmada.
          </p>
          <p className="text-gray-600 text-sm">
            Você receberá uma mensgem no Whatsapp quando for confirmada.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <button
            onClick={onClose}
            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm transition-colors duration-200"
          >
            Fechar
          </button>
        </motion.div>
      </motion.div>
    </Modal>
  );
};

export default DonationConfirmation;