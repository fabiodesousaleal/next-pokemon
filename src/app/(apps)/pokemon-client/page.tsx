'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"

interface PokemonItem {
  name: string
  url: string
}

export default function Component() {
  const [items, setItems] = useState<PokemonItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/item?limit=10')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        setItems(data.results)
      } catch (err) {
        setError('Error fetching Pokémon items. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Itens Pokémon</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.name}>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold capitalize">{item.name.replace('-', ' ')}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                ID: {item.url.split('/').slice(-2, -1)[0]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}