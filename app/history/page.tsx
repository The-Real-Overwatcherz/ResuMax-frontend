'use client'

import React, { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Github, Linkedin, Loader2, Trash2, ExternalLink, Clock,
  Star, TrendingUp, Filter, Calendar, ChevronDown, Eye, Sparkles, MessageSquare
} from 'lucide-react'

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Report {
  id: string
  report_type: 'linkedin' | 'github' | 'x_twitter' | 'social_post'
  profile_identifier: string
  profile_name: string | null
  profile_image: string | null
  overall_score: number
  created_at: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState<Report[]>([])
  const [filter, setFilter] = useState<'all' | 'linkedin' | 'github' | 'x_twitter' | 'social_post'>('all')
  const [expandedReport, setExpandedReport] = useState<string | null>(null)
  const [fullReportData, setFullReportData] = useState<any>(null)
  const [loadingReport, setLoadingReport] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [filter])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const url = filter === 'all' 
        ? `${apiUrl}/api/reports/`
        : `${apiUrl}/api/reports/?report_type=${filter}`
      
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      if (!res.ok) throw new Error('Failed to fetch reports')
      const data = await res.json()
      setReports(data.reports || [])
    } catch (e) {
      console.error('Error fetching reports:', e)
    } finally {
      setLoading(false)
    }
  }

  const deleteReport = async (reportId: string) => {
    if (!confirm('Delete this report?')) return

    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      if (!res.ok) throw new Error('Failed to delete')
      setReports(prev => prev.filter(r => r.id !== reportId))
      if (expandedReport === reportId) {
        setExpandedReport(null)
        setFullReportData(null)
      }
    } catch (e) {
      console.error('Error deleting report:', e)
      alert('Failed to delete report')
    }
  }

  const viewFullReport = async (reportId: string) => {
    if (expandedReport === reportId) {
      setExpandedReport(null)
      setFullReportData(null)
      return
    }

    setExpandedReport(reportId)
    setLoadingReport(true)
    setFullReportData(null)

    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/reports/${reportId}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      if (!res.ok) throw new Error('Failed to fetch report')
      const data = await res.json()
      setFullReportData(data.report_data)
    } catch (e) {
      console.error('Error fetching full report:', e)
    } finally {
      setLoadingReport(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/10 border-green-500/20'
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    if (score >= 40) return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    return 'text-red-400 bg-red-500/10 border-red-500/20'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Profile Reports History</h1>
                <p className="text-xs text-white/50">LinkedIn & GitHub analyses</p>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-white/20"
            >
              <option value="all">All Reports</option>
              <option value="linkedin">LinkedIn Only</option>
              <option value="github">GitHub Only</option>
              <option value="x_twitter">X / Twitter Only</option>
              <option value="social_post">Social Posts Only</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-white/30" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white/20" />
            </div>
            <h2 className="text-xl font-semibold text-white/70 mb-2">No reports yet</h2>
            <p className="text-white/40 mb-6">Analyze a LinkedIn or GitHub profile to get started</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/linkedin-optimizer">
                <Button variant="outline" className="gap-2">
                  <Linkedin className="w-4 h-4" /> Analyze LinkedIn
                </Button>
              </Link>
              <Link href="/github-enhancer">
                <Button variant="outline" className="gap-2">
                  <Github className="w-4 h-4" /> Analyze GitHub
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20"
              >
                {/* Report Header */}
                <div className="p-4 flex items-center gap-4">
                  {/* Icon/Avatar */}
                  {report.profile_image ? (
                    <img
                      src={report.profile_image}
                      alt=""
                      className="w-12 h-12 rounded-xl border border-white/10 object-cover"
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      report.report_type === 'linkedin' 
                        ? 'bg-[#0A66C2]/10 border border-[#0A66C2]/20'
                        : report.report_type === 'x_twitter'
                        ? 'bg-white/5 border border-white/10'
                        : report.report_type === 'social_post'
                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      {report.report_type === 'linkedin' 
                        ? <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                        : report.report_type === 'x_twitter'
                        ? <XLogo className="w-5 h-5 text-white/70" />
                        : report.report_type === 'social_post'
                        ? <Sparkles className="w-6 h-6 text-emerald-400" />
                        : <Github className="w-6 h-6 text-white/70" />
                      }
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">
                        {report.profile_name || report.profile_identifier}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                        report.report_type === 'linkedin'
                          ? 'bg-[#0A66C2]/10 text-[#0A66C2]'
                          : report.report_type === 'x_twitter'
                          ? 'bg-white/10 text-white/60'
                          : report.report_type === 'social_post'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-white/5 text-white/50'
                      }`}>
                        {report.report_type === 'x_twitter' ? 'X / Twitter' : report.report_type === 'social_post' ? 'Social Post' : report.report_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(report.created_at)}
                      </span>
                      {report.report_type === 'github' && (
                        <a
                          href={`https://github.com/${report.profile_identifier}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-white/60"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" /> View Profile
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className={`px-3 py-1.5 rounded-xl border text-lg font-bold ${getScoreColor(report.overall_score)}`}>
                    {report.overall_score}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => viewFullReport(report.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        expandedReport === report.id
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'hover:bg-white/10 text-white/50 hover:text-white'
                      }`}
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteReport(report.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Report Details */}
                {expandedReport === report.id && (
                  <div className="border-t border-white/10 p-4 bg-black/20">
                    {loadingReport ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-white/30" />
                      </div>
                    ) : fullReportData ? (
                      <div className="space-y-4">
                        {/* GitHub Report */}
                        {report.report_type === 'github' && fullReportData.ai_analysis && (
                          <>
                            {/* Summary */}
                            <div className="bg-white/5 rounded-xl p-4">
                              <h4 className="text-sm font-medium text-white/70 mb-2">AI Summary</h4>
                              <p className="text-white/80">{fullReportData.ai_analysis.summary}</p>
                            </div>

                            {/* Strengths */}
                            {fullReportData.ai_analysis.strengths?.length > 0 && (
                              <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/10">
                                <h4 className="text-sm font-medium text-green-400 mb-2">Strengths</h4>
                                <ul className="space-y-1">
                                  {fullReportData.ai_analysis.strengths.map((s: string, i: number) => (
                                    <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                                      <span className="text-green-400">✓</span> {s}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Top Improvements */}
                            {fullReportData.ai_analysis.improvements?.slice(0, 3).map((imp: any, i: number) => (
                              <div key={i} className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                    imp.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                                    imp.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                    'bg-green-500/10 text-green-400'
                                  }`}>
                                    {imp.priority}
                                  </span>
                                  <span className="text-xs text-white/40">{imp.category}</span>
                                </div>
                                <p className="text-sm text-white/90 font-medium">{imp.issue}</p>
                                <p className="text-sm text-white/60 mt-1">{imp.suggestion}</p>
                              </div>
                            ))}

                            {/* Metrics */}
                            {fullReportData.metrics && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-white/5 rounded-lg p-3 text-center">
                                  <div className="text-xl font-bold text-yellow-400">{fullReportData.metrics.total_stars}</div>
                                  <div className="text-[10px] text-white/40">Stars</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 text-center">
                                  <div className="text-xl font-bold">{fullReportData.metrics.total_forks}</div>
                                  <div className="text-[10px] text-white/40">Forks</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 text-center">
                                  <div className="text-xl font-bold">{fullReportData.metrics.original_repos}</div>
                                  <div className="text-[10px] text-white/40">Original Repos</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 text-center">
                                  <div className="text-xl font-bold">{fullReportData.profile?.followers || 0}</div>
                                  <div className="text-[10px] text-white/40">Followers</div>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/* LinkedIn Report */}
                        {report.report_type === 'linkedin' && (
                          <>
                            {/* Summary */}
                            {fullReportData.overall_summary && (
                              <div className="bg-white/5 rounded-xl p-4">
                                <h4 className="text-sm font-medium text-white/70 mb-2">Summary</h4>
                                <p className="text-white/80">{fullReportData.overall_summary}</p>
                              </div>
                            )}

                            {/* Sections */}
                            {fullReportData.sections?.slice(0, 4).map((section: any, i: number) => (
                              <div key={i} className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-sm font-medium text-white/90">{section.name}</h4>
                                  <span className={`text-xs font-mono ${
                                    section.score >= 80 ? 'text-green-400' :
                                    section.score >= 60 ? 'text-yellow-400' :
                                    'text-red-400'
                                  }`}>
                                    {section.score}/100
                                  </span>
                                </div>
                                {section.suggestions?.slice(0, 2).map((sug: string, j: number) => (
                                  <p key={j} className="text-sm text-white/60 mt-1">→ {sug}</p>
                                ))}
                              </div>
                            ))}

                            {/* Quick Wins */}
                            {fullReportData.quick_wins?.length > 0 && (
                              <div className="bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/10">
                                <h4 className="text-sm font-medium text-yellow-400 mb-2">⚡ Quick Wins</h4>
                                <ul className="space-y-1">
                                  {fullReportData.quick_wins.slice(0, 3).map((win: string, i: number) => (
                                    <li key={i} className="text-sm text-white/70">{i + 1}. {win}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Headlines */}
                            {fullReportData.headline_suggestions?.length > 0 && (
                              <div className="bg-white/5 rounded-xl p-4">
                                <h4 className="text-sm font-medium text-white/70 mb-2">Headline Suggestions</h4>
                                {fullReportData.headline_suggestions.slice(0, 2).map((hl: string, i: number) => (
                                  <p key={i} className="text-sm text-white/80 bg-black/20 rounded-lg p-2 mt-2 font-mono">
                                    &ldquo;{hl}&rdquo;
                                  </p>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-white/40 text-center py-4">Failed to load report details</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
