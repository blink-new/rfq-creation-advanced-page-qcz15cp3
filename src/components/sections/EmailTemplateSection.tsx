import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Plus, Save, Trash2, Edit, Eye, Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  header: string
  body: string
  footer: string
  createdAt: Date
  lastUsed?: Date
}

interface EmailTemplateSectionProps {
  onUpdate: (data: any) => void
  onComplete: () => void
}

export default function EmailTemplateSection({ onUpdate, onComplete }: EmailTemplateSectionProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [emailData, setEmailData] = useState({
    subject: '',
    header: '',
    body: '',
    footer: ''
  })
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [showManageTemplates, setShowManageTemplates] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 'template1',
      name: 'Standard RFQ Invitation',
      subject: 'Request for Quotation - {{RFQ_NAME}}',
      header: 'Dear {{SUPPLIER_NAME}},',
      body: `We are pleased to invite you to participate in our Request for Quotation (RFQ) process.

**RFQ Details:**
- RFQ Name: {{RFQ_NAME}}
- Project: {{PROJECT_NAME}}
- Submission Deadline: {{DEADLINE}}

Please review the attached RFQ documents and submit your quotation through our supplier portal.

If you have any questions, please don't hesitate to contact us.`,
      footer: `Best regards,
{{REQUESTER_NAME}}
{{COMPANY_NAME}}
{{CONTACT_EMAIL}}`,
      createdAt: new Date('2024-01-15'),
      lastUsed: new Date('2024-01-20')
    },
    {
      id: 'template2',
      name: 'Urgent RFQ Request',
      subject: 'URGENT: Request for Quotation - {{RFQ_NAME}}',
      header: 'Dear {{SUPPLIER_NAME}},',
      body: `We have an urgent requirement and would like to invite you to participate in our expedited RFQ process.

**URGENT RFQ Details:**
- RFQ Name: {{RFQ_NAME}}
- Project: {{PROJECT_NAME}}
- Submission Deadline: {{DEADLINE}} (URGENT)
- Expected Award Date: {{AWARD_DATE}}

Due to the urgent nature of this request, please prioritize your response.

Please submit your quotation as soon as possible through our supplier portal.`,
      footer: `Urgent regards,
{{REQUESTER_NAME}}
{{COMPANY_NAME}}
{{CONTACT_EMAIL}}
{{PHONE_NUMBER}}`,
      createdAt: new Date('2024-01-10'),
      lastUsed: new Date('2024-01-18')
    },
    {
      id: 'template3',
      name: 'Multi-Round RFQ Invitation',
      subject: 'Multi-Round RFQ Invitation - {{RFQ_NAME}}',
      header: 'Dear {{SUPPLIER_NAME}},',
      body: `We are conducting a multi-round RFQ process and would like to invite you to participate.

**Multi-Round RFQ Details:**
- RFQ Name: {{RFQ_NAME}}
- Project: {{PROJECT_NAME}}
- Number of Rounds: {{ROUNDS}}
- Round 1 Deadline: {{ROUND1_DEADLINE}}
- Final Award Date: {{AWARD_DATE}}

This is a competitive process with multiple evaluation rounds. Only qualified suppliers will advance to subsequent rounds.

Please review the attached documents and submit your initial quotation.`,
      footer: `Best regards,
{{REQUESTER_NAME}}
{{COMPANY_NAME}}
{{CONTACT_EMAIL}}`,
      createdAt: new Date('2024-01-05')
    }
  ])

  const { toast } = useToast()

  useEffect(() => {
    const data = {
      selectedTemplate,
      subject: emailData.subject,
      header: emailData.header,
      body: emailData.body,
      footer: emailData.footer
    }
    onUpdate(data)
  }, [selectedTemplate, emailData, onUpdate])

  useEffect(() => {
    if (emailData.subject.trim() && emailData.body.trim()) {
      onComplete()
    }
  }, [emailData.subject, emailData.body, onComplete])

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === 'custom') {
      setSelectedTemplate('')
      setEmailData({ subject: '', header: '', body: '', footer: '' })
      return
    }

    const template = templates.find(t => t.id === templateId)
    if (template) {
      setEmailData({
        subject: template.subject,
        header: template.header,
        body: template.body,
        footer: template.footer
      })
      setSelectedTemplate(templateId)
      
      // Update last used date
      setTemplates(prev => prev.map(t => 
        t.id === templateId 
          ? { ...t, lastUsed: new Date() }
          : t
      ))
    }
  }

  const updateEmailData = (field: keyof typeof emailData, value: string) => {
    setEmailData(prev => ({ ...prev, [field]: value }))
  }

  const saveAsNewTemplate = (name: string) => {
    if (!emailData.subject.trim() || !emailData.body.trim()) {
      toast({
        title: "Error",
        description: "Please enter subject and body before saving as template.",
        variant: "destructive"
      })
      return
    }

    const newTemplate: EmailTemplate = {
      id: `template_${Date.now()}`,
      name,
      subject: emailData.subject,
      header: emailData.header,
      body: emailData.body,
      footer: emailData.footer,
      createdAt: new Date()
    }

    setTemplates(prev => [...prev, newTemplate])
    setShowSaveTemplate(false)
    
    toast({
      title: "Template Saved",
      description: `"${name}" has been saved as a new email template.`
    })
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId))
    if (selectedTemplate === templateId) {
      setSelectedTemplate('')
      setEmailData({ subject: '', header: '', body: '', footer: '' })
    }
    
    toast({
      title: "Template Deleted",
      description: "The email template has been removed."
    })
  }

  const updateTemplate = (templateId: string, name: string, templateData: Omit<EmailTemplate, 'id' | 'name' | 'createdAt' | 'lastUsed'>) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId 
        ? { ...t, name, ...templateData }
        : t
    ))
    
    if (selectedTemplate === templateId) {
      setEmailData({
        subject: templateData.subject,
        header: templateData.header,
        body: templateData.body,
        footer: templateData.footer
      })
    }
    
    toast({
      title: "Template Updated",
      description: "The email template has been updated successfully."
    })
  }

  const generatePreviewEmail = () => {
    // Replace placeholders with sample data for preview
    const sampleData = {
      '{{RFQ_NAME}}': 'Office Equipment RFQ 2024',
      '{{SUPPLIER_NAME}}': 'ABC Suppliers Inc.',
      '{{PROJECT_NAME}}': 'Office Renovation Project',
      '{{DEADLINE}}': 'March 15, 2024',
      '{{AWARD_DATE}}': 'March 22, 2024',
      '{{ROUNDS}}': '3',
      '{{ROUND1_DEADLINE}}': 'March 10, 2024',
      '{{REQUESTER_NAME}}': 'John Smith',
      '{{COMPANY_NAME}}': 'Your Company Name',
      '{{CONTACT_EMAIL}}': 'john.smith@company.com',
      '{{PHONE_NUMBER}}': '+1-555-0123'
    }

    const replaceVariables = (text: string) => {
      let result = text
      Object.entries(sampleData).forEach(([key, value]) => {
        result = result.replace(new RegExp(key, 'g'), value)
      })
      return result
    }

    return {
      subject: replaceVariables(emailData.subject),
      header: replaceVariables(emailData.header),
      body: replaceVariables(emailData.body),
      footer: replaceVariables(emailData.footer)
    }
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="email-template-select">Select from existing templates</Label>
              <Select value={selectedTemplate || 'custom'} onValueChange={handleTemplateSelect}>
                <SelectTrigger id="email-template-select">
                  <SelectValue placeholder="Choose a template or create custom email" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Email</SelectItem>
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
                  <DialogTitle>Manage Email Templates</DialogTitle>
                </DialogHeader>
                <ManageEmailTemplatesDialog 
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
                <Mail className="w-4 h-4" />
                <span>Using template: <strong>{templates.find(t => t.id === selectedTemplate)?.name}</strong></span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Email Content
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2" disabled={!emailData.subject.trim() || !emailData.body.trim()}>
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Email Preview</DialogTitle>
                  </DialogHeader>
                  <EmailPreviewDialog email={generatePreviewEmail()} />
                </DialogContent>
              </Dialog>

              <Dialog open={showSaveTemplate} onOpenChange={setShowSaveTemplate}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2" disabled={!emailData.subject.trim() || !emailData.body.trim()}>
                    <Save className="w-4 h-4" />
                    Save as Template
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save as New Template</DialogTitle>
                  </DialogHeader>
                  <SaveEmailTemplateDialog onSave={saveAsNewTemplate} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
            </TabsList>
            
            <TabsContent value="compose" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject Line *</Label>
                <Input
                  id="email-subject"
                  placeholder="Enter email subject"
                  value={emailData.subject}
                  onChange={(e) => updateEmailData('subject', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-header">Header/Greeting</Label>
                <Textarea
                  id="email-header"
                  placeholder="Dear {{SUPPLIER_NAME}},"
                  value={emailData.header}
                  onChange={(e) => updateEmailData('header', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-body">Email Body *</Label>
                <Textarea
                  id="email-body"
                  placeholder="Enter the main content of your email..."
                  value={emailData.body}
                  onChange={(e) => updateEmailData('body', e.target.value)}
                  rows={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-footer">Footer/Signature</Label>
                <Textarea
                  id="email-footer"
                  placeholder="Best regards,&#10;{{REQUESTER_NAME}}&#10;{{COMPANY_NAME}}"
                  value={emailData.footer}
                  onChange={(e) => updateEmailData('footer', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Total characters: {(emailData.subject + emailData.header + emailData.body + emailData.footer).length}</span>
                {emailData.subject.trim() && emailData.body.trim() && (
                  <Badge variant="secondary">
                    Email ready
                  </Badge>
                )}
              </div>
            </TabsContent>

            <TabsContent value="variables" className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Available Variables</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Use these variables in your email template. They will be automatically replaced with actual values when sending.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">RFQ Information</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-xs">{'{{RFQ_NAME}}'}</code>
                        <span className="text-slate-600">RFQ Name</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-xs">{'{{PROJECT_NAME}}'}</code>
                        <span className="text-slate-600">Project Name</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-xs">{'{{DEADLINE}}'}</code>
                        <span className="text-slate-600">Submission Deadline</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-xs">{'{{AWARD_DATE}}'}</code>
                        <span className="text-slate-600">Award Date</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2">Contact Information</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-xs">{'{{SUPPLIER_NAME}}'}</code>
                        <span className="text-slate-600">Supplier Name</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-xs">{'{{REQUESTER_NAME}}'}</code>
                        <span className="text-slate-600">Requester Name</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-xs">{'{{COMPANY_NAME}}'}</code>
                        <span className="text-slate-600">Company Name</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-xs">{'{{CONTACT_EMAIL}}'}</code>
                        <span className="text-slate-600">Contact Email</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-700">
                    <strong>Tip:</strong> Copy and paste these variables into your email content. They will be automatically replaced with the actual values when the email is sent to suppliers.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function SaveEmailTemplateDialog({ onSave }: { onSave: (name: string) => void }) {
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
          placeholder="Enter a name for this email template"
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

function EmailPreviewDialog({ email }: { email: any }) {
  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          <div className="border-b pb-3">
            <div className="text-sm text-slate-600 mb-1">Subject:</div>
            <div className="font-medium">{email.subject}</div>
          </div>
          
          <div className="space-y-3">
            {email.header && (
              <div className="whitespace-pre-wrap">{email.header}</div>
            )}
            
            <div className="whitespace-pre-wrap">{email.body}</div>
            
            {email.footer && (
              <div className="whitespace-pre-wrap border-t pt-3 text-slate-600">
                {email.footer}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-sm text-slate-500">
        <strong>Note:</strong> This preview shows sample data. Actual emails will use real supplier and RFQ information.
      </div>
    </div>
  )
}

function ManageEmailTemplatesDialog({ 
  templates, 
  onUpdate, 
  onDelete, 
  onClose 
}: { 
  templates: EmailTemplate[]
  onUpdate: (id: string, name: string, data: any) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ 
    name: '', 
    subject: '', 
    header: '', 
    body: '', 
    footer: '' 
  })

  const startEditing = (template: EmailTemplate) => {
    setEditingTemplate(template.id)
    setEditForm({
      name: template.name,
      subject: template.subject,
      header: template.header,
      body: template.body,
      footer: template.footer
    })
  }

  const saveEdit = () => {
    if (editingTemplate && editForm.name.trim() && editForm.subject.trim() && editForm.body.trim()) {
      onUpdate(editingTemplate, editForm.name.trim(), {
        subject: editForm.subject,
        header: editForm.header,
        body: editForm.body,
        footer: editForm.footer
      })
      setEditingTemplate(null)
      setEditForm({ name: '', subject: '', header: '', body: '', footer: '' })
    }
  }

  const cancelEdit = () => {
    setEditingTemplate(null)
    setEditForm({ name: '', subject: '', header: '', body: '', footer: '' })
  }

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto space-y-4">
        {templates.map(template => (
          <Card key={template.id}>
            <CardContent className="p-4">
              {editingTemplate === template.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Template Name</Label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        value={editForm.subject}
                        onChange={(e) => setEditForm(prev => ({ ...prev, subject: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Header</Label>
                    <Textarea
                      value={editForm.header}
                      onChange={(e) => setEditForm(prev => ({ ...prev, header: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Body</Label>
                    <Textarea
                      value={editForm.body}
                      onChange={(e) => setEditForm(prev => ({ ...prev, body: e.target.value }))}
                      rows={6}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Footer</Label>
                    <Textarea
                      value={editForm.footer}
                      onChange={(e) => setEditForm(prev => ({ ...prev, footer: e.target.value }))}
                      rows={3}
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
                      <div className="text-sm text-slate-600 mt-1">Subject: {template.subject}</div>
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
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded border max-h-24 overflow-y-auto">
                    <div className="whitespace-pre-wrap">
                      {template.body.substring(0, 150)}
                      {template.body.length > 150 && '...'}
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