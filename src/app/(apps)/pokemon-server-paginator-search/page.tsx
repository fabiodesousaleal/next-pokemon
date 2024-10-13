// src/app/(apps)/pokemon-server-cards-paginator/page.tsx
import React from 'react';
import { SearchClient } from './SearchClient'; // Importa o componente cliente

const PokemonServerCardsPaginator = async () => {
  // Lógica de paginação server-side
  const limit = 5;
  const offset = 0;  // Defina o offset conforme necessário

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();

  return (
    <div>
      <h1>Pokémon Paginator com Busca Global</h1>

      {/* Renderiza o componente cliente para a busca */}
      <SearchClient />

      <h2>Lista de Pokémons:</h2>
      <ul>
        {data.results.map((pokemon: any) => (
          <li key={pokemon.name}>{pokemon.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonServerCardsPaginator;
