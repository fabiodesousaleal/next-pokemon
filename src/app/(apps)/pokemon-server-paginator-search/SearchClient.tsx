// src/app/(apps)/pokemon-server-cards-paginator/SearchClient.tsx
"use client"; // Este componente continua sendo client-side

import React, { useState } from 'react';

interface Pokemon {
  name: string;
  url: string;
}

export const SearchClient = () => {
  const [searchTerm, setSearchTerm] = useState('');  // Termo de busca do usuário
  const [searchResult, setSearchResult] = useState<Pokemon | null>(null); // Resultado da busca
  const [error, setError] = useState<string | null>(null); // Erro de busca

  // Função para lidar com a requisição de busca
  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;  // Evitar busca vazia

    try {
      const response = await fetch(`/api/search-pokemon?name=${searchTerm}`);
      const data = await response.json();     
      
      if (response.ok) {
        setSearchResult(data);  // Guardar o resultado do Pokémon
        setError(null);  // Limpar mensagem de erro
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setSearchResult(null);  // Limpar resultados anteriores
      setError(err.message);  // Exibir mensagem de erro
    }
  };

  return (
    <div>
      <h2>Busca por nome do Pokémon</h2>
      <div>
        <input
          type="text"
          placeholder="Digite o nome do Pokémon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {/* Exibir resultado da busca */}
      {searchResult && (
        <div>
          <h3>Resultado da busca:</h3>
          <p>Nome: {searchResult.name}</p>
        </div>
      )}

      {/* Exibir mensagem de erro */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
