import React, { useState } from 'react';
import Modal from 'react-modal';
import { FiX, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import DonationStep1 from './DonationStep1';
import DonationStep2 from './DonationStep2';
import DonationStep3 from './DonationStep3';
import useDonation  from '../hooks/useDonation';
import {useModal} from '../hooks/useModal';

const DonationModal = () => {
  const { selectedCompany, resetDonationFlow } = useDonation();
  const { isDonationModalOpen, closeDonationModal } = useModal();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    closeDonationModal();
    resetDonationFlow();
    setCurrentStep(1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DonationStep1 nextStep={nextStep} />;
      case 2:
        return <DonationStep2 nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <DonationStep3 prevStep={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isDonationModalOpen}
      onRequestClose={handleClose}
      contentLabel="Realizar Doação"
      className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4 sm:mx-auto relative shadow-lg z-[1003] outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]"
      appElement={document.getElementById("root")}
      closeTimeoutMS={200}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Doação para {selectedCompany?.name}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex items-center justify-center mb-6">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <React.Fragment key={step}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                } font-medium`}
              >
                {step}
              </div>
              {step < totalSteps && (
                <div
                  className={`w-16 h-1 ${
                    currentStep > step ? "bg-green-600" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {renderStep()}
      </div>
    </Modal>
  );
};

export default DonationModal;