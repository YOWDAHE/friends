"use client"

import { useState } from "react"
import { Calendar, Eye, Pencil, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EventFormDialog } from "@/components/admin/event-form-dialog"
import { EventDetailSheet } from "@/components/admin/event-detail-sheet"

// Mock data
const initialEvents = [
  {
    id: "1",
    title: "Wine Tasting Night",
    subtitle: "Explore wines from around the world",
    date: "2025-01-24",
    time: "19:00",
    location: "Main Dining Room",
    description: "Join us for an evening of wine tasting featuring selections from top vineyards.",
    imageUrl: "/wine-tasting.png",
    published: true,
    reservationCount: 24,
  },
  {
    id: "2",
    title: "Live Jazz Brunch",
    subtitle: "Sunday brunch with live music",
    date: "2025-02-02",
    time: "11:00",
    location: "Outdoor Patio",
    description: "Enjoy brunch classics while listening to smooth jazz.",
    imageUrl: "/jazz-brunch.jpg",
    published: true,
    reservationCount: 18,
  },
  {
    id: "3",
    title: "Valentine's Dinner",
    subtitle: "Special 4-course menu for couples",
    date: "2025-02-14",
    time: "18:00",
    location: "Private Room",
    description: "A romantic dinner experience with carefully curated dishes.",
    imageUrl: "/romantic-dinner.png",
    published: false,
    reservationCount: 0,
  },
]

export default function EventsPage() {
  const [events, setEvents] = useState(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState<(typeof initialEvents)[0] | null>(null)
  const [editingEvent, setEditingEvent] = useState<(typeof initialEvents)[0] | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id))
  }

  const handleSaveEvent = (eventData: any) => {
    if (editingEvent) {
      // Update existing event
      setEvents(events.map((e) => (e.id === editingEvent.id ? { ...eventData, id: e.id } : e)))
    } else {
      // Create new event
      setEvents([...events, { ...eventData, id: Date.now().toString() }])
    }
    setEditingEvent(null)
    setIsCreateDialogOpen(false)
  }

  const handleViewEvent = (event: (typeof initialEvents)[0]) => {
    setSelectedEvent(event)
    setIsDetailSheetOpen(true)
  }

  const handleEditEvent = (event: (typeof initialEvents)[0]) => {
    setEditingEvent(event)
    setIsCreateDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-rage text-4xl md:text-5xl">Upcoming Events</h1>
          <p className="mt-2 text-gray-600">Manage upcoming and past events</p>
        </div>
        <Button
          onClick={() => {
            setEditingEvent(null)
            setIsCreateDialogOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Events Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reservations</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <div>
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.subtitle}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-500">{event.time}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={event.published ? "default" : "secondary"}>
                    {event.published ? "Live" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{event.reservationCount}</span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewEvent(event)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Event Form Dialog */}
      <EventFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        event={editingEvent}
        onSave={handleSaveEvent}
      />

      {/* Event Detail Sheet */}
      {selectedEvent && (
        <EventDetailSheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen} event={selectedEvent} />
      )}
    </div>
  )
}
