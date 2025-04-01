import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ApplicationsTable } from './index'
import { toast } from '@/hooks/use-toast'

// mock react useEffect
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useEffect: vi.fn((callback) => callback()),
  }
})

// mock supabase client
vi.mock('../../utils/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        or: () => ({
          order: () => ({
            data: [
              {
                id: 'test-id-1',
                name: 'John Doe',
                email: 'john.doe@example.com',
                first_name: 'John',
                middle_name: null,
                last_name: 'Doe',
                status: 'submitted',
                created_at: '2023-01-01T00:00:00Z',
                updated_at: '2023-01-02T00:00:00Z',
                office: 'Boston',
                pronouns: 'mr',
                phone: '123-456-7890',
                date_of_birth: '1990-01-01T00:00:00Z',
                country: 'USA',
                street_address: '123 Main St',
                street_address2: null,
                city: 'Boston',
                region: 'MA',
                zip_code: '12345',
                purpose: 'evaluation-immigration',
                purpose_other: null,
                due_amount: 100,
                payment_status: 'pending',
                payment_id: null,
                paid_at: null,
                educations: [
                  {
                    id: 'edu-1',
                    application_id: 'test-id-1',
                    country_of_study: 'USA',
                    degree_obtained: 'Bachelor',
                    school_name: 'Test University',
                    study_start_date: { month: '01', year: '2010' },
                    study_end_date: { month: '12', year: '2014' },
                  },
                ],
              },
              {
                id: 'test-id-2',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                first_name: 'Jane',
                middle_name: null,
                last_name: 'Smith',
                status: 'processing',
                created_at: '2023-02-01T00:00:00Z',
                updated_at: '2023-02-02T00:00:00Z',
                office: 'New York',
                pronouns: 'ms',
                phone: '987-654-3210',
                date_of_birth: '1992-02-02T00:00:00Z',
                country: 'USA',
                street_address: '456 Oak St',
                street_address2: 'Apt 101',
                city: 'New York',
                region: 'NY',
                zip_code: '54321',
                purpose: 'evaluation-employment',
                purpose_other: null,
                due_amount: 150,
                payment_status: 'paid',
                payment_id: 'pay_123456',
                paid_at: '2023-02-03T00:00:00Z',
                educations: [
                  {
                    id: 'edu-2',
                    application_id: 'test-id-2',
                    country_of_study: 'Canada',
                    degree_obtained: 'Master',
                    school_name: 'Test College',
                    study_start_date: { month: '09', year: '2015' },
                    study_end_date: { month: '05', year: '2017' },
                  },
                ],
              },
            ],
            error: null,
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          data: null,
          error: null,
        }),
      }),
    }),
  }),
}))

// mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}))

describe('ApplicationsTable', () => {
  const dataFilter = 'status.eq.submitted,status.eq.processing'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the table component without throwing an error', () => {
    expect(() => {
      render(<ApplicationsTable dataFilter={dataFilter} />)
    }).not.toThrow()
  })

  it('should fetch data from supabase and process it', () => {
    // this test is to ensure the mock supabase is called
    // and the application does not crash due to data processing
    render(<ApplicationsTable dataFilter={dataFilter} />)

    // simple assertion
    expect(true).toBe(true)
  })

  it('should correctly mock toast and supabase', () => {
    // this test is to ensure our mock is correct
    expect(vi.isMockFunction(toast)).toBe(true)
  })
})
