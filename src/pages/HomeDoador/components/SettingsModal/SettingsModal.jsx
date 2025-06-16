import React, { useState, useEffect, useRef } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaLock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBars,
  FaTimes as FaClose,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { connect } from "../../../../services/api";

const SettingsModal = ({ isOpen, onClose, userId }) => {

  const formatUserData = (userData) => {
    return {
      nome: userData?.nome || "",
      email: userData?.email || "",
      telefone: userData?.telefone || "",
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    };
  };

  const [formData, setFormData] = useState(formatUserData({}));
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    meetsLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isOpen || !userId) return;

      setIsLoading(true);
      try {
        const response = await fetch(`${connect}/usuario/${userId}`);

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const userData = await response.json();

        if (!userData) {
          throw new Error("Dados do usuário não encontrados");
        }

        setFormData(formatUserData(userData));
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        toast.error(error.message || "Erro ao carregar dados do usuário");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isOpen, userId]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(formatUserData({}));
      setErrors({});
      setActiveTab("info");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "novaSenha") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    const strength = {
      score: 0,
      meetsLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };

    strength.score = [
      strength.meetsLength,
      strength.hasUpper,
      strength.hasLower,
      strength.hasNumber,
      strength.hasSpecial,
    ].filter(Boolean).length;

    setPasswordStrength(strength);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nome) newErrors.nome = "Nome é obrigatório";
    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (formData.novaSenha) {
      if (!formData.senhaAtual) {
        newErrors.senhaAtual = "Senha atual é obrigatória para alterar a senha";
      }
      if (formData.novaSenha.length < 8) {
        newErrors.novaSenha = "Senha deve ter pelo menos 8 caracteres";
      }
      if (formData.novaSenha !== formData.confirmarSenha) {
        newErrors.confirmarSenha = "Senhas não coincidem";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const updateData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
      };

      if (formData.novaSenha) {
        updateData.senhaAtual = formData.senhaAtual;
        updateData.novaSenha = formData.novaSenha;
      }

      const response = await fetch(
        `${connect}/usuario/doador/${userId}?id=${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar usuário");
      }

      toast.success("Dados atualizados com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error(error.message || "Erro ao atualizar dados. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002] p-4"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col"
          style={{
            height: isMobile ? "90vh" : "auto",
            maxHeight: isMobile ? "90vh" : "90vh",
            minHeight: isMobile ? "auto" : "500px",
          }}
        >
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            {isMobile && (
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-white"
              >
                <FaBars />
              </button>
            )}

            <h2 className="text-xl font-bold flex-1 text-center md:text-left md:ml-4">
              Configurações
            </h2>

            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <FaClose className="text-xl" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            <div
              className={`${
                isMobile ? (showMobileMenu ? "flex" : "hidden") : "flex"
              } 
              md:flex w-full md:w-1/4 bg-primary p-4 md:p-6 text-white flex-col`}
            >
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("info");
                    if (isMobile) setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all ${
                    activeTab === "info"
                      ? "bg-white bg-opacity-20"
                      : "hover:bg-white hover:bg-opacity-10"
                  }`}
                >
                  <FaUser className="mr-3" />
                  Informações Pessoais
                </button>

                <button
                  onClick={() => {
                    setActiveTab("security");
                    if (isMobile) setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all ${
                    activeTab === "security"
                      ? "bg-white bg-opacity-20"
                      : "hover:bg-white hover:bg-opacity-10"
                  }`}
                >
                  <FaLock className="mr-3" />
                  Segurança
                </button>
              </nav>
            </div>

            <div className="w-full md:w-3/4 p-4 md:p-8 overflow-y-auto">
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : activeTab === "info" ? (
                  <motion.div
                    initial={{ opacity: 0, x: isMobile ? 0 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                      Informações Pessoais
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Nome Completo
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FaUser />
                          </div>
                          <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.nome ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Seu nome completo"
                            disabled={isLoading}
                          />
                        </div>
                        {errors.nome && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.nome}
                          </p>
                        )}
                      </div>

                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FaEnvelope />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.email
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="seu@email.com"
                            disabled={isLoading}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Telefone
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FaPhone />
                          </div>
                          <input
                            type="tel"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.telefone
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="(00) 00000-0000"
                            disabled={isLoading}
                          />
                        </div>
                        {errors.telefone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.telefone}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: isMobile ? 0 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                      Segurança da Conta
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <FaLock />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="senhaAtual"
                          value={formData.senhaAtual}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.senhaAtual
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Digite sua senha atual"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.senhaAtual && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.senhaAtual}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Nova Senha
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FaLock />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="novaSenha"
                            value={formData.novaSenha}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-10 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.novaSenha
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Digite a nova senha"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {errors.novaSenha && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.novaSenha}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Confirmar Nova Senha
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FaLock />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="confirmarSenha"
                            value={formData.confirmarSenha}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-10 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.confirmarSenha
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Confirme a nova senha"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {errors.confirmarSenha && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.confirmarSenha}
                          </p>
                        )}
                      </div>
                    </div>

                    {formData.novaSenha && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Força da Senha
                        </h4>

                        <div className="flex items-center mb-3">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                passwordStrength.score === 0
                                  ? "bg-red-500"
                                  : passwordStrength.score <= 2
                                  ? "bg-yellow-500"
                                  : passwordStrength.score <= 4
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${(passwordStrength.score / 5) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="ml-3 text-xs font-medium">
                            {passwordStrength.score === 0
                              ? "Muito fraca"
                              : passwordStrength.score <= 2
                              ? "Fraca"
                              : passwordStrength.score <= 4
                              ? "Boa"
                              : "Excelente"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div
                            className={`flex items-center ${
                              passwordStrength.meetsLength
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {passwordStrength.meetsLength ? (
                              <FaCheck className="mr-2" />
                            ) : (
                              <FaTimes className="mr-2" />
                            )}
                            <span>Mínimo 8 caracteres</span>
                          </div>
                          <div
                            className={`flex items-center ${
                              passwordStrength.hasUpper
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {passwordStrength.hasUpper ? (
                              <FaCheck className="mr-2" />
                            ) : (
                              <FaTimes className="mr-2" />
                            )}
                            <span>Letra maiúscula</span>
                          </div>
                          <div
                            className={`flex items-center ${
                              passwordStrength.hasLower
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {passwordStrength.hasLower ? (
                              <FaCheck className="mr-2" />
                            ) : (
                              <FaTimes className="mr-2" />
                            )}
                            <span>Letra minúscula</span>
                          </div>
                          <div
                            className={`flex items-center ${
                              passwordStrength.hasNumber
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {passwordStrength.hasNumber ? (
                              <FaCheck className="mr-2" />
                            ) : (
                              <FaTimes className="mr-2" />
                            )}
                            <span>Número</span>
                          </div>
                          <div
                            className={`flex items-center ${
                              passwordStrength.hasSpecial
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {passwordStrength.hasSpecial ? (
                              <FaCheck className="mr-2" />
                            ) : (
                              <FaTimes className="mr-2" />
                            )}
                            <span>Caractere especial</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                <div className="mt-auto pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    className={`w-full px-5 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-md ${
                      isSubmitting || isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;
