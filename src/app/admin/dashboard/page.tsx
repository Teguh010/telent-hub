'use client';

import { useState, useEffect } from 'react';
import { Users, Building, Heart, MessageCircle, TrendingUp, Eye, UserPlus, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/card';

// Dummy data for admin dashboard
const dummyStats = {
  totalTalents: 1247,
  totalEmployers: 89,
  totalMatches: 342,
  totalMessages: 1256,
  newTalentsThisWeek: 23,
  newEmployersThisWeek: 5,
  activeMatches: 156,
  pendingMessages: 28
};

const recentActivities = [
  {
    id: 1,
    type: 'talent_joined',
    message: 'New talent joined: Sarah Johnson',
    time: '2 minutes ago',
    icon: UserPlus
  },
  {
    id: 2,
    type: 'match_created',
    message: 'New match: TechCorp ↔ John Doe',
    time: '5 minutes ago',
    icon: Heart
  },
  {
    id: 3,
    type: 'employer_joined',
    message: 'New employer joined: StartupXYZ',
    time: '10 minutes ago',
    icon: Building
  },
  {
    id: 4,
    type: 'message_sent',
    message: 'Message sent: TechCorp to John Doe',
    time: '15 minutes ago',
    icon: MessageCircle
  }
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(dummyStats);
  const [activities, setActivities] = useState(recentActivities);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Talents</p>
                <p className="text-3xl font-bold">{stats.totalTalents}</p>
                <p className="text-white/60 text-sm">+{stats.newTalentsThisWeek} this week</p>
              </div>
              <Users className="w-12 h-12 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Employers</p>
                <p className="text-3xl font-bold">{stats.totalEmployers}</p>
                <p className="text-white/60 text-sm">+{stats.newEmployersThisWeek} this week</p>
              </div>
              <Building className="w-12 h-12 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Matches</p>
                <p className="text-3xl font-bold">{stats.totalMatches}</p>
                <p className="text-white/60 text-sm">{stats.activeMatches} active</p>
              </div>
              <Heart className="w-12 h-12 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Messages</p>
                <p className="text-3xl font-bold">{stats.totalMessages}</p>
                <p className="text-white/60 text-sm">{stats.pendingMessages} pending</p>
              </div>
              <MessageCircle className="w-12 h-12 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <Briefcase className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                <Users className="w-6 h-6 mb-2" />
                <p className="text-sm font-medium">View Talents</p>
              </button>
              <button className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all">
                <Building className="w-6 h-6 mb-2" />
                <p className="text-sm font-medium">View Employers</p>
              </button>
              <button className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all">
                <Heart className="w-6 h-6 mb-2" />
                <p className="text-sm font-medium">View Matches</p>
              </button>
              <button className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all">
                <MessageCircle className="w-6 h-6 mb-2" />
                <p className="text-sm font-medium">View Messages</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}