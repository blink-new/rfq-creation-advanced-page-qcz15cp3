import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Save, FileText, Settings, Users, Package, HelpCircle, Building, Mail } from 'lucide-react'
import GeneralDetailsSection from '../components/sections/GeneralDetailsSection'
import ItemsSection from '../components/sections/ItemsSection'
import QuestionnaireSection from '../components/sections/QuestionnaireSection'
import SuppliersSection from '../components/sections/SuppliersSection'
import TermsConditionsSection from '../components/sections/TermsConditionsSection'
import EmailTemplateSection from '../components/sections/EmailTemplateSection'
import SaveTemplateModal from '../components/modals/SaveTemplateModal'

const sections = [
  { id: 'general', title: 'General Details', icon: FileText, description: 'Basic RFQ information and settings' },
  { id: 'items', title: 'Items', icon: Package, description: 'Add and manage RFQ items' },
  { id: 'questionnaire', title: 'Questionnaire', icon: HelpCircle, description: 'Configure supplier questionnaire' },
  { id: 'suppliers', title: 'Suppliers', icon: Users, description: 'Select and manage suppliers' },
  { id: 'terms', title: 'Terms & Conditions', icon: Building, description: 'Set RFQ terms and conditions' },
  { id: 'email', title: 'Email Template', icon: Mail, description: 'Configure supplier email template' }
]

export default function NewRFQPage() {
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [rfqData, setRfqData] = useState({
    general: {},
    items: [],
    questionnaire: {},
    suppliers: [],
    terms: {},
    email: {}
  })

  const progress = (completedSections.size / sections.length) * 100

  const markSectionComplete = (sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]))
  }

  const updateRfqData = (section: string, data: any) => {
    setRfqData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const renderSection = (section: any) => {
    switch (section.id) {
      case 'general':
        return <GeneralDetailsSection onUpdate={(data) => updateRfqData('general', data)} onComplete={() => markSectionComplete('general')} />
      case 'items':
        return <ItemsSection onUpdate={(data) => updateRfqData('items', data)} onComplete={() => markSectionComplete('items')} />
      case 'questionnaire':
        return <QuestionnaireSection onUpdate={(data) => updateRfqData('questionnaire', data)} onComplete={() => markSectionComplete('questionnaire')} />
      case 'suppliers':
        return <SuppliersSection onUpdate={(data) => updateRfqData('suppliers', data)} onComplete={() => markSectionComplete('suppliers')} />
      case 'terms':
        return <TermsConditionsSection onUpdate={(data) => updateRfqData('terms', data)} onComplete={() => markSectionComplete('terms')} />
      case 'email':
        return <EmailTemplateSection onUpdate={(data) => updateRfqData('email', data)} onComplete={() => markSectionComplete('email')} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Create New RFQ</h1>
              <p className="text-slate-600 mt-1">Build your request for quotation from scratch</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Progress:</span>
                <Progress value={progress} className="w-32" />
                <span className="text-sm font-medium text-slate-900">{Math.round(progress)}%</span>
              </div>
              <Button 
                onClick={() => setShowSaveTemplate(true)}
                variant="outline"
                className="gap-2"
                disabled={completedSections.size === 0}
              >
                <Save className="w-4 h-4" />
                Save as Template
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon
            const isCompleted = completedSections.has(section.id)
            
            return (
              <Card key={section.id} className="overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isCompleted ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium text-slate-900">{section.title}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{section.description}</p>
                      </div>
                    </div>
                    {isCompleted && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        Complete
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {renderSection(section)}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-slate-200">
          <Button variant="outline" size="lg">
            Save Draft
          </Button>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={completedSections.size < sections.length}
          >
            Create RFQ
          </Button>
        </div>
      </div>

      <SaveTemplateModal 
        open={showSaveTemplate}
        onOpenChange={setShowSaveTemplate}
        rfqData={rfqData}
      />
    </div>
  )
}