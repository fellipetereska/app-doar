import React, { useEffect, useState } from 'react';
import { Input, SelectInput } from '../Inputs/Inputs';
import { buscarEnderecoPorCep } from '../Auxiliares/helper';
import { toast } from 'react-toastify';
import { aplicarMascaraCPF, aplicarMascaraTelefone, aplicarMascaraCEP } from '../Auxiliares/masks';
import { connect } from '../../services/api';
import { CirclePlus } from 'lucide-react';

const FormAssistido = ({ onSubmit, selectedAssistido, instituicao_id, fetchAssistidos }) => {
  const [tabAtiva, setTabAtiva] = useState('dados');
  const [projetosDisponiveis, setProjetosDisponiveis] = useState([]);
  const [projetoSelecionadoId, setProjetoSelecionadoId] = useState('');

  const [form, setForm] = useState({
    nome: '',
    tipo_documento: '',
    documento: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    telefone: '',
    latitude: 0,
    longitude: 0,
  });
  const tipoDocumentoOptions = [
    { value: 'cpf', label: 'CPF' },
    { value: 'rg', label: 'RG' },
    { value: 'rne', label: 'RNE' },
    { value: 'crnm', label: 'CRNM' },
  ];

  useEffect(() => {
    if (selectedAssistido) {
      const assistido = { ...selectedAssistido.assistido };

      if (assistido.endereco) {
        const [enderecoRaw] = assistido.endereco.split(' - ');
        const [logradouro] = enderecoRaw.split(',');

        assistido.endereco = logradouro?.trim() || '';
      }

      setForm(assistido);
    }
  }, [selectedAssistido]);

  const fetchProjetos = async () => {
    if (!selectedAssistido) return;

    try {
      const res = await fetch(`${connect}/projeto?id=${instituicao_id}`);
      const data = await res.json();

      const idsVinculados = selectedAssistido?.projetos?.map(p => p.id) || [];
      const disponiveis = data.filter(p => !idsVinculados.includes(p.id));

      setProjetosDisponiveis(disponiveis);
    } catch (err) {
      console.error("Erro ao buscar projetos:", err);
    }
  };

  useEffect(() => {
    fetchProjetos();
  }, [instituicao_id]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    let novoValor = value;

    // Máscaras visuais apenas no formulário
    if (name === 'documento' && form.tipo_documento === 'cpf') {
      novoValor = aplicarMascaraCPF(value);
    }

    if (name === 'telefone') {
      novoValor = aplicarMascaraTelefone(value);
    }

    if (name === 'cep') {
      novoValor = aplicarMascaraCEP(value);
    }

    // Armazena valor sem formatação no banco
    setForm((prev) => ({
      ...prev,
      [name]: novoValor,
    }));

    // Buscar endereço se o CEP for válido
    if (name === 'cep' && novoValor.replace(/\D/g, '').length === 8) {
      try {
        const endereco = await buscarEnderecoPorCep(novoValor);
        setForm((prev) => ({
          ...prev,
          endereco: endereco.endereco,
          complemento: endereco.complemento,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          uf: endereco.uf,
          cep: novoValor
        }));
      } catch (err) {
        toast.error(err.message);
        console.error('Erro ao buscar CEP:', err.message);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      nome: '',
      tipo_documento: '',
      documento: '',
      telefone: '',
      cep: '',
      endereco: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      latitude: 0,
      longitude: 0,
    });
  };

  const handleVincularProjeto = async () => {
    if (!projetoSelecionadoId) return toast.warning("Selecione um projeto.");
    console.log(projetoSelecionadoId);
    console.log(selectedAssistido.assistido.id);

    try {
      const res = await fetch(`${connect}/assistido/${selectedAssistido.assistido.id}/vincular_projeto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projeto_id: Number(projetoSelecionadoId) })
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        throw new Error('Erro ao vincular projeto');
      }

      toast.success("Projeto vinculado com sucesso!");
      setProjetoSelecionadoId('');
      fetchProjetos();
      const projetoVinculado = projetosDisponiveis.find(p => p.id === Number(projetoSelecionadoId));
      if (projetoVinculado) {
        selectedAssistido.projetos.push(projetoVinculado);
        setProjetosDisponiveis(prev => prev.filter(p => p.id !== projetoVinculado.id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao vincular projeto.");
    }
  }

  return (
    <>
      <div className="flex flex-col">
        {/* Tabs */}
        <div className="mb-4 flex border-b text-sm font-medium text-gray-600">
          {['dados', 'projetos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTabAtiva(tab)}
              className={`px-4 py-2 border-b-2 transition-all duration-150 ${tabAtiva === tab
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent hover:text-blue-500'
                }`}
            >
              {tab === 'dados' ? 'Dados do Assistido' : 'Projetos Vinculados'}
            </button>
          ))}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">

          {tabAtiva === 'dados' && (
            <div className="overflow-y-auto pr-2 custom-scrollbar space-y-2">
              {/* Nome e Telefone */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <Input label="Nome*" name="nome" value={form.nome} onChange={handleChange} />
                </div>
                <div className="col-span-6">
                  <Input label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} required={false} />
                </div>
              </div>

              {/* Documento */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <SelectInput
                    label="Tipo do Documento"
                    name="tipo_documento"
                    value={form.tipo_documento}
                    onChange={handleChange}
                    options={tipoDocumentoOptions}
                    required
                  />
                </div>
                <div className="col-span-6">
                  <Input label="Documento*" name="documento" value={form.documento} onChange={handleChange} />
                </div>
              </div>

              {/* Endereço */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2">
                  <Input label="CEP*" name="cep" value={form.cep} onChange={handleChange} />
                </div>
                <div className="col-span-4">
                  <Input label="Endereço*" name="endereco" value={form.endereco} onChange={handleChange} />
                </div>
                <div className="col-span-2">
                  <Input label="Número*" name="numero" value={form.numero} onChange={handleChange} />
                </div>
                <div className="col-span-4">
                  <Input label="Complemento" name="complemento" value={form.complemento} onChange={handleChange} required={false} />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <Input label="Bairro*" name="bairro" value={form.bairro} onChange={handleChange} />
                </div>
                <div className="col-span-5">
                  <Input label="Cidade*" name="cidade" value={form.cidade} onChange={handleChange} />
                </div>
                <div className="col-span-2">
                  <Input label="UF*" name="uf" value={form.uf} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {tabAtiva === 'projetos' && (
            <div className="overflow-y-auto py-2 px-1 space-y-4">
              {/* Seletor de projeto e botão */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <SelectInput
                    label="Adicionar Projeto"
                    name="projeto_id"
                    value={projetoSelecionadoId}
                    onChange={(e) => setProjetoSelecionadoId(e.target.value)}
                    options={[
                      ...projetosDisponiveis.map((proj) => ({
                        value: proj.id,
                        label: proj.nome,
                      }))
                    ]}
                    required={false}
                  />
                </div>


                <button
                  type="button"
                  onClick={handleVincularProjeto}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-3 rounded"
                >
                  <CirclePlus size={18} />
                </button>
              </div>

              {/* Lista de projetos */}
              <div className="space-y-2 text-sm">
                {selectedAssistido?.projetos?.length ? (
                  selectedAssistido.projetos.map((proj) => (
                    <div key={proj.id} className="bg-gray-100 rounded px-4 py-2">
                      <p className="font-semibold text-sky-700">{proj.nome}</p>
                      <p className="text-gray-600">{proj.descricao}</p>
                      <p className="text-xs text-gray-400">
                        Início: {proj.data_inicio?.split('T')[0]}{" "}
                        {proj.data_fim && ` | Fim: ${proj.data_fim.split('T')[0]}`}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhum projeto vinculado.</p>
                )}
              </div>
            </div>
          )}

          {/* Botão salvar */}
          <div className="flex justify-end pt-4 sticky bottom-0 bg-white">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 transition-all duration-200 text-sm text-white font-bold px-6 py-2 rounded"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormAssistido;
