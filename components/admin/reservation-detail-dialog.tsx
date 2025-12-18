"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User, Mail, Phone, Users, Calendar, FileText } from "lucide-react"

interface ReservationDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reservation: any
  onStatusChange: (id: string, status: string) => void
}

export function ReservationDetailDialog({
  open,
  onOpenChange,
  reservation,
  onStatusChange,
}: ReservationDetailDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reservation Details</DialogTitle>
          <DialogDescription>Complete information for this reservation</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={getStatusVariant(reservation.status)}>{reservation.status}</Badge>
          </div>

          {/* Guest Information */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold">Guest Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <span>{reservation.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{reservation.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{reservation.phone}</span>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold">Reservation Details</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  Party of <strong>{reservation.partySize}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div className="text-sm">
                  <div className="font-medium">{reservation.eventName}</div>
                  <div className="text-gray-600">
                    {new Date(reservation.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Notes */}
          {reservation.notes && (
            <div className="rounded-lg border bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <h3 className="font-semibold">Special Notes</h3>
              </div>
              <p className="text-sm text-gray-600">{reservation.notes}</p>
            </div>
          )}

          {/* Created At */}
          <div className="text-xs text-gray-500">Created: {reservation.createdAt}</div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {reservation.status === "pending" && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  onStatusChange(reservation.id, "cancelled")
                  onOpenChange(false)
                }}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Cancel Reservation
              </Button>
              <Button
                onClick={() => {
                  onStatusChange(reservation.id, "confirmed")
                  onOpenChange(false)
                }}
              >
                Confirm Reservation
              </Button>
            </>
          )}
          {reservation.status === "confirmed" && (
            <Button
              variant="outline"
              onClick={() => {
                onStatusChange(reservation.id, "cancelled")
                onOpenChange(false)
              }}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Cancel Reservation
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
