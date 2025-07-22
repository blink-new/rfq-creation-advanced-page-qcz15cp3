import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Plus, HelpCircle, Settings, Trash2, Edit, Eye, EyeOff, Folder } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

interface QuestionnaireCard {
  id: string
  name: string
  description: string
  questions: string[]
  scoringType: 'automatic' | 'manual'
  scoringWeight: number
  maxScore: number
  group?: string
}

interface QuestionnaireSectionProps {
  onUpdate: (data: any) => void
  onComplete: () => void
}

export default function QuestionnaireSection({ onUpdate, onComplete }: QuestionnaireSectionProps) {
  const [cards, setCards] = useState<QuestionnaireCard[]>([])
  const [showAddCards, setShowAddCards] = useState(false)
  const [showBeforeRfqDetails, setShowBeforeRfqDetails] = useState(false)
  const [showCardSettings, setShowCardSettings] = useState<string | null>(null)
  const [groupBy, setGroupBy] = useState<string>('')

  // Mock available cards
  const availableCards = [
    {
      id: 'card1',
      name: 'Company Information',
      description: 'Basic company details and credentials',
      questions: ['Company name', 'Registration number', 'Years in business', 'Number of employees']
    },
    {
      id: 'card2',
      name: 'Financial Information',
      description: 'Financial stability and credit information',
      questions: ['Annual revenue', 'Credit rating', 'Bank references', 'Insurance coverage']
    },
    {
      id: 'card3',
      name: 'Technical Capabilities',
      description: 'Technical expertise and certifications',
      questions: ['Certifications held', 'Technical team size', 'Equipment capabilities', 'Quality standards']
    },
    {
      id: 'card4',
      name: 'References',
      description: 'Client references and past projects',
      questions: ['Recent client references', 'Similar project experience', 'Case studies', 'Testimonials']
    },
    {
      id: 'card5',
      name: 'Compliance & Safety',
      description: 'Safety records and compliance information',
      questions: ['Safety certifications', 'Incident reports', 'Compliance records', 'Environmental policies']
    }
  ]

  useEffect(() => {
    const data = {
      cards,
      showBeforeRfqDetails,
      groupBy
    }
    onUpdate(data)
  }, [cards, showBeforeRfqDetails, groupBy, onUpdate])

  useEffect(() => {
    if (cards.length > 0) {
      onComplete()
    }
  }, [cards.length, onComplete])

  const addCards = (selectedCardIds: string[]) => {
    const newCards = availableCards
      .filter(card => selectedCardIds.includes(card.id))
      .map(card => ({
        ...card,
        scoringType: 'automatic' as const,
        scoringWeight: 10,
        maxScore: 100
      }))
    
    setCards(prev => [...prev, ...newCards])
    setShowAddCards(false)
  }

  const removeCard = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId))
  }

  const updateCardSettings = (cardId: string, settings: Partial<QuestionnaireCard>) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, ...settings } : card
    ))
  }

  const groupCards = () => {
    if (!groupBy) return cards

    const grouped = cards.reduce((acc, card) => {
      const key = card[groupBy as keyof QuestionnaireCard] as string || 'Ungrouped'
      if (!acc[key]) acc[key] = []
      acc[key].push(card)
      return acc
    }, {} as {[key: string]: QuestionnaireCard[]})

    return Object.entries(grouped).flatMap(([group, groupCards]) => [
      { isGroupHeader: true, groupName: group, id: `group_${group}` } as any,
      ...groupCards
    ])
  }

  const displayCards = groupBy ? groupCards() : cards

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Dialog open={showAddCards} onOpenChange={setShowAddCards}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Info Cards
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add Information Cards</DialogTitle>
            </DialogHeader>
            <AddCardsDialog cards={availableCards} onAdd={addCards} />
          </DialogContent>
        </Dialog>

        <div className="flex items-center space-x-2">
          <Switch
            id="showBeforeRfq"
            checked={showBeforeRfqDetails}
            onCheckedChange={setShowBeforeRfqDetails}
          />
          <Label htmlFor="showBeforeRfq">Show questionnaire before RFQ details</Label>
        </div>

        <Select value={groupBy || 'none'} onValueChange={(value) => setGroupBy(value === 'none' ? '' : value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Group cards by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Grouping</SelectItem>
            <SelectItem value="scoringType">Scoring Type</SelectItem>
            <SelectItem value="group">Custom Group</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards Display */}
      {cards.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium">Questionnaire Cards ({cards.length})</h3>
            {groupBy && <Badge variant="secondary">Grouped by {groupBy}</Badge>}
            {showBeforeRfqDetails && (
              <Badge variant="outline" className="gap-1">
                <Eye className="w-3 h-3" />
                Show Before RFQ
              </Badge>
            )}
          </div>

          <div className="grid gap-4">
            {displayCards.map((card: any) => {
              if (card.isGroupHeader) {
                return (
                  <div key={card.id} className="flex items-center gap-2 py-2 text-sm font-medium text-slate-600 border-b border-slate-200">
                    <Folder className="w-4 h-4" />
                    {card.groupName}
                  </div>
                )
              }

              return (
                <Card key={card.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base font-medium">{card.name}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{card.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={card.scoringType === 'automatic' ? 'default' : 'secondary'}>
                          {card.scoringType}
                        </Badge>
                        <Dialog open={showCardSettings === card.id} onOpenChange={(open) => setShowCardSettings(open ? card.id : null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Card Settings - {card.name}</DialogTitle>
                            </DialogHeader>
                            <CardSettingsDialog 
                              card={card} 
                              onUpdate={(settings) => updateCardSettings(card.id, settings)}
                              onClose={() => setShowCardSettings(null)}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm" onClick={() => removeCard(card.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Questions ({card.questions.length})</h4>
                        <div className="grid gap-1">
                          {card.questions.slice(0, 3).map((question, index) => (
                            <div key={index} className="text-sm text-slate-600 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                              {question}
                            </div>
                          ))}
                          {card.questions.length > 3 && (
                            <div className="text-sm text-slate-500 ml-3.5">
                              +{card.questions.length - 3} more questions
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-slate-600">
                            Weight: <span className="font-medium">{card.scoringWeight}%</span>
                          </span>
                          <span className="text-slate-600">
                            Max Score: <span className="font-medium">{card.maxScore}</span>
                          </span>
                        </div>
                        {card.group && (
                          <Badge variant="outline" className="text-xs">
                            {card.group}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ) : (
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No questionnaire cards added</h3>
            <p className="text-slate-600 text-center mb-4">
              Add information cards that suppliers will need to fill out during the RFQ process.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AddCardsDialog({ cards, onAdd }: { cards: any[], onAdd: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto space-y-3">
        {cards.map(card => (
          <Card key={card.id} className={`cursor-pointer transition-colors ${selected.includes(card.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-slate-50'}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selected.includes(card.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelected(prev => [...prev, card.id])
                    } else {
                      setSelected(prev => prev.filter(id => id !== card.id))
                    }
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{card.name}</h4>
                  <p className="text-sm text-slate-600 mt-1">{card.description}</p>
                  <div className="mt-2">
                    <p className="text-xs text-slate-500 mb-1">Sample questions:</p>
                    <div className="space-y-1">
                      {card.questions.slice(0, 2).map((question: string, index: number) => (
                        <div key={index} className="text-xs text-slate-600 flex items-center gap-1">
                          <div className="w-1 h-1 bg-slate-400 rounded-full" />
                          {question}
                        </div>
                      ))}
                      {card.questions.length > 2 && (
                        <div className="text-xs text-slate-500 ml-2">
                          +{card.questions.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setSelected([])}>Cancel</Button>
        <Button onClick={() => onAdd(selected)} disabled={selected.length === 0}>
          Add {selected.length} Cards
        </Button>
      </div>
    </div>
  )
}

function CardSettingsDialog({ card, onUpdate, onClose }: { card: QuestionnaireCard, onUpdate: (settings: Partial<QuestionnaireCard>) => void, onClose: () => void }) {
  const [settings, setSettings] = useState({
    scoringType: card.scoringType,
    scoringWeight: card.scoringWeight,
    maxScore: card.maxScore,
    group: card.group || ''
  })

  const handleSave = () => {
    onUpdate(settings)
    onClose()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Scoring Type</Label>
          <Select value={settings.scoringType} onValueChange={(value: 'automatic' | 'manual') => setSettings(prev => ({ ...prev, scoringType: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatic Scoring</SelectItem>
              <SelectItem value="manual">Manual Scoring</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-600">
            {settings.scoringType === 'automatic' 
              ? 'System will automatically score responses based on predefined criteria'
              : 'Responses will require manual review and scoring'
            }
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Scoring Weight (%)</Label>
            <Input
              type="number"
              min="1"
              max="100"
              value={settings.scoringWeight}
              onChange={(e) => setSettings(prev => ({ ...prev, scoringWeight: parseInt(e.target.value) || 10 }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Maximum Score</Label>
            <Input
              type="number"
              min="1"
              max="1000"
              value={settings.maxScore}
              onChange={(e) => setSettings(prev => ({ ...prev, maxScore: parseInt(e.target.value) || 100 }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Custom Group (Optional)</Label>
          <Input
            placeholder="Enter group name"
            value={settings.group}
            onChange={(e) => setSettings(prev => ({ ...prev, group: e.target.value }))}
          />
          <p className="text-xs text-slate-600">
            Group related cards together for better organization
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  )
}