import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { SearchClient } from "../pokemon-server-paginator-search/SearchClient";

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  species: string;
  height: number;
  weight: number;
  image: string;
}

// Função que busca os dados de Pokémon
async function getPokemon(page: number, limit: number): Promise<{ pokemon: Pokemon[], totalCount: number }> {
  const offset = (page - 1) * limit;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await response.json();

  const pokemonDetails = await Promise.all(
    data.results.map(async (pokemon: { name: string; url: string }) => {
      const res = await fetch(pokemon.url);
      const pokemonData = await res.json();
      const speciesRes = await fetch(pokemonData.species.url);
      const speciesData = await speciesRes.json();

      return {
        id: pokemonData.id,
        name: pokemonData.name,
        types: pokemonData.types.map((type: { type: { name: string } }) => type.type.name),
        species: speciesData.genera.find((genus: { language: { name: string } }) => genus.language.name === "en").genus,
        height: pokemonData.height / 10, // convert to meters
        weight: pokemonData.weight / 10, // convert to kg
        image: pokemonData.sprites.front_default,
      };
    })
  );

  return { pokemon: pokemonDetails, totalCount: data.count };
}

export default async function PokemonList({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page as string) || 1;
  const limit = 20;

  // Busca os dados dos Pokémon
  const { pokemon, totalCount } = await getPokemon(page, limit);
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="container mx-auto p-4">
        <SearchClient />
      <h1 className="text-3xl font-bold mb-6">Pokémon List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemon.map((poke) => (
          <Card key={poke.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-xl capitalize">{poke.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <img src={poke.image} alt={poke.name} className="w-32 h-32 mx-auto mb-4" />
              <p className="text-sm mb-2">Species: {poke.species}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {poke.types.map((type) => (
                  <Badge key={type} variant="secondary">{type}</Badge>
                ))}
              </div>
              <p className="text-sm">Height: {poke.height}m</p>
              <p className="text-sm">Weight: {poke.weight}kg</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Componente de paginação */}
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={`?page=${page > 1 ? page - 1 : 1}`} />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= page - 2 && pageNumber <= page + 2)) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink href={`?page=${pageNumber}`} isActive={pageNumber === page}>
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              (pageNumber === page - 3 && page > 4) ||
              (pageNumber === page + 3 && page < totalPages - 3)
            ) {
              return <PaginationEllipsis key={pageNumber} />;
            }
            return null;
          })}
          <PaginationItem>
            <PaginationNext href={`?page=${page < totalPages ? page + 1 : totalPages}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
