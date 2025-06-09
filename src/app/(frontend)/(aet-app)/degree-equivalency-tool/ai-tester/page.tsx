'use client'

import { useState, useMemo } from 'react'
import countryList from 'react-select-country-list'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MONTH_OPTIONS,
  YEAR_OPTIONS,
} from '@/app/(frontend)/(aet-app)/components/DegreeEquivalencyForm/constants'
import { DegreeEquivalencyAI } from '@/app/(frontend)/(aet-app)/components/DegreeEquivalencyForm/degree-equivalency-ai'

export default function DegreeEquivalencyAITester() {
  const countries = useMemo(() => countryList().getData(), [])
  const [form, setForm] = useState({
    school_name: '',
    country_of_study: '',
    degree_obtained: '',
    study_start_date: { month: '', year: '' },
    study_end_date: { month: '', year: '' },
  })
  const [file, setFile] = useState<File | null>(null)
  const [ocrText, setOcrText] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelect = (name: string, value: string) => {
    if (name.startsWith('study_start_date') || name.startsWith('study_end_date')) {
      const [key, sub] = name.split('.')
      setForm({
        ...form,
        [key]: { ...form[key as 'study_start_date' | 'study_end_date'], [sub]: value },
      })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setOcrText('')
    setSubmitted(false)
    let ocr = ''
    if (file) {
      const base64 = await fileToBase64(file)
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image: base64.split(',')[1] }),
      })
      const data = await res.json()
      ocr = data.text || ''
      setOcrText(ocr)
    }
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Degree Equivalency AI Tester</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-medium">School Name</label>
              <Input
                name="school_name"
                value={form.school_name}
                onChange={handleInput}
                placeholder="Enter full school name"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Study Country</label>
              <Select
                value={form.country_of_study}
                onValueChange={(v) => handleSelect('country_of_study', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Degree Obtained</label>
              <Input
                name="degree_obtained"
                value={form.degree_obtained}
                onChange={handleInput}
                placeholder="e.g.: Bachelor of Science"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Study Period</label>
              <div className="flex gap-2">
                <Select
                  value={form.study_start_date.month}
                  onValueChange={(v) => handleSelect('study_start_date.month', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Start Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_OPTIONS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={form.study_start_date.year}
                  onValueChange={(v) => handleSelect('study_start_date.year', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Start Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map((y) => (
                      <SelectItem key={y.value} value={y.value}>
                        {y.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="self-center">to</span>
                <Select
                  value={form.study_end_date.month}
                  onValueChange={(v) => handleSelect('study_end_date.month', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="End Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_OPTIONS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={form.study_end_date.year}
                  onValueChange={(v) => handleSelect('study_end_date.year', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="End Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map((y) => (
                      <SelectItem key={y.value} value={y.value}>
                        {y.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Diploma (Image/PDF)</label>
              <Input type="file" accept="image/*,application/pdf" onChange={handleFile} />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Test AI'}
            </Button>
          </form>
        </CardContent>
      </Card>
      {submitted && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>AI Result</CardTitle>
            </CardHeader>
            <CardContent>
              <DegreeEquivalencyAI
                education={{
                  school_name: form.school_name,
                  country_of_study: form.country_of_study,
                  degree_obtained: form.degree_obtained,
                  study_start_date: form.study_start_date,
                  study_end_date: form.study_end_date,
                }}
                ocrText={ocrText}
                showReasoning={true}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
