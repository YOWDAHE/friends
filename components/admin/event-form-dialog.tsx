"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload } from "lucide-react"

interface EventFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: any
  onSave: (event: any) => void
}

export function EventFormDialog({ open, onOpenChange, event, onSave }: EventFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    date: "",
    time: "",
    location: "",
    description: "",
    imageUrl: "/community-event.png",
    published: false,
    reservationCount: 0,
  })
  const [selectedFileName, setSelectedFileName] = useState("")

  useEffect(() => {
    if (event) {
      setFormData(event)
      setSelectedFileName("")
    } else {
      setFormData({
        title: "",
        subtitle: "",
        date: "",
        time: "",
        location: "",
        description: "",
        imageUrl: "/community-event.png",
        published: false,
        reservationCount: 0,
      })
      setSelectedFileName("")
    }
  }, [event, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFileName(file.name)
      // In a real app, you'd upload the file here
      console.log("[v0] Selected file:", file.name)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create New Event"}</DialogTitle>
          <DialogDescription>
            {event ? "Update the event details below." : "Fill in the details to create a new event."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Wine Tasting Night"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Short description"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Main Dining Room"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed event description..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Event Image</Label>
            <div className="flex items-center gap-3">
              <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image")?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
              {selectedFileName && <span className="text-sm text-gray-600">{selectedFileName}</span>}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="published">Publish Event</Label>
              <p className="text-sm text-gray-500">Make this event visible to the public</p>
            </div>
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
