'use client'

import { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from '../ui/card'

const notificationSettings = [
  { id: 'general', label: 'General Notification' },
  { id: 'vibrate', label: 'Vibrate' },
  { id: 'promoDiscount', label: 'Promo & Discount' },
  { id: 'appUpdates', label: 'App Updates' },
  { id: 'newTips', label: 'New Tips Available' },
  { id: 'sound', label: 'Sound' },
  { id: 'specialOffers', label: 'Special Offers' },
  { id: 'payments', label: 'Payments' },
  { id: 'newService', label: 'New Service Available' },
]

export default function NotificationSettingsComponent() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    general: true,
    vibrate: false,
    promoDiscount: true,
    appUpdates: true,
    newTips: true,
    sound: true,
    specialOffers: true,
    payments: false,
    newService: false,
  })

  const handleToggle = (id: string) => {
    setSettings(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSave = () => {
    console.log('Saving notification settings:', settings)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Notifications</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notificationSettings.map(setting => (
          <Card key={setting.id} className="flex items-center justify-between p-4">
            <Label htmlFor={setting.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {setting.label}
            </Label>
            <Switch
              id={setting.id}
              checked={settings[setting.id]}
              onCheckedChange={() => handleToggle(setting.id)}
              className="data-[state=checked]:bg-secondary-900"
              />
          </Card>
        ))}
      </div>

      <Button 
        className="w-full " 
        onClick={handleSave}
      >
        Save Changes
      </Button>
    </div>
  )
}