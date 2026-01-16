"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowRight,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Database,
  Mail,
  Phone,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CRMConfigModal } from "@/components/crm-config-modal"
import { cn } from "@/lib/utils"

interface CRMIntegration {
  id: string
  name: string
  connected: boolean
  icon?: React.ReactNode
}

interface InternalDataSource {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

// CRM Provider Icons
const AffinityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
    {/* Four interconnected loop shapes */}
    <path
      d="M8 6C8 8.20914 9.79086 10 12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M18 12C18 14.2091 16.2091 16 14 16C11.7909 16 10 14.2091 10 12C10 9.79086 11.7909 8 14 8C16.2091 8 18 9.79086 18 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8 18C8 20.2091 9.79086 22 12 22C14.2091 22 16 20.2091 16 18C16 15.7909 14.2091 14 12 14C9.79086 14 8 15.7909 8 18Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M6 12C6 14.2091 7.79086 16 10 16C12.2091 16 14 14.2091 14 12C14 9.79086 12.2091 8 10 8C7.79086 8 6 9.79086 6 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
)

const AttioIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700 dark:text-gray-300">
    {/* Two overlapping angular arrow-like shapes */}
    <path
      d="M12 2L20 7V12L12 17L4 12V7L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />
    <path
      d="M8 10L12 7L16 10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 14L12 17L16 14"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const HubspotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M8 12L12 8L16 12L12 16L8 12Z" fill="currentColor" />
  </svg>
)

const SalesforceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
    />
    <path
      d="M2 17L12 22L22 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
    />
  </svg>
)

const getCRMIcon = (crmId: string) => {
  switch (crmId.toLowerCase()) {
    case "affinity":
      return <AffinityIcon />
    case "attio":
      return <AttioIcon />
    case "hubspot":
      return <HubspotIcon />
    case "salesforce":
      return <SalesforceIcon />
    default:
      return <Database className="h-5 w-5 text-muted-foreground" />
  }
}

const crmIntegrations: CRMIntegration[] = [
  { id: "notion", name: "Notion", connected: true },
  { id: "airtable", name: "Airtable", connected: true },
  { id: "affinity", name: "Affinity", connected: true, icon: <AffinityIcon /> },
  { id: "attio", name: "Attio", connected: true, icon: <AttioIcon /> },
  { id: "hubspot", name: "Hubspot", connected: true, icon: <HubspotIcon /> },
  { id: "pipedrive", name: "PipeDrive", connected: false },
  { id: "dealcloud", name: "DealCloud", connected: false },
  { id: "salesforce", name: "Salesforce", connected: false, icon: <SalesforceIcon /> },
]

const internalDataSources: InternalDataSource[] = [
  {
    id: "internal-crm",
    name: "CRM",
    description: "Any activities, notes, email correspondence can be included as part of the monitoring",
    icon: <Database className="h-5 w-5" />,
  },
  {
    id: "email",
    name: "Email",
    description: "Correspondence from company newsletters or founder correspondence",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    id: "call-notes",
    name: "Call Notes",
    description: "Call notes from founders",
    icon: <Phone className="h-5 w-5" />,
  },
  {
    id: "file-base",
    name: "File Base",
    description: "Specific company files held in Google Drive, SharePoint, Box, etc.",
    icon: <FileText className="h-5 w-5" />,
  },
]

export default function DataSourcesPage() {
  const router = useRouter()
  const [selectedCRMs, setSelectedCRMs] = React.useState<Set<string>>(new Set())
  const [selectedInternalSources, setSelectedInternalSources] = React.useState<Set<string>>(new Set())
  const [csvFile, setCsvFile] = React.useState<File | null>(null)
  const [urls, setUrls] = React.useState<string[]>([""])
  const [urlErrors, setUrlErrors] = React.useState<Record<number, string>>({})
  
  // Collapsible states
  const [crmExpanded, setCrmExpanded] = React.useState(false)
  const [csvExpanded, setCsvExpanded] = React.useState(false)
  const [urlExpanded, setUrlExpanded] = React.useState(false)
  const [internalExpanded, setInternalExpanded] = React.useState(false)
  
  // CRM Config Modal
  const [crmConfigModalOpen, setCrmConfigModalOpen] = React.useState(false)
  const [selectedCrmForConfig, setSelectedCrmForConfig] = React.useState<{ id: string; name: string } | null>(null)

  // Pre-select connected CRMs
  React.useEffect(() => {
    const connected = crmIntegrations.filter((crm) => crm.connected).map((crm) => crm.id)
    setSelectedCRMs(new Set(connected))
  }, [])

  const toggleCRM = (crmId: string) => {
    const crm = crmIntegrations.find((c) => c.id === crmId)
    const isCurrentlySelected = selectedCRMs.has(crmId)
    
    // If clicking on an already selected CRM, open config modal if connected
    if (isCurrentlySelected && crm?.connected) {
      setSelectedCrmForConfig({ id: crmId, name: crm.name })
      setCrmConfigModalOpen(true)
      return
    }
    
    const newSelected = new Set(selectedCRMs)
    if (newSelected.has(crmId)) {
      newSelected.delete(crmId)
    } else {
      newSelected.add(crmId)
      // Open config modal for connected CRMs when first selecting
      if (crm?.connected) {
        setSelectedCrmForConfig({ id: crmId, name: crm.name })
        setCrmConfigModalOpen(true)
      }
    }
    setSelectedCRMs(newSelected)
    if (!crmExpanded) {
      setCrmExpanded(true)
    }
  }

  const toggleInternalSource = (sourceId: string) => {
    const newSelected = new Set(selectedInternalSources)
    if (newSelected.has(sourceId)) {
      newSelected.delete(sourceId)
    } else {
      newSelected.add(sourceId)
    }
    setSelectedInternalSources(newSelected)
    if (!internalExpanded) {
      setInternalExpanded(true)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "text/csv") {
      setCsvFile(file)
      if (!csvExpanded) {
        setCsvExpanded(true)
      }
    } else {
      alert("Please upload a CSV file")
    }
  }

  const addUrl = () => {
    setUrls([...urls, ""])
    if (!urlExpanded) {
      setUrlExpanded(true)
    }
  }

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)

    // Validate URL
    if (value.trim()) {
      try {
        new URL(value)
        const newErrors = { ...urlErrors }
        delete newErrors[index]
        setUrlErrors(newErrors)
      } catch {
        setUrlErrors({ ...urlErrors, [index]: "Invalid URL format" })
      }
    } else {
      const newErrors = { ...urlErrors }
      delete newErrors[index]
      setUrlErrors(newErrors)
    }
  }

  const removeUrl = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index)
      setUrls(newUrls)
      const newErrors = { ...urlErrors }
      delete newErrors[index]
      setUrlErrors(newErrors)
    }
  }

  const hasValidSelection = () => {
    return (
      selectedCRMs.size > 0 ||
      selectedInternalSources.size > 0 ||
      csvFile !== null ||
      urls.some((url) => url.trim() && !urlErrors[urls.indexOf(url)])
    )
  }

  const handleContinue = () => {
    if (!hasValidSelection()) {
      alert("Please select at least one data source")
      return
    }

    // Navigate to the configure page
    router.push("/v1/dashboard/monitoring/company/create/configure")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/v1/dashboard/monitoring/company">Company Monitoring Overview</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/v1/dashboard/monitoring/company/create">Create Watchlist</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Data Sources</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Sources</h1>
        <p className="text-muted-foreground mt-1">
          Select where company data should come from
        </p>
      </div>

      <div className="space-y-4">
        {/* CRM Section */}
        <Collapsible open={crmExpanded} onOpenChange={setCrmExpanded}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>CRM</CardTitle>
                  {selectedCRMs.size > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedCRMs.size} selected
                    </Badge>
                  )}
                </div>
                {crmExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <CardDescription className="mb-4">
                  Connect your CRM to automatically sync company data
                </CardDescription>
                <div className="space-y-3">
                  {crmIntegrations.map((crm) => {
                    const isSelected = selectedCRMs.has(crm.id)
                    const Icon = crm.icon || getCRMIcon(crm.id)
                    return (
                      <div
                        key={crm.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer",
                          isSelected ? "bg-accent border-primary" : "hover:bg-muted"
                        )}
                        onClick={() => toggleCRM(crm.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleCRM(crm.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex items-center gap-2">
                            {Icon}
                            <span className="font-medium">{crm.name}</span>
                          </div>
                        </div>
                        {crm.connected ? (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Not Connected
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* CSV Upload Section */}
        <Collapsible open={csvExpanded} onOpenChange={setCsvExpanded}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>CSV Upload</CardTitle>
                  {csvFile && (
                    <Badge variant="secondary" className="text-xs">
                      File uploaded
                    </Badge>
                  )}
                </div>
                {csvExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <CardDescription className="mb-4">
                  Upload a CSV file with company data
                </CardDescription>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                  </div>
                  {csvFile && (
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">{csvFile.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCsvFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    CSV should include columns: Company Name, URL, Industry, etc.
                  </p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* URL Section */}
        <Collapsible open={urlExpanded} onOpenChange={setUrlExpanded}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>URL</CardTitle>
                  {urls.some((url) => url.trim()) && (
                    <Badge variant="secondary" className="text-xs">
                      {urls.filter((url) => url.trim()).length} URL{urls.filter((url) => url.trim()).length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                {urlExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <CardDescription className="mb-4">
                  Add company URLs to monitor
                </CardDescription>
                <div className="space-y-3">
                  {urls.map((url, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          value={url}
                          onChange={(e) => updateUrl(index, e.target.value)}
                          className={cn(
                            urlErrors[index] && "border-destructive"
                          )}
                        />
                        {urls.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeUrl(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {urlErrors[index] && (
                        <p className="text-xs text-destructive">{urlErrors[index]}</p>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addUrl} className="w-full">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Add Another URL
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Internal Data Sources Section */}
        <Collapsible open={internalExpanded} onOpenChange={setInternalExpanded}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Internal Data Sources</CardTitle>
                  {selectedInternalSources.size > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedInternalSources.size} selected
                    </Badge>
                  )}
                </div>
                {internalExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <CardDescription className="mb-4">
                  Users can also add Internal Data Sources for monitoring
                </CardDescription>
                <div className="space-y-3">
                  {internalDataSources.map((source) => {
                    const isSelected = selectedInternalSources.has(source.id)
                    return (
                      <div
                        key={source.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                          isSelected ? "bg-accent border-primary" : "hover:bg-muted"
                        )}
                        onClick={() => toggleInternalSource(source.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleInternalSource(source.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {source.icon}
                            <span className="font-medium">{source.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{source.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* CRM Configuration Modal */}
      {selectedCrmForConfig && (
        <CRMConfigModal
          open={crmConfigModalOpen}
          onOpenChange={setCrmConfigModalOpen}
          crmId={selectedCrmForConfig.id}
          crmName={selectedCrmForConfig.name}
        />
      )}

      {/* Bottom Navigation */}
      <div className="flex items-center justify-end pt-4 border-t">
        <Button onClick={handleContinue} disabled={!hasValidSelection()}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
