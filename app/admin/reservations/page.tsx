"use client"

import { useState } from "react"
import { Eye, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ReservationDetailDialog } from "@/components/admin/reservation-detail-dialog"

// Mock data
const initialReservations = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    partySize: 2,
    eventName: "Wine Tasting Night",
    status: "confirmed",
    createdAt: "2025-01-10 14:30",
    notes: "Prefer table near window",
    date: "2025-01-24",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "(555) 234-5678",
    partySize: 4,
    eventName: "Live Jazz Brunch",
    status: "pending",
    createdAt: "2025-01-11 09:15",
    notes: "Celebrating birthday",
    date: "2025-02-02",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "(555) 345-6789",
    partySize: 2,
    eventName: "Wine Tasting Night",
    status: "pending",
    createdAt: "2025-01-11 16:45",
    notes: "",
    date: "2025-01-24",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "(555) 456-7890",
    partySize: 3,
    eventName: "Valentine's Dinner",
    status: "confirmed",
    createdAt: "2025-01-12 11:20",
    notes: "Vegetarian options needed",
    date: "2025-02-14",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    phone: "(555) 567-8901",
    partySize: 2,
    eventName: "Live Jazz Brunch",
    status: "cancelled",
    createdAt: "2025-01-08 13:00",
    notes: "",
    date: "2025-02-02",
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa@example.com",
    phone: "(555) 678-9012",
    partySize: 6,
    eventName: "Wine Tasting Night",
    status: "confirmed",
    createdAt: "2025-01-13 10:30",
    notes: "Group reservation - corporate event",
    date: "2025-01-24",
  },
]

export default function ReservationsPage() {
  const [reservations, setReservations] = useState(initialReservations)
  const [selectedReservation, setSelectedReservation] = useState<(typeof initialReservations)[0] | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")

  const handleStatusChange = (id: string, newStatus: string) => {
    setReservations(reservations.map((r) => (r.id === id ? { ...r, status: newStatus } : r)))
  }

  const handleViewReservation = (reservation: (typeof initialReservations)[0]) => {
    setSelectedReservation(reservation)
    setIsDetailDialogOpen(true)
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Filter reservations
  const filteredReservations = reservations.filter((reservation) => {
    if (statusFilter !== "all" && reservation.status !== statusFilter) return false
    if (eventFilter !== "all" && reservation.eventName !== eventFilter) return false
    if (dateFilter && reservation.date !== dateFilter) return false
    return true
  })

  // Get unique events for filter
  const uniqueEvents = Array.from(new Set(reservations.map((r) => r.eventName)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-rage text-4xl md:text-5xl">Reservations</h1>
        <p className="mt-2 text-gray-600">Manage customer reservations and bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Filter by event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {uniqueEvents.map((event) => (
              <SelectItem key={event} value={event}>
                {event}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-[200px] bg-white"
          placeholder="Filter by date"
        />

        {(eventFilter !== "all" || dateFilter) && (
          <Button
            variant="ghost"
            onClick={() => {
              setEventFilter("all")
              setDateFilter("")
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Tabs for Status Filter */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-6">
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Party Size</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                      No reservations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="font-semibold">{reservation.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{reservation.email}</div>
                          <div className="text-gray-500">{reservation.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{reservation.partySize}</span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate text-sm">{reservation.eventName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(reservation.status)}>{reservation.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">{reservation.createdAt}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewReservation(reservation)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {reservation.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(reservation.id, "confirmed")}
                                className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                title="Confirm"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(reservation.id, "cancelled")}
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Reservation Detail Dialog */}
      {selectedReservation && (
        <ReservationDetailDialog
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          reservation={selectedReservation}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
