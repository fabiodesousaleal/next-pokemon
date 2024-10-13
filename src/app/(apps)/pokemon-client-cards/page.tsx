"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Pokemon {
  id: number
  name: string
  types: string[]
  species: string
  height: number
  weight: number
  image: string
}

export default function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [nextUrl, setNextUrl] = useState<string | null>("https://pokeapi.co/api/v2/pokemon")
  const [isLoading, setIsLoading] = useState(false)

  const fetchPokemon = async (url: string) => {
    setIsLoading(true)
    const response = await fetch(url)
    const data = await response.json()
    setNextUrl(data.next)
    
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
    
    setPokemon(prev => [...prev, ...pokemonDetails])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchPokemon("https://pokeapi.co/api/v2/pokemon")
  }, [])

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
          <Button 
            onClick={() => fetchPokemon(nextUrl)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}