'use client'

import { useState, useMemo } from 'react'
import countryList from 'react-select-country-list'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  MONTH_OPTIONS,
  YEAR_OPTIONS,
} from '@/app/(frontend)/(aet-app)/components/DegreeEquivalencyForm/constants'
import { DegreeEquivalencyAI } from '@/app/(frontend)/(aet-app)/components/DegreeEquivalencyForm/degree-equivalency-ai'
import { Loader2 } from 'lucide-react'

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
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-bold">Degree Equivalency AI Tester</h1>
      <p className="text-lg text-muted-foreground"></p>
      <div className="max-w-7xl mx-auto p-4">
        {/* Use items-start to align the cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          {/* No h-full  */}
          <Card className="p-8 flex flex-col">
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl font-bold">Input Education Information</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="school_name" className="text-lg">
                    School Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="school_name"
                    name="school_name"
                    value={form.school_name}
                    onChange={handleInput}
                    placeholder="Enter full school name"
                    required
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="country_of_study" className="text-lg">
                    Study Country<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.country_of_study}
                    onValueChange={(v) => handleSelect('country_of_study', v)}
                  >
                    <SelectTrigger className="h-12 text-lg">
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

                <div className="space-y-3">
                  <Label htmlFor="degree_obtained" className="text-lg">
                    Degree Obtained<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="degree_obtained"
                    name="degree_obtained"
                    value={form.degree_obtained}
                    onChange={handleInput}
                    placeholder="e.g.: Bachelor of Science"
                    required
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-lg">
                    Study Period<span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={form.study_start_date.month}
                      onValueChange={(v) => handleSelect('study_start_date.month', v)}
                    >
                      <SelectTrigger className="h-12 text-lg">
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
                      <SelectTrigger className="h-12 text-lg">
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
                  </div>
                  <div className="text-center text-lg">to</div>
                  <div className="flex gap-2">
                    <Select
                      value={form.study_end_date.month}
                      onValueChange={(v) => handleSelect('study_end_date.month', v)}
                    >
                      <SelectTrigger className="h-12 text-lg">
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
                      <SelectTrigger className="h-12 text-lg">
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

                <div className="space-y-3">
                  <Label htmlFor="diploma" className="text-lg">
                    Diploma (Image: jpg, png, jpeg, webp)
                  </Label>
                  <Input
                    id="diploma"
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="h-12 text-lg"
                  />
                </div>
              </CardContent>
              <CardContent>
                <Button type="submit" disabled={loading} className="w-full h-12 text-lg">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Test AI'
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>

          {/* Output Section */}
          <Card className="p-8 h-fit sticky top-8">
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl font-bold">AI Result</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
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
              ) : (
                <div className="text-lg text-gray-500 text-center py-8">
                  Enter education information and click Test AI to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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
