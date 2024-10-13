import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface Pokemon {
  id: number
  name: string
  types: string[]
  species: string
  height: number
  weight: number
  image: string
}

async function getPokemon(url: string): Promise<{ pokemon: Pokemon[], nextUrl: string | null }> {
  const response = await fetch(url)
  const data = await response.json()
  
  const pokemonDetails = await Promise.all(
    data.results.map(async (pokemon: { name: string, url: string }) => {
      const res = await fetch(pokemon.url)
      const pokemonData = await res.json()
      const speciesRes = await fetch(pokemonData.species.url)
      const speciesData = await speciesRes.json()
      
      return {
        id: pokemonData.id,
        name: pokemonData.name,
        types: pokemonData.types.map((type: { type: { name: string } }) => type.type.name),
        species: speciesData.genera.find((genus: { language: { name: string } }) => genus.language.name === "en").genus,
        height: pokemonData.height / 10, // convert to meters
        weight: pokemonData.weight / 10, // convert to kg
        image: pokemonData.sprites.front_default
      }
    })
  )
  
  return { pokemon: pokemonDetails, nextUrl: data.next }
}

export default async function PokemonList({ page = 1 }: { page?: number }) {
  const limit = 20
  const offset = (page - 1) * limit
  const { pokemon, nextUrl } = await getPokemon(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)

  return (
    <div className="container mx-auto p-4">
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
      {nextUrl && (
        <div className="mt-6 text-center">
          <Link href={`/pokemon?page=${page + 1}`} passHref>
            <Button>
              Load More
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}