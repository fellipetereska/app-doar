import React, { useMemo } from 'react';
import { SelectInput } from './Inputs';

const FiltroEstoque = ({
  estoque = [],
  selectedCategoria,
  setSelectedCategoria,
  selectedSubCategoria,
  setSelectedSubCategoria,
}) => {
  // Extrair categorias únicas
  const categoriasUnicas = useMemo(() => {
    const mapa = new Map();
    estoque.forEach((item) => {
      if (!mapa.has(item.categoria_id)) {
        mapa.set(item.categoria_id, item.categoria);
      }
    });
    return Array.from(mapa.entries()).map(([value, label]) => ({ value, label }));
  }, [estoque]);

  // Subcategorias da categoria selecionada
  const subcategoriasFiltradas = useMemo(() => {
    const mapa = new Map();
    estoque
      .filter((item) => item.categoria_id === parseInt(selectedCategoria))
      .forEach((item) => {
        if (!mapa.has(item.subcategoria_id)) {
          mapa.set(item.subcategoria_id, item.subcategoria);
        }
      });
    return Array.from(mapa.entries()).map(([value, label]) => ({ value, label }));
  }, [estoque, selectedCategoria]);

  return (
    <>
      <SelectInput
        label="Categoria"
        name="categoria_id"
        value={selectedCategoria}
        onChange={(e) => {
          setSelectedCategoria(e.target.value);
          setSelectedSubCategoria('');
        }}
        required
        options={categoriasUnicas}
        placeholder="Selecione uma categoria"
      />

      <SelectInput
        label="Subcategoria"
        name="subcategoria_id"
        value={selectedSubCategoria}
        onChange={(e) => setSelectedSubCategoria(e.target.value)}
        required
        disable={!selectedCategoria}
        options={subcategoriasFiltradas}
        placeholder="Selecione uma Subcategoria"
      />
    </>
  );
};

export default FiltroEstoque;
