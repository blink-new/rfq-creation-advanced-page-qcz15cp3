import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, FileText, Package, HelpCircle, Users, Building, Mail } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SaveTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rfqData: any
}

export default function SaveTemplateModal({ open, onOpenChange, rfqData }: SaveTemplateModalProps) {
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const getSectionSummary = () => {
    const sections = []
    
    if (rfqData.general && Object.keys(rfqData.general).length > 0) {
      sections.push({
        name: 'General Details',
        icon: FileText,
        items: [
          rfqData.general.name && `Name: ${rfqData.general.name}`,
          rfqData.general.project && `Project: ${rfqData.general.project}`,
          rfqData.general.multiRoundEnabled && `Multi-round: ${rfqData.general.numberOfRounds} rounds`,
          rfqData.general.budgetLevel && `Budget: ${rfqData.general.budgetLevel} level`
        ].filter(Boolean)
      })
    }

    if (rfqData.items && rfqData.items.length > 0) {
      sections.push({
        name: 'Items',
        icon: Package,
        items: [
          `${rfqData.items.length} items`,
          `Categories: ${[...new Set(rfqData.items.map((item: any) => item.category))].join(', ')}`
        ]
      })
    }

    if (rfqData.questionnaire && rfqData.questionnaire.cards && rfqData.questionnaire.cards.length > 0) {
      sections.push({
        name: 'Questionnaire',
        icon: HelpCircle,
        items: [
          `${rfqData.questionnaire.cards.length} cards`,
          rfqData.questionnaire.showBeforeRfqDetails && 'Show before RFQ details'
        ].filter(Boolean)
      })
    }

    if (rfqData.suppliers && rfqData.suppliers.length > 0) {
      sections.push({
        name: 'Suppliers',
        icon: Users,
        items: [
          `${rfqData.suppliers.length} suppliers selected`,
          `Sources: ${[...new Set(rfqData.suppliers.map((s: any) => s.source))].join(', ')}`
        ]
      })
    }

    if (rfqData.terms && rfqData.terms.terms) {
      sections.push({
        name: 'Terms & Conditions',
        icon: Building,
        items: [
          `${rfqData.terms.terms.length} characters`,
          rfqData.terms.selectedTemplate && 'Using template'
        ].filter(Boolean)
      })
    }

    if (rfqData.email && rfqData.email.subject) {
      sections.push({
        name: 'Email Template',
        icon: Mail,
        items: [
          `Subject: ${rfqData.email.subject}`,
          rfqData.email.selectedTemplate && 'Using template'
        ].filter(Boolean)
      })
    }

    return sections
  }

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a template name.",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    
    try {
      // Simulate saving to backend
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const template = {
        id: `template_${Date.now()}`,
        name: templateName.trim(),
        description: templateDescription.trim(),
        data: rfqData,
        createdAt: new Date(),
        sections: getSectionSummary().length
      }

      // In a real app, this would save to your backend
      console.log('Saving RFQ template:', template)
      
      toast({
        title: "Template Saved",
        description: `"${templateName}" has been saved successfully and can be reused for future RFQs.`
      })
      
      setTemplateName('')
      setTemplateDescription('')
      onOpenChange(false)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const sections = getSectionSummary()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save RFQ Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                placeholder="Enter a descriptive name for this RFQ template"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-description">Description (Optional)</Label>
              <Textarea
                id="template-description"
                placeholder="Describe when and how this template should be used"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Template Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Template Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Sections included:</span>
                  <Badge variant="secondary">{sections.length} sections</Badge>
                </div>

                <div className="grid gap-3">
                  {sections.map((section, index) => {
                    const Icon = section.icon
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{section.name}</h4>
                          <div className="mt-1 space-y-1">
                            {section.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="text-xs text-slate-600 flex items-center gap-1">
                                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {sections.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm">No sections configured yet</p>
                    <p className="text-xs">Complete some sections before saving as template</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Template Benefits</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Reuse this configuration for similar RFQs
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Save time on future RFQ creation
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Maintain consistency across RFQs
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Share with team members
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!templateName.trim() || sections.length === 0 || saving}
              className="gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Template
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}