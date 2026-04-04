'use client'

import React, { useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  Github, Loader2, ArrowLeft, Star, GitFork, Users, MapPin, Building2, Link as LinkIcon,
  Twitter, CheckCircle2, AlertCircle, Lightbulb, Code2, BookOpen, TrendingUp, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function GitHubEnhancerPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyzeProfile = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/github/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ username: username.trim() })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to analyze profile')
      }

      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20'
      default: return 'text-white/60 bg-white/5 border-white/10'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
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
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold">GitHub Profile Enhancer</h1>
                <p className="text-xs text-white/50">AI-powered profile optimization</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <label className="block text-sm font-medium text-white/70 mb-2">
              GitHub Username
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && analyzeProfile()}
                  placeholder="username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-8 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <Button
                onClick={analyzeProfile}
                disabled={loading}
                className="px-6 bg-white hover:bg-gray-200 text-black font-medium rounded-xl"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
              </Button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Profile Card */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={result.profile.avatar_url}
                  alt={result.username}
                  className="w-24 h-24 rounded-2xl border border-white/10"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{result.profile.name || result.username}</h2>
                      <a
                        href={result.profile.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/50 hover:text-white/70 text-sm flex items-center gap-1"
                      >
                        @{result.username} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-right">
                      <div className={`text-4xl font-bold ${getScoreColor(result.ai_analysis.overall_score)}`}>
                        {result.ai_analysis.overall_score}
                      </div>
                      <div className="text-xs text-white/50">Profile Score</div>
                    </div>
                  </div>
                  
                  {result.profile.bio && (
                    <p className="mt-3 text-white/70">{result.profile.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/50">
                    {result.profile.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" /> {result.profile.company}
                      </span>
                    )}
                    {result.profile.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {result.profile.location}
                      </span>
                    )}
                    {result.profile.blog && (
                      <a href={result.profile.blog.startsWith('http') ? result.profile.blog : `https://${result.profile.blog}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white/70">
                        <LinkIcon className="w-4 h-4" /> Website
                      </a>
                    )}
                    {result.profile.twitter && (
                      <a href={`https://twitter.com/${result.profile.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white/70">
                        <Twitter className="w-4 h-4" /> @{result.profile.twitter}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold">{result.profile.followers}</div>
                  <div className="text-xs text-white/50">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{result.profile.following}</div>
                  <div className="text-xs text-white/50">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{result.profile.public_repos}</div>
                  <div className="text-xs text-white/50">Repos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{result.metrics.total_stars}</div>
                  <div className="text-xs text-white/50">Total Stars</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{result.metrics.total_forks}</div>
                  <div className="text-xs text-white/50">Total Forks</div>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" /> AI Analysis
              </h3>
              <p className="text-white/70 leading-relaxed">{result.ai_analysis.summary}</p>
              
              {/* Strengths */}
              {result.ai_analysis.strengths?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-green-400 mb-3">Strengths</h4>
                  <div className="space-y-2">
                    {result.ai_analysis.strengths.map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Improvements */}
            {result.ai_analysis.improvements?.length > 0 && (
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" /> Improvement Suggestions
                </h3>
                <div className="space-y-4">
                  {result.ai_analysis.improvements.map((imp: any, i: number) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono border ${getPriorityColor(imp.priority)}`}>
                          {imp.priority}
                        </span>
                        <span className="text-xs text-white/40 uppercase tracking-wider">{imp.category}</span>
                      </div>
                      <p className="text-white/90 font-medium">{imp.issue}</p>
                      <p className="text-white/60 text-sm mt-2">{imp.suggestion}</p>
                      {imp.example && (
                        <div className="mt-3 bg-black/30 rounded-lg p-3 text-sm font-mono text-green-400/80">
                          {imp.example}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bio Suggestion */}
            {result.ai_analysis.bio_suggestion && (
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" /> Suggested Bio
                </h3>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-white/90">{result.ai_analysis.bio_suggestion}</p>
                </div>
              </div>
            )}

            {/* Top Languages */}
            {Object.keys(result.metrics.languages).length > 0 && (
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-400" /> Top Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(result.metrics.languages).map(([lang, count]: [string, any]) => (
                    <span key={lang} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm">
                      {lang} <span className="text-white/40">({count})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Top Repos */}
            {result.top_repos?.length > 0 && (
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Github className="w-5 h-5" /> Top Repositories
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.top_repos.map((repo: any) => (
                    <a
                      key={repo.name}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                          {repo.name}
                        </h4>
                        <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/50" />
                      </div>
                      {repo.description && (
                        <p className="text-sm text-white/50 mt-1 line-clamp-2">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" /> {repo.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" /> {repo.forks}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  )
}
