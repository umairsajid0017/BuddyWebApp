"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, subMonths, addMonths } from "date-fns"
import { Button } from "@/components/ui/button"

const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

export default function CalendarComponent() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startingDayIndex = monthStart.getDay()
  const prefixDays = startingDayIndex === 0 ? 6 : startingDayIndex - 1
  const suffixDays = 7 - ((prefixDays + monthDays.length) % 7)

  const prefixDate = addDays(monthStart, -prefixDays)
  const suffixDate = addDays(monthEnd, suffixDays)

  const calendarDays = eachDayOfInterval({ start: prefixDate, end: suffixDate })

  const handlePrevMonth = () => setCurrentMonth(prevMonth => subMonths(prevMonth, 1))
  const handleNextMonth = () => setCurrentMonth(prevMonth => addMonths(prevMonth, 1))

  const handleDateClick = (day: Date) => {
    if (isSameMonth(day, currentMonth)) {
      setSelectedDate(day)
    } else if (day < monthStart) {
      setCurrentMonth(subMonths(currentMonth, 1))
      setSelectedDate(day)
    } else {
      setCurrentMonth(addMonths(currentMonth, 1))
      setSelectedDate(day)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map(day => {
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = isSameDay(day, selectedDate)
          return (
            <Button
              key={day.toISOString()}
              variant="ghost"
              className={`h-10 w-full p-0 font-normal ${
                !isCurrentMonth ? "text-muted-foreground opacity-50 cursor-default" : ""
              } ${
                isSelected ? "bg-primary text-primary-foreground hover:bg-primary transition-all duration-300 hover:text-primary-foreground" : ""
              }`}
              onClick={() => handleDateClick(day)}
              disabled={!isCurrentMonth}
            >
              {format(day, "d")}
            </Button>
          )
        })}
      </div>
      <div className="mt-8">
        <h3 className="font-semibold mb-4">Service Booking (0)</h3>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-12 h-12 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h4 className="font-semibold mb-2">You have no service booking</h4>
          <p className="text-sm text-muted-foreground">
            You don't have a service booking on this date
          </p>
        </div>
      </div>
    </div>
  )
}