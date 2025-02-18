'use client'

export type Office = {
  id: string
  name: string
}

const offices: Office[] = [
  { id: 'boston', name: 'Boston' },
  { id: 'newyork', name: 'New York' },
  { id: 'miami', name: 'Miami' },
  { id: 'sanfrancisco', name: 'San Francisco' },
  { id: 'losangeles', name: 'Los Angeles' },
]

interface OfficeSelectorProps {
  onOfficeSelect: (office: Office) => void
  selectedOffice?: Office
}

export default function OfficeSelector({ onOfficeSelect, selectedOffice }: OfficeSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Office Location</label>
      <select
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        value={selectedOffice?.id || ''}
        onChange={(e) => {
          const selected = offices.find((office) => office.id === e.target.value)
          if (selected) {
            onOfficeSelect(selected)
          }
        }}
      >
        <option value="">Select an office</option>
        {offices.map((office) => (
          <option key={office.id} value={office.id}>
            {office.name}
          </option>
        ))}
      </select>
    </div>
  )
}
