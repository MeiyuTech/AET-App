'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

interface GradeInfo {
  grade: string
  count: number
  credits: number
}

interface GPAResult {
  finalGPA: number
  totalCredits: number
  gradeDistribution: Record<string, GradeInfo>
}

// GPA Calculation
const GRADE_POINTS: Record<string, number> = {
  // 4.35 is the highest GPA possible
  'A+': 4.35,
  A: 4.0,
  'A-': 3.65,
  'B+': 3.35,
  B: 3.0,
  'B-': 2.65,
  'C+': 2.35,
  C: 2.0,
  'C-': 1.65,
  'D+': 1.35,
  D: 1.0,
  'D-': 0.65,
  F: 0.0,
  FAIL: 0.0,
  WF: 0.0,
  P: 0.0,
  PASS: 0.0,
  CR: 0.0,
}

// Grades that don't count towards GPA but count for credits
const NON_GPA_GRADES = ['P', 'PASS', 'CR']

// Grade aliases for normalization
const GRADE_ALIASES: Record<string, string> = {
  FAIL: 'F',
  PASS: 'P',
}

const GPACalculator = () => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<GPAResult | null>(null)

  const normalizeGrade = (grade: string): string => {
    const upperGrade = grade.toUpperCase().trim()
    return GRADE_ALIASES[upperGrade] || upperGrade
  }

  const calculateGPA = () => {
    const lines = input.trim().split('\n')
    let totalPoints = 0
    let totalCredits = 0
    let gpaCredits = 0 // Credits that count towards GPA
    const gradeDistribution: Record<string, GradeInfo> = {}

    // Initialize grade distribution
    Object.keys(GRADE_POINTS).forEach((grade) => {
      if (!GRADE_ALIASES[grade]) {
        // Don't initialize aliases
        gradeDistribution[grade] = {
          grade,
          count: 0,
          credits: 0,
        }
      }
    })

    const parseGradeInfo = (line: string) => {
      // Try to split by tab
      let parts = line.trim().split('\t')

      // If split is not 3 parts, try multiple spaces
      if (parts.length !== 3) {
        // Replace multiple consecutive spaces with a single space, then split
        parts = line.trim().replace(/\s+/g, ' ').split(' ')
      }

      // Search from back to front for grade and credits
      if (parts.length >= 3) {
        // Find the last part as grade
        const rawGrade = parts[parts.length - 1].trim()
        const grade = normalizeGrade(rawGrade)

        // Find the second-to-last number as credits
        let creditsStr = ''
        let creditsFound = false

        for (let i = parts.length - 2; i >= 0; i--) {
          const part = parts[i].trim()
          if (!creditsFound && !isNaN(parseFloat(part))) {
            creditsStr = part
            creditsFound = true
            break
          }
        }

        if (creditsFound && GRADE_POINTS[grade] !== undefined) {
          const credits = parseFloat(creditsStr)
          return { credits, grade }
        }
      }
      return null
    }

    lines.forEach((line) => {
      if (line.trim()) {
        const result = parseGradeInfo(line)
        if (result) {
          const { credits, grade } = result
          const gradePoint = GRADE_POINTS[grade]

          if (!isNaN(credits) && gradePoint !== undefined) {
            // Add to total credits for all valid grades
            totalCredits += credits

            // Only add to GPA calculation if it's not a non-GPA grade
            if (!NON_GPA_GRADES.includes(grade)) {
              totalPoints += credits * gradePoint
              gpaCredits += credits
            }

            // Update grade distribution using normalized grade
            const normalizedGrade = GRADE_ALIASES[grade] || grade
            gradeDistribution[normalizedGrade].count++
            gradeDistribution[normalizedGrade].credits += credits
          }
        }
      }
    })

    setResult({
      finalGPA: gpaCredits > 0 ? totalPoints / gpaCredits : 0,
      totalCredits,
      gradeDistribution,
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Input Section */}
        <Card className="p-8 h-full flex flex-col">
          <h2 className="text-2xl font-bold mb-6">Enter Course Information</h2>
          <div className="text-base text-gray-600 mb-6 space-y-4">
            {/* <p className="text-lg">
              Format: Course Name [Tab or Spaces] Credits [Tab or Spaces] Grade
            </p> */}
            <div className="mt-6">
              <p className="text-xl font-semibold mb-3">Grade Points:</p>
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-lg">
                <div>A+ = 4.35 (Highest possible)</div>
                <div>C = 2.00</div>
                <div>A = 4.00</div>
                <div>C- = 1.65</div>
                <div>A- = 3.65</div>
                <div>D+ = 1.35</div>
                <div>B+ = 3.35</div>
                <div>D = 1.00</div>
                <div>B = 3.00</div>
                <div>D- = 0.65</div>
                <div>B- = 2.65</div>
                <div>F/Fail = 0.00 (counts in GPA)</div>
                <div>C+ = 2.35</div>
                <div>P/Pass/CR = credits only (not in GPA)</div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xl font-semibold mb-3">Examples:</p>
              <pre className="bg-gray-50 p-4 rounded text-lg">
                College English 2.50 C Advanced Mathematics 3.00 B+
              </pre>
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-mono text-lg h-72"
            placeholder="Example:
College English 2.50 C
Advanced Mathematics	3.00	B+"
          />
          <Button onClick={calculateGPA} className="mt-6 text-lg px-6 py-3">
            Calculate GPA
          </Button>
        </Card>

        {/* Output Section - Always show the card but conditionally show content */}
        <Card className="p-8 h-fit sticky top-8">
          <h2 className="text-2xl font-bold mb-6">GPA Summary</h2>
          {result ? (
            <pre className="whitespace-pre font-mono text-lg leading-tight">
              {`======   GPA SUMMARY  ====== 
Final GPA: ${result.finalGPA.toFixed(6)} 
Final Total Credits/Units: ${result.totalCredits.toFixed(3)} 
---------------------------------------------- 
      Occurrences    Subtotal Course Credits 
---------------------------------------------- ${Object.entries(result.gradeDistribution)
                .map(([grade, info]) => {
                  if (grade === 'WF') return ''
                  if (grade === 'F')
                    return `\nF/WF\t${info.count + (result.gradeDistribution['WF']?.count || 0)}\t\t${(info.credits + (result.gradeDistribution['WF']?.credits || 0)).toFixed(2)}\t  \n----------------------------------------------`
                  if (grade === 'CR') return ''
                  if (grade === 'P')
                    return `\nP/CR\t${info.count + (result.gradeDistribution['CR']?.count || 0)}\t\t${(info.credits + (result.gradeDistribution['CR']?.credits || 0)).toFixed(2)}\t  \n----------------------------------------------`
                  if (
                    !['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-'].includes(
                      grade
                    )
                  )
                    return ''
                  return `\n${grade}\t${info.count}\t\t${info.credits.toFixed(2)}\t  \n----------------------------------------------`
                })
                .join('')}`}
            </pre>
          ) : (
            <div className="text-lg text-gray-500 text-center py-8">
              Enter course information and click Calculate GPA to see results
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default GPACalculator
