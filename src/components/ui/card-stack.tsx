'use client'

import React, { useState, useCallback, useMemo, useEffect, ReactNode } from 'react'

type CardStackProps<T> = {
  items: T[]
  renderItem: (item: T) => ReactNode
  interval?: number
}

export default function CardStack<T>({ items, renderItem, interval = 3000 }: CardStackProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  console.log("items", items);
  const nextIndex = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }, [items.length])

  useEffect(() => {
    if (isHovered) return

    const timer = setInterval(nextIndex, interval)
    return () => clearInterval(timer)
  }, [nextIndex, interval, isHovered])

  const cardStyles = useMemo(() => {
    return items.map((_, index) => {
      const offset = (index - currentIndex + items.length) % items.length
      return {
        zIndex: items.length - offset,
        transform: `translateY(${offset * 8}px) scale(${1 - offset * 0.1})`,
        opacity: 1 - offset * 0.2,
        transition: 'all 0.3s ease-in-out',
      }
    })
  }, [currentIndex, items.length])

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg overflow-hidden"
          style={cardStyles[index]}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}