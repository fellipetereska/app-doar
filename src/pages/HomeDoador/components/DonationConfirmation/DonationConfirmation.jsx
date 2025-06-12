import React from "react";
import Modal from "react-modal";
import goodwillDonationGif from "../goodwill-donation.gif"; 

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
      <div className="text-center">
        <div className="mx-auto mb-4">
          <img
            src={goodwillDonationGif}
            alt="Confirmação de doação"
            className="h-32 mx-auto"
          />
        </div>

        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
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
        </div>

        <h2 className="text-xl font-bold text-green-600 mb-2">
          Obrigado pela sua doação!
        </h2>

        <div className="mt-4 space-y-2">
          <p className="text-gray-700">
            Sua doação para <span className="font-semibold">{companyName}</span>{" "}
            foi confirmada.
          </p>
          <p className="text-gray-600 text-sm">
            A instituição irá avaliar sua doação e poderá aceitá-la ou
            recusá-la, conforme a necessidade atual.{" "}
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DonationConfirmation;
