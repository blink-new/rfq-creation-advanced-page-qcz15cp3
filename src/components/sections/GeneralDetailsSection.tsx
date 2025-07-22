import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'

interface GeneralDetailsSectionProps {
  onUpdate: (data: any) => void
  onComplete: () => void
}

export default function GeneralDetailsSection({ onUpdate, onComplete }: GeneralDetailsSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    requesters: '',
    assignee: '',
    project: '',
    budget: '',
    department: '',
    location: '',
    deliveryAddress: '',
    expectedDeliveryDate: null as Date | null,
    currency: 'USD',
    allowMultipleCurrencies: false,
    paymentTerms: '',
    budgetLevel: 'general', // 'general' or 'item'
    deliveryDateLevel: 'general', // 'general' or 'item'
    multiRoundEnabled: false,
    numberOfRounds: 2,
    autoEliminationEnabled: false,
    suppliersToRemove: 1
  })

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

  // Mock data for dropdowns
  const projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta']
  const budgets = ['Budget A - $50K', 'Budget B - $100K', 'Budget C - $250K', 'Budget D - $500K']
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
  const paymentTermsOptions = ['Net 30', 'Net 60', 'Net 90', '2/10 Net 30', 'COD', 'Prepayment']

  useEffect(() => {
    onUpdate(formData)
  }, [formData, onUpdate])

  useEffect(() => {
    // Check if required fields are filled
    const requiredFields = ['name', 'requesters', 'assignee', 'project', 'budget', 'department', 'location']
    const isComplete = requiredFields.every(field => formData[field as keyof typeof formData])
    
    if (isComplete) {
      onComplete()
    }
  }, [formData, onComplete])

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">RFQ Name *</Label>
          <Input
            id="name"
            placeholder="Enter RFQ name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requesters">Requesters *</Label>
          <Input
            id="requesters"
            placeholder="Enter requesters"
            value={formData.requesters}
            onChange={(e) => updateField('requesters', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee *</Label>
          <Input
            id="assignee"
            placeholder="Enter assignee"
            value={formData.assignee}
            onChange={(e) => updateField('assignee', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project">Project *</Label>
          <Select value={formData.project} onValueChange={(value) => updateField('project', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project} value={project}>{project}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget *</Label>
          <Select value={formData.budget} onValueChange={(value) => updateField('budget', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              {budgets.map((budget) => (
                <SelectItem key={budget} value={budget}>{budget}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Input
            id="department"
            placeholder="Enter department"
            value={formData.department}
            onChange={(e) => updateField('department', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryAddress">Delivery Address</Label>
          <Textarea
            id="deliveryAddress"
            placeholder="Enter delivery address"
            value={formData.deliveryAddress}
            onChange={(e) => updateField('deliveryAddress', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Date and Currency Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Expected Delivery Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.expectedDeliveryDate ? format(formData.expectedDeliveryDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.expectedDeliveryDate || undefined}
                onSelect={(date) => updateField('expectedDeliveryDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => updateField('currency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Select value={formData.paymentTerms} onValueChange={(value) => updateField('paymentTerms', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment terms" />
            </SelectTrigger>
            <SelectContent>
              {paymentTermsOptions.map((term) => (
                <SelectItem key={term} value={term}>{term}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="allowMultipleCurrencies"
            checked={formData.allowMultipleCurrencies}
            onCheckedChange={(checked) => updateField('allowMultipleCurrencies', checked)}
          />
          <Label htmlFor="allowMultipleCurrencies">Allow suppliers to bid in different currencies</Label>
        </div>
      </div>

      <Separator />

      {/* Advanced Settings */}
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className="gap-2"
        >
          <Settings className="w-4 h-4" />
          Advanced Settings
          {showAdvancedSettings && <Badge variant="secondary" className="ml-2">Expanded</Badge>}
        </Button>

        {showAdvancedSettings && (
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle className="text-base">Configuration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Budget and Delivery Level Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Budget Level</Label>
                  <Select value={formData.budgetLevel} onValueChange={(value) => updateField('budgetLevel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Level</SelectItem>
                      <SelectItem value="item">Item Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Delivery Date Level</Label>
                  <Select value={formData.deliveryDateLevel} onValueChange={(value) => updateField('deliveryDateLevel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Level</SelectItem>
                      <SelectItem value="item">Item Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Multi-Round RFQ Settings */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="multiRoundEnabled"
                    checked={formData.multiRoundEnabled}
                    onCheckedChange={(checked) => updateField('multiRoundEnabled', checked)}
                  />
                  <Label htmlFor="multiRoundEnabled" className="font-medium">Enable Multi-Round RFQ</Label>
                </div>

                {formData.multiRoundEnabled && (
                  <div className="ml-6 space-y-4 p-4 bg-white rounded-lg border border-slate-200">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfRounds">Number of Rounds (Max 3)</Label>
                      <Select 
                        value={formData.numberOfRounds.toString()} 
                        onValueChange={(value) => updateField('numberOfRounds', parseInt(value))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 Rounds</SelectItem>
                          <SelectItem value="3">3 Rounds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="autoEliminationEnabled"
                          checked={formData.autoEliminationEnabled}
                          onCheckedChange={(checked) => updateField('autoEliminationEnabled', checked)}
                        />
                        <Label htmlFor="autoEliminationEnabled">Auto-eliminate suppliers with worst offers</Label>
                      </div>

                      {formData.autoEliminationEnabled && (
                        <div className="ml-6 space-y-2">
                          <Label htmlFor="suppliersToRemove">Number of suppliers to remove each round</Label>
                          <Input
                            id="suppliersToRemove"
                            type="number"
                            min="1"
                            max="10"
                            className="w-32"
                            value={formData.suppliersToRemove}
                            onChange={(e) => updateField('suppliersToRemove', parseInt(e.target.value) || 1)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}