'use client'

import { useState, useEffect, useMemo } from 'react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatCard from '@/components/dashboard/StatCard'
import PriorityBadge from '@/components/dashboard/PriorityBadge'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { supabaseClient } from '@/lib/supabase'
import { mockSubmissions, Submission } from '@/lib/mockData'
import { Filter, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchSubmissions() {
      if (!supabaseClient) {
        setSubmissions(mockSubmissions)
        setLoading(false)
        return
      }
      const { data, error } = await supabaseClient
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) {
        setSubmissions(
          data.map((row: any) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone ?? undefined,
            details: row.details,
            type: row.type,
            priority: row.priority,
            status: row.status,
            assignee: row.assignee ?? undefined,
            createdAt: new Date(row.created_at),
            updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(row.created_at),
          }))
        )
      }
      if (error) {
        console.error('Failed to fetch submissions:', error)
        setSubmissions(mockSubmissions)
      }
      setLoading(false)
    }
    fetchSubmissions()
  }, [])

  // Service types mapping
  const serviceTypes = {
    'all': 'All Types',
    'design': 'Design Services',
    'video': 'Video Services',
    'coverage': 'Event Coverage',
    'social-media': 'Social Media',
    'branding': 'Branding',
    'website': 'Website Updates'
  }

  // Get unique years and months from submissions
  const availableYears = useMemo(() => {
    const years = new Set(submissions.map(s => new Date(s.createdAt).getFullYear()))
    return Array.from(years).sort((a, b) => b - a)
  }, [submissions])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission => {
      const submissionDate = new Date(submission.createdAt)
      const submissionMonth = submissionDate.getMonth()
      const submissionYear = submissionDate.getFullYear()

      const typeMatch = selectedType === 'all' || submission.type === selectedType
      const monthMatch = selectedMonth === 'all' || submissionMonth === parseInt(selectedMonth)
      const yearMatch = selectedYear === 'all' || submissionYear === parseInt(selectedYear)

      return typeMatch && monthMatch && yearMatch
    })
  }, [submissions, selectedType, selectedMonth, selectedYear])

  const totalSubmissions = filteredSubmissions.length
  const pendingSubmissions = filteredSubmissions.filter(s => s.status === 'Pending').length
  const inProgressSubmissions = filteredSubmissions.filter(s => s.status === 'In Progress').length
  const completedSubmissions = filteredSubmissions.filter(s => s.status === 'Completed').length

  const recentSubmissions = filteredSubmissions.slice(0, 5)

  // Get type label for display
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'design': 'Design',
      'video': 'Video',
      'coverage': 'Coverage',
      'social-media': 'Social Media',
      'branding': 'Branding',
      'website': 'Website'
    }
    return labels[type] || type
  }

  const clearFilters = () => {
    setSelectedType('all')
    setSelectedMonth('all')
    setSelectedYear('all')
  }

  const hasActiveFilters = selectedType !== 'all' || selectedMonth !== 'all' || selectedYear !== 'all'

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Welcome back, Ken! Here's what's happening today."
      />
      
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Stats Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-umak-blue border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Requests"
              value={totalSubmissions}
              color="bg-umak-blue"
              subtitle="All submissions"
            />
            <StatCard
              title="Pending Review"
              value={pendingSubmissions}
              color="bg-orange-500"
              subtitle="Needs attention"
            />
            <StatCard
              title="In Progress"
              value={inProgressSubmissions}
              color="bg-blue-600"
              subtitle="Currently working"
            />
            <StatCard
              title="Completed"
              value={completedSubmissions}
              color="bg-green-600"
              subtitle="Successfully done"
            />
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full p-4 sm:p-6 border-b-2 border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Filter className="text-umak-blue" size={24} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-marcellus text-umak-blue">Filter Submissions</h2>
                  <p className="text-xs sm:text-sm text-gray-600 font-metropolis mt-1">
                    {hasActiveFilters ? `${filteredSubmissions.length} result(s) with active filters` : 'Click to filter by type, month, or year'}
                  </p>
                </div>
              </div>
              <div className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
                ▼
              </div>
            </div>
          </button>

          {showFilters && (
            <div className="p-4 sm:p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 font-metropolis">
                    Request Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umak-blue focus:border-transparent font-metropolis text-sm"
                  >
                    <option value="all">All Types</option>
                    {Object.entries(serviceTypes).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Month Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 font-metropolis">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umak-blue focus:border-transparent font-metropolis text-sm"
                  >
                    <option value="all">All Months</option>
                    {months.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 font-metropolis">
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umak-blue focus:border-transparent font-metropolis text-sm"
                  >
                    <option value="all">All Years</option>
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <p className="text-xs font-semibold text-gray-600 mb-2 font-metropolis uppercase">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedType !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-umak-blue text-white text-xs font-metropolis rounded-full">
                        {serviceTypes[selectedType as keyof typeof serviceTypes]}
                        <button onClick={() => setSelectedType('all')} className="hover:bg-blue-700 rounded-full p-0.5">×</button>
                      </span>
                    )}
                    {selectedMonth !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-metropolis rounded-full">
                        {months[parseInt(selectedMonth)]}
                        <button onClick={() => setSelectedMonth('all')} className="hover:bg-blue-700 rounded-full p-0.5">×</button>
                      </span>
                    )}
                    {selectedYear !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-metropolis rounded-full">
                        {selectedYear}
                        <button onClick={() => setSelectedYear('all')} className="hover:bg-blue-700 rounded-full p-0.5">×</button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b-2 border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-marcellus text-umak-blue">
                  {hasActiveFilters ? 'Filtered' : 'Recent'} Request Submissions
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 font-metropolis mt-1">
                  {hasActiveFilters 
                    ? `Showing ${filteredSubmissions.length} filtered result(s)` 
                    : 'Latest requests from university departments'}
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-umak-blue to-umak-blue-50 text-white">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold font-metropolis uppercase tracking-wider">
                    Requestor
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold font-metropolis uppercase tracking-wider hidden xl:table-cell">
                    Type
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold font-metropolis uppercase tracking-wider hidden lg:table-cell">
                    Request Details
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold font-metropolis uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold font-metropolis uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold font-metropolis uppercase tracking-wider hidden sm:table-cell">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentSubmissions.length > 0 ? (
                  recentSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-blue-50 transition-colors border-b border-gray-100">
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 font-metropolis truncate">{submission.name}</div>
                          <div className="text-xs text-gray-500 font-metropolis truncate">{submission.email}</div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden xl:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-metropolis">
                          {getTypeLabel(submission.type)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <div className="text-sm text-gray-900 max-w-md font-metropolis line-clamp-2">
                          {submission.details}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <PriorityBadge priority={submission.priority as 'High' | 'Medium' | 'Low'} />
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <StatusBadge status={submission.status as 'Pending' | 'In Progress' | 'Completed'} />
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 font-metropolis hidden sm:table-cell">
                        {new Date(submission.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 sm:px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Calendar className="text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 font-metropolis font-semibold">No submissions found</p>
                        <p className="text-sm text-gray-400 font-metropolis mt-1">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
            <a href="/dashboard/submissions" className="text-xs sm:text-sm text-umak-blue hover:text-umak-blue-50 font-semibold font-metropolis inline-flex items-center gap-2 hover:gap-3 transition-all">
              View all request submissions
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}