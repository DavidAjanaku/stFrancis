// components/Dashboard/Dashboard.js
import React from 'react';
import { Users, Calendar, Heart, Mail } from 'lucide-react';
import { StatCard } from '../shared/SharedComponents';

const Dashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Ministries" value={data.ministries.length} icon={Users} color="#3B82F6" />
        <StatCard title="Upcoming Events" value={data.events.length} icon={Calendar} color="#10B981" />
        <StatCard title="Prayer Requests" value={data.prayerRequests.length} icon={Heart} color="#F59E0B" />
        <StatCard title="Newsletter Subscribers" value={data.newsletters.length} icon={Mail} color="#8B5CF6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Prayer Requests</h3>
          <div className="space-y-3">
            {data.prayerRequests.slice(0, 3).map(request => (
              <div key={request.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                <Heart className="h-4 w-4 text-red-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{request.name}</p>
                  <p className="text-sm text-gray-600">{request.request}</p>
                  <p className="text-xs text-gray-500 mt-1">{request.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {data.events.slice(0, 3).map(event => (
              <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                <Calendar className="h-4 w-4 text-blue-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{event.date} • {event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;