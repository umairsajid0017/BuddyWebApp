'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useServices } from '@/lib/api'
import { type Service } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { StarIcon, Search, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import TooltipWrapper from '@/components/ui/tooltip-wrapper'

type SearchResultProps = {
  service: Service
  onSelect: (service: Service) => void
}

const SearchResult: React.FC<SearchResultProps> = ({ service, onSelect }) => (
  <Card className="cursor-pointer hover:bg-gray-100" onClick={() => onSelect(service)}>
    <CardContent className="flex items-center p-2">
      <div className="w-16 h-16 bg-gray-200 relative overflow-hidden rounded-md mr-4">
        <Image
          src={`/placeholder.svg?height=64&width=64`}
          alt={service.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div>
        <h4 className="text-sm font-medium">{service.name}</h4>
        <p className="text-xs text-gray-600 truncate">{service.description}</p>
        <div className="flex items-center mt-1">
          <p className="text-xs text-primary font-bold mr-2">Rs. {service.price}</p>
          <div className="flex items-center text-xs text-gray-600">
            <StarIcon className="w-3 h-3 mr-1" />
            <span>4.9</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

const SearchSkeleton: React.FC = () => (
  <Card className="p-2">
    <CardContent className="flex items-center">
      <Skeleton className="w-16 h-16 rounded-md mr-4" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-2" />
        <div className="flex items-center">
          <Skeleton className="h-3 w-16 mr-2" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </CardContent>
  </Card>
)

interface SearchComponentProps {
  onClose?: () => void
}

export function SearchComponent({ onClose }: SearchComponentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { data: servicesResponse } = useServices()

  const services = React.useMemo(() => servicesResponse?.data ?? [], [servicesResponse])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (searchTerm) {
      setIsLoading(true)
      const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(filteredServices)
      setIsLoading(false)
      setShowDropdown(true)
    } else {
      setSearchResults([])
      setShowDropdown(false)
    }
  }, [searchTerm, services])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm) {
      router.push(`/services/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleSelect = (service: Service) => {
    setSearchTerm(service.name)
    setShowDropdown(false)
    router.push(`/services/${service.id}`)
  }

  const handleClear = () => {
    setSearchTerm('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search services"
          className="w-full h-14 pl-10 pr-20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
          {searchTerm && (
            <TooltipWrapper content={"Clear"}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mr-1 hidden md:flex"
                onClick={handleClear}
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            </TooltipWrapper>
          )}
          {/* {onClose && (
            <TooltipWrapper content="Close">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="md:hidden"
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            </TooltipWrapper>
          )} */}
        </div>
      </form>
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => <SearchSkeleton key={index} />)
          ) : searchResults.length > 0 ? (
            searchResults.map(service => (
              <SearchResult key={service.id} service={service} onSelect={handleSelect} />
            ))
          ) : (
            <Card className="p-4">
              <p className="text-center text-gray-500">No results found</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}