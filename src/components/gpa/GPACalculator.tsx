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
  WF: 0.0,
  P: 0.0,
  CR: 0.0,
}

const GPACalculator = () => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<GPAResult | null>(null)

  const calculateGPA = () => {
    const lines = input.trim().split('\n')
    let totalPoints = 0
    let totalCredits = 0
    const gradeDistribution: Record<string, GradeInfo> = {}

    // Initialize grade distribution
    Object.keys(GRADE_POINTS).forEach((grade) => {
      gradeDistribution[grade] = {
        grade,
        count: 0,
        credits: 0,
      }
    })

    lines.forEach((line) => {
      const parts = line.trim().split('\t')
      if (parts.length >= 3) {
        const credits = parseFloat(parts[1])
        const grade = parts[2].trim()
        const gradePoint = GRADE_POINTS[grade]

        if (!isNaN(credits) && gradePoint !== undefined) {
          totalPoints += credits * gradePoint
          totalCredits += credits
          gradeDistribution[grade].count++
          gradeDistribution[grade].credits += credits
        }
      }
    })

    setResult({
      finalGPA: totalCredits > 0 ? totalPoints / totalCredits : 0,
      totalCredits,
      gradeDistribution,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Enter Course Information</h2>
        <p className="text-sm text-gray-600 mb-2">Format: Course Name [Tab] Credits [Tab] Grade</p>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-mono h-64"
          placeholder="Example:
Neurobiology of Degeneration and Repair	3.75	B+"
        />
        <Button onClick={calculateGPA} className="mt-4">
          Calculate GPA
        </Button>
      </Card>

      {result && (
        <Card className="p-6">
          <pre className="whitespace-pre font-mono text-sm">
            {`======   GPA SUMMARY  ====== 
Final GPA: ${result.finalGPA.toFixed(6)} 
Final Total Credits/Units: ${result.totalCredits.toFixed(3)} 
---------------------------------------------- 
      Occurrences    Subtotal Course Credits 
---------------------------------------------- ${Object.entries(result.gradeDistribution)
              .map(([grade, info]) => {
                // Combine F and WF into one line
                if (grade === 'WF') return ''
                if (grade === 'F')
                  return `\nF/WF\t${info.count + (result.gradeDistribution['WF']?.count || 0)}\t\t${(info.credits + (result.gradeDistribution['WF']?.credits || 0)).toFixed(2)}\t  \n----------------------------------------------`
                // Combine P and CR into one line
                if (grade === 'CR') return ''
                if (grade === 'P')
                  return `\nP/CR\t${info.count + (result.gradeDistribution['CR']?.count || 0)}\t\t${(info.credits + (result.gradeDistribution['CR']?.credits || 0)).toFixed(2)}\t  \n----------------------------------------------`
                // Skip if it's not a standard grade
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
          <Button
            onClick={() => {
              const textArea = document.createElement('textarea')
              textArea.value = `======   GPA SUMMARY  ====== 
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
                .join('')}`
              document.body.appendChild(textArea)
              textArea.select()
              document.execCommand('copy')
              document.body.removeChild(textArea)
            }}
            className="mt-4"
          >
            Copy to Clipboard
          </Button>
        </Card>
      )}
    </div>
  )
}

export default GPACalculator
