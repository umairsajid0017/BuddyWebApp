'use client'

import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const languages = [
  { id: 'en-US', name: 'English (US)' },
  { id: 'en-GB', name: 'English (UK)' },
  { id: 'zh', name: 'Mandarin' },
  { id: 'ar', name: 'Arabic' },
  { id: 'hi', name: 'Hindi' },
  { id: 'la', name: 'Latin' },
  { id: 'es', name: 'Spanish' },
  { id: 'bn', name: 'Bengali' },
  { id: 'ru', name: 'Russian' },
]

export default function LanguageComponent() {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US')

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
    console.log(`Language changed to: ${value}`)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Language Settings</h2>
      <div>
        <h3 className="text-lg font-semibold mb-4">Suggested</h3>
        <RadioGroup value={selectedLanguage} onValueChange={handleLanguageChange} className="grid grid-cols-2 gap-4">
          {languages.map((language) => (
            <div key={language.id} className="flex items-center space-x-2 rounded-lg border p-4">
              <RadioGroupItem value={language.id} id={language.id} />
              <Label htmlFor={language.id}>{language.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}