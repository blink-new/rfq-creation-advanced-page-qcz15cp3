import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Building, Plus, Save, Trash2, FileText, Edit } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface TermsTemplate {
  id: string
  name: string
  content: string
  createdAt: Date
  lastUsed?: Date
}

interface TermsConditionsSectionProps {
  onUpdate: (data: any) => void
  onComplete: () => void
}

export default function TermsConditionsSection({ onUpdate, onComplete }: TermsConditionsSectionProps) {
  const [currentTerms, setCurrentTerms] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [showManageTemplates, setShowManageTemplates] = useState(false)
  const [templates, setTemplates] = useState<TermsTemplate[]>([
    {
      id: 'template1',
      name: 'Standard Commercial Terms',
      content: `1. PAYMENT TERMS
Payment shall be made within 30 days of invoice date. Late payments may incur interest charges at 1.5% per month.

2. DELIVERY
Delivery dates are estimates and not guaranteed. Risk of loss passes to buyer upon delivery.

3. WARRANTIES
All goods are warranted to be free from defects in material and workmanship for a period of one year.

4. LIMITATION OF LIABILITY
Seller's liability shall not exceed the purchase price of the goods sold.

5. GOVERNING LAW
This agreement shall be governed by the laws of [State/Country].`,
      createdAt: new Date('2024-01-15'),
      lastUsed: new Date('2024-01-20')
    },
    {
      id: 'template2',
      name: 'Service Agreement Terms',
      content: `1. SCOPE OF SERVICES
Services to be provided as detailed in the attached statement of work.

2. PAYMENT SCHEDULE
Payment terms: 50% upon contract signing, 50% upon completion.

3. INTELLECTUAL PROPERTY
All work product shall remain the property of the client upon full payment.

4. CONFIDENTIALITY
Both parties agree to maintain confidentiality of proprietary information.

5. TERMINATION
Either party may terminate with 30 days written notice.`,
      createdAt: new Date('2024-01-10'),
      lastUsed: new Date('2024-01-18')
    },
    {
      id: 'template3',
      name: 'International Trade Terms',
      content: `1. INCOTERMS
All shipments shall be FOB shipping point unless otherwise specified.

2. CURRENCY
All prices quoted in USD unless otherwise stated.

3. EXPORT COMPLIANCE
Buyer responsible for all export/import licenses and compliance.

4. FORCE MAJEURE
Neither party liable for delays due to circumstances beyond reasonable control.

5. DISPUTE RESOLUTION
Disputes resolved through binding arbitration.`,
      createdAt: new Date('2024-01-05'),
    }
  ])

  const { toast } = useToast()

  useEffect(() => {
    const data = {
      terms: currentTerms,
      selectedTemplate
    }
    onUpdate(data)
  }, [currentTerms, selectedTemplate, onUpdate])

  useEffect(() => {
    if (currentTerms.trim().length > 0) {
      onComplete()
    }
  }, [currentTerms, onComplete])

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === 'custom') {
      setSelectedTemplate('')
      return
    }

    const template = templates.find(t => t.id === templateId)
    if (template) {
      setCurrentTerms(template.content)
      setSelectedTemplate(templateId)
      
      // Update last used date
      setTemplates(prev => prev.map(t => 
        t.id === templateId 
          ? { ...t, lastUsed: new Date() }
          : t
      ))
    }
  }

  const saveAsNewTemplate = (name: string) => {
    if (!currentTerms.trim()) {
      toast({
        title: "Error",
        description: "Please enter terms and conditions before saving as template.",
        variant: "destructive"
      })
      return
    }

    const newTemplate: TermsTemplate = {
      id: `template_${Date.now()}`,
      name,
      content: currentTerms,
      createdAt: new Date()
    }

    setTemplates(prev => [...prev, newTemplate])
    setShowSaveTemplate(false)
    
    toast({
      title: "Template Saved",
      description: `"${name}" has been saved as a new template.`
    })
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId))
    if (selectedTemplate === templateId) {
      setSelectedTemplate('')
    }
    
    toast({
      title: "Template Deleted",
      description: "The template has been removed."
    })
  }

  const updateTemplate = (templateId: string, name: string, content: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId 
        ? { ...t, name, content }
        : t
    ))
    
    if (selectedTemplate === templateId) {
      setCurrentTerms(content)
    }
    
    toast({
      title: "Template Updated",
      description: "The template has been updated successfully."
    })
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Terms & Conditions Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="template-select">Select from existing templates</Label>
              <Select value={selectedTemplate || 'custom'} onValueChange={handleTemplateSelect}>
                <SelectTrigger id="template-select">
                  <SelectValue placeholder="Choose a template or create custom terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Terms</SelectItem>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{template.name}</span>
                        {template.lastUsed && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Recently used
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={showManageTemplates} onOpenChange={setShowManageTemplates}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Manage Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Manage Terms & Conditions Templates</DialogTitle>
                </DialogHeader>
                <ManageTemplatesDialog 
                  templates={templates}
                  onUpdate={updateTemplate}
                  onDelete={deleteTemplate}
                  onClose={() => setShowManageTemplates(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {selectedTemplate && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <FileText className="w-4 h-4" />
                <span>Using template: <strong>{templates.find(t => t.id === selectedTemplate)?.name}</strong></span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Terms & Conditions Content
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={showSaveTemplate} onOpenChange={setShowSaveTemplate}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2" disabled={!currentTerms.trim()}>
                    <Save className="w-4 h-4" />
                    Save as Template
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save as New Template</DialogTitle>
                  </DialogHeader>
                  <SaveTemplateDialog onSave={saveAsNewTemplate} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="terms-content">Enter your terms and conditions</Label>
            <Textarea
              id="terms-content"
              placeholder="Enter the terms and conditions for this RFQ..."
              value={currentTerms}
              onChange={(e) => setCurrentTerms(e.target.value)}
              rows={15}
              className="font-mono text-sm"
            />
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{currentTerms.length} characters</span>
              {currentTerms.trim() && (
                <Badge variant="secondary">
                  Content ready
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {currentTerms.trim() && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border">
                {currentTerms}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function SaveTemplateDialog({ onSave }: { onSave: (name: string) => void }) {
  const [templateName, setTemplateName] = useState('')

  const handleSave = () => {
    if (templateName.trim()) {
      onSave(templateName.trim())
      setTemplateName('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="template-name">Template Name</Label>
        <Input
          id="template-name"
          placeholder="Enter a name for this template"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setTemplateName('')}>Cancel</Button>
        <Button onClick={handleSave} disabled={!templateName.trim()}>
          Save Template
        </Button>
      </div>
    </div>
  )
}

function ManageTemplatesDialog({ 
  templates, 
  onUpdate, 
  onDelete, 
  onClose 
}: { 
  templates: TermsTemplate[]
  onUpdate: (id: string, name: string, content: string) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', content: '' })

  const startEditing = (template: TermsTemplate) => {
    setEditingTemplate(template.id)
    setEditForm({ name: template.name, content: template.content })
  }

  const saveEdit = () => {
    if (editingTemplate && editForm.name.trim()) {
      onUpdate(editingTemplate, editForm.name.trim(), editForm.content)
      setEditingTemplate(null)
      setEditForm({ name: '', content: '' })
    }
  }

  const cancelEdit = () => {
    setEditingTemplate(null)
    setEditForm({ name: '', content: '' })
  }

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto space-y-4">
        {templates.map(template => (
          <Card key={template.id}>
            <CardContent className="p-4">
              {editingTemplate === template.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Template Name</Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={cancelEdit}>Cancel</Button>
                    <Button size="sm" onClick={saveEdit}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span>Created: {template.createdAt.toLocaleDateString()}</span>
                        {template.lastUsed && (
                          <span>Last used: {template.lastUsed.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => startEditing(template)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(template.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded border max-h-32 overflow-y-auto">
                    <div className="whitespace-pre-wrap font-mono">
                      {template.content.substring(0, 200)}
                      {template.content.length > 200 && '...'}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}