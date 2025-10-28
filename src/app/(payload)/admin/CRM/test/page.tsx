'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Search,
  Download,
  FileSpreadsheet,
  Plus,
  Upload,
  Calculator,
  GraduationCap,
  CalendarIcon,
  Users,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/utilities/cn'

const applications = [
  {
    id: 'c33408fc-7d57-4053-8373-d3d5640514ef',
    createdAt: '2025-10-08 15:06:31',
    updatedAt: '2025-10-08 15:31:18',
    office: 'Los Angeles',
    evaluee: 'Mr. FEI YAN',
    purpose: 'evaluation-uscis',
    educations: 2,
    services: 3,
    files: 5,
    status: 'Processing',
    estimatedDate: '2025-10-17',
    daysRemaining: 7,
    progress: 65,
    dueAmount: 110.0,
    paymentStatus: 'Paid',
    paidDate: '2025-10-08 15:31:18',
    paymentId: 'pi_3SG5t9JMcR2Xlhyn17kBRq8',
    source: 'internal',
    email: 'fei.yan@example.com',
    phone: '+1 (555) 123-4567',
  },
  {
    id: '6ae19b08-6a25-4053-8db3-c2aca37f611d',
    createdAt: '2025-10-08 10:45:19',
    updatedAt: '2025-10-08 10:45:19',
    office: 'San Francisco',
    evaluee: 'Mr. Calvin Abonga',
    purpose: 'evaluation-uscis',
    educations: 1,
    services: 2,
    files: 3,
    status: 'Submitted',
    estimatedDate: null,
    daysRemaining: null,
    progress: 0,
    dueAmount: null,
    paymentStatus: 'Pending',
    paidDate: null,
    paymentId: null,
    source: 'internal',
    email: 'calvin.abonga@example.com',
    phone: '+1 (555) 234-5678',
  },
  {
    id: '4e6b8fca-b972-448d-a9b4-4a1906de8409',
    createdAt: '2025-10-08 10:35:11',
    updatedAt: '2025-10-08 11:07:27',
    office: 'Miami',
    evaluee: 'Ms. Leyanis Ricano Perez',
    purpose: 'evaluation-education',
    educations: 3,
    services: 2,
    files: 8,
    status: 'In Progress',
    estimatedDate: '2025-10-17',
    daysRemaining: 7,
    progress: 45,
    dueAmount: 185.0,
    paymentStatus: 'Paid',
    paidDate: '2025-10-08 11:07:27',
    paymentId: 'pi_3SG1fnJMcR2Xlhyn0Wh9coQM',
    source: 'internal',
    email: 'leyanis.perez@example.com',
    phone: '+1 (555) 345-6789',
  },
  {
    id: '9a133a58-a199-48fc-a6d8-b131fe1e0ba7',
    createdAt: '2025-10-08 09:43:20',
    updatedAt: '2025-10-08 09:13:20',
    office: 'Miami',
    evaluee: 'Mr. Makoto Tamura',
    purpose: 'evaluation-education',
    educations: 2,
    services: 1,
    files: 4,
    status: 'Submitted',
    estimatedDate: '2025-10-10',
    daysRemaining: 0,
    progress: 100,
    dueAmount: 160.0,
    paymentStatus: 'Paid',
    paidDate: '2025-10-08 09:13:19',
    paymentId: null,
    source: 'internal',
    email: 'makoto.tamura@example.com',
    phone: '+1 (555) 456-7890',
  },
]

export default function CRMDashboard() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
      case 'Submitted':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20'
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
      case 'Completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      case 'Pending':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-16 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <Image src="/icon.svg" alt="AET Logo" width={60} height={32} />
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                  AET Services Applications
                </h1>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
                Welcome{' '}
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  tech@meiyugroup.org
                </span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-16 py-2">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            variant="outline"
            className="h-auto py-3 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/30 transition-all bg-transparent rounded-xl"
          >
            <Plus className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-lg">Create Payment Link</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/30 transition-all bg-transparent rounded-xl"
          >
            <Upload className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-lg">Import Orders</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 flex-col gap-2 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950/30 transition-all bg-transparent rounded-xl"
          >
            <Calculator className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-lg">GPA Calculator</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 flex-col gap-2 hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-950/30 transition-all bg-transparent rounded-xl"
          >
            <GraduationCap className="h-5 w-5 text-amber-600" />
            <span className="font-semibold text-lg">Degree Equivalency</span>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications" className="mb-8">
          {/* Tabs List */}
          <TabsList className="bg-white dark:bg-slate-900 border h-auto rounded-xl grid w-full grid-cols-3">
            <TabsTrigger
              value="applications"
              className="gap-1 px-2 py-2 text-sm sm:gap-2 sm:px-4 sm:py-3 sm:text-base rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border-blue-600"
            >
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Applications</span>
              <span className="sm:hidden">Apps</span>
            </TabsTrigger>
            <TabsTrigger
              value="payment-links"
              className="gap-1 px-2 py-2 text-sm sm:gap-2 sm:px-4 sm:py-3 sm:text-base rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border-blue-600"
            >
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Payment Links</span>
              <span className="sm:hidden">Pay</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                Beta
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="degree-equivalency"
              className="gap-1 px-2 py-2 text-sm sm:gap-2 sm:px-4 sm:py-3 sm:text-base rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border-blue-600"
            >
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Degree Equivalency</span>
              <span className="sm:hidden">Degree</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                Beta
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6 mt-6">
            {/* Summary Cards */}
            <Card className="border border-slate-200 bg-white shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">
                  Total Due Amount Summary (Paid Applications)
                </CardTitle>
                <CardDescription className="text-lg">
                  Filter by date range to view payment statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div className="space-y-2">
                    <label className="text-lg font-medium text-slate-700 dark:text-slate-300">
                      Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal rounded-xl',
                            !startDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xl">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label className="text-lg font-medium text-slate-700 dark:text-slate-300">
                      End Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal rounded-xl',
                            !endDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xl">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-lg font-medium text-slate-600 dark:text-slate-400">
                        Total Paid Applications
                      </span>
                    </div>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">0</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="p-2 bg-green-600 rounded-lg">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-lg font-medium text-slate-600 dark:text-slate-400">
                        Total Due Amount (Paid)
                      </span>
                    </div>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">$0.00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications Table */}
            <Card className="border border-slate-200 bg-white shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Applications</CardTitle>
                    <CardDescription className="text-lg">
                      Manage and track all service applications
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search all columns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 text-lg rounded-xl"
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent rounded-xl"
                        >
                          <Download className="h-4 w-4" />
                          <span className="text-lg">Export</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="gap-2 rounded-lg">
                          <FileSpreadsheet className="h-4 w-4" />
                          <span className="text-lg">Export to Excel</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 rounded-lg">
                          <FileText className="h-4 w-4" />
                          <span className="text-lg">Export to CSV</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead className="font-semibold text-lg">Evaluee Name</TableHead>
                        <TableHead className="font-semibold text-lg">Office</TableHead>
                        <TableHead className="font-semibold text-lg">Status</TableHead>
                        <TableHead className="font-semibold text-lg">Due Amount</TableHead>
                        <TableHead className="font-semibold text-lg">Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <>
                          <TableRow
                            key={app.id}
                            className="hover:bg-slate-50 dark:hover:bg-slate-900/30 cursor-pointer"
                            onClick={() => toggleRow(app.id)}
                          >
                            <TableCell className="py-3">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-lg">
                                {expandedRows.has(app.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="flex flex-col">
                                <span className="font-medium text-lg text-slate-900 dark:text-white">
                                  {app.evaluee}
                                </span>
                                <span className="text-base text-slate-500 font-mono">
                                  {app.id.substring(0, 8)}...
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3">
                              <Badge variant="outline" className="font-normal text-lg rounded-lg">
                                {app.office}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'font-medium text-lg rounded-lg',
                                  getStatusColor(app.status)
                                )}
                              >
                                {app.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3">
                              {app.dueAmount ? (
                                <span className="font-semibold text-lg text-slate-900 dark:text-white">
                                  ${app.dueAmount.toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-lg">N/A</span>
                              )}
                            </TableCell>
                            <TableCell className="py-3">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'font-medium text-lg rounded-lg',
                                  getPaymentStatusColor(app.paymentStatus)
                                )}
                              >
                                {app.paymentStatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                          {expandedRows.has(app.id) && (
                            <TableRow className="bg-slate-50/50 dark:bg-slate-900/20">
                              <TableCell colSpan={6} className="p-0">
                                <div className="px-5 py-3 grid grid-cols-2 md:grid-cols-4 gap-4 border-t">
                                  <div>
                                    <label className="text-base text-slate-500 font-medium">
                                      Created At
                                    </label>
                                    <p className="text-lg mt-1">{app.createdAt}</p>
                                  </div>
                                  <div>
                                    <label className="text-base text-slate-500 font-medium">
                                      Updated At
                                    </label>
                                    <p className="text-lg mt-1">{app.updatedAt}</p>
                                  </div>
                                  <div>
                                    <label className="text-base text-slate-500 font-medium">
                                      Purpose
                                    </label>
                                    <p className="text-lg mt-1">{app.purpose}</p>
                                  </div>
                                  <div>
                                    <label className="text-base text-slate-500 font-medium">
                                      Source
                                    </label>
                                    <p className="text-lg mt-1">{app.source}</p>
                                  </div>
                                  <div>
                                    <label className="text-base text-slate-500 font-medium">
                                      Educations
                                    </label>
                                    <p className="text-lg mt-1">{app.educations} items</p>
                                  </div>
                                  <div>
                                    <label className="text-base text-slate-500 font-medium">
                                      Services
                                    </label>
                                    <p className="text-lg mt-1">{app.services} items</p>
                                  </div>
                                  <div>
                                    <label className="text-base text-slate-500 font-medium">
                                      Files
                                    </label>
                                    <p className="text-lg mt-1">{app.files} files</p>
                                  </div>
                                  {app.estimatedDate && (
                                    <div>
                                      <label className="text-base text-slate-500 font-medium">
                                        Est. Completion
                                      </label>
                                      <p className="text-lg mt-1 flex items-center gap-1">
                                        {app.estimatedDate}
                                        {app.daysRemaining !== null && (
                                          <span className="text-base text-slate-500">
                                            ({app.daysRemaining}d)
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  )}
                                  {app.paidDate && (
                                    <div>
                                      <label className="text-base text-slate-500 font-medium">
                                        Paid Date
                                      </label>
                                      <p className="text-lg mt-1">{app.paidDate}</p>
                                    </div>
                                  )}
                                  {app.paymentId && (
                                    <div className="col-span-2">
                                      <label className="text-base text-slate-500 font-medium">
                                        Payment ID
                                      </label>
                                      <p className="text-lg font-mono mt-1">{app.paymentId}</p>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-links">
            <Card>
              <CardHeader>
                <CardTitle>Payment Links</CardTitle>
                <CardDescription>Manage payment links for applications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-slate-500 py-8">
                  Payment links content coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="degree-equivalency">
            <Card>
              <CardHeader>
                <CardTitle>Degree Equivalency</CardTitle>
                <CardDescription>Manage degree equivalency evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-slate-500 py-8">
                  Degree equivalency content coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
