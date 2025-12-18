import { Calendar, Users, UtensilsCrossed, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-rage text-4xl md:text-5xl">Welcome back</h1>
        <p className="mt-2 text-lg text-gray-600">Here's what's happening with your restaurant today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Next Event Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Next Upcoming Event</CardTitle>
            <Calendar className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Wine Tasting Night</div>
            <p className="mt-1 text-sm text-gray-500">Friday, Jan 24 at 7:00 PM</p>
          </CardContent>
        </Card>

        {/* Reservations Today Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Reservations Today</CardTitle>
            <Users className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="mt-1 text-sm text-gray-500">12 confirmed, 16 pending</p>
          </CardContent>
        </Card>

        {/* Menu Items Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Menu Items Live</CardTitle>
            <UtensilsCrossed className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="mt-1 text-sm text-gray-500">Across 5 categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/admin/events">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
          <Link href="/admin/menu">
            <Button variant="outline" className="gap-2 bg-transparent">
              <UtensilsCrossed className="h-4 w-4" />
              Manage Menu
            </Button>
          </Link>
          <Link href="/admin/reservations">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Users className="h-4 w-4" />
              View Reservations
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
