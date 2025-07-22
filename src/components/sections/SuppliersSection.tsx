import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Users, Search, Filter, Trash2, Star, MapPin, Building, Phone, Mail } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  location: string
  category: string[]
  rating: number
  description: string
  certifications: string[]
  yearsInBusiness: number
  source: 'existing' | 'new'
}

interface SuppliersSectionProps {
  onUpdate: (data: Supplier[]) => void
  onComplete: () => void
}

export default function SuppliersSection({ onUpdate, onComplete }: SuppliersSectionProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showCreateNew, setShowCreateNew] = useState(false)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)

  // Mock existing suppliers
  const existingSuppliers = [
    {
      id: 'sup1',
      name: 'TechCorp Solutions',
      email: 'contact@techcorp.com',
      phone: '+1-555-0123',
      location: 'New York, NY',
      category: ['Electronics', 'Software'],
      rating: 4.8,
      description: 'Leading technology solutions provider',
      certifications: ['ISO 9001', 'ISO 27001'],
      yearsInBusiness: 15
    },
    {
      id: 'sup2',
      name: 'Global Furniture Co',
      email: 'sales@globalfurniture.com',
      phone: '+1-555-0124',
      location: 'Los Angeles, CA',
      category: ['Furniture', 'Office Supplies'],
      rating: 4.5,
      description: 'Premium office furniture manufacturer',
      certifications: ['FSC Certified', 'GREENGUARD'],
      yearsInBusiness: 22
    },
    {
      id: 'sup3',
      name: 'Swift Logistics',
      email: 'info@swiftlogistics.com',
      phone: '+1-555-0125',
      location: 'Chicago, IL',
      category: ['Logistics', 'Transportation'],
      rating: 4.6,
      description: 'Reliable logistics and transportation services',
      certifications: ['DOT Certified', 'ISO 14001'],
      yearsInBusiness: 8
    },
    {
      id: 'sup4',
      name: 'Creative Marketing Hub',
      email: 'hello@creativehub.com',
      phone: '+1-555-0126',
      location: 'Austin, TX',
      category: ['Marketing', 'Design'],
      rating: 4.7,
      description: 'Full-service marketing and design agency',
      certifications: ['Google Partner', 'HubSpot Certified'],
      yearsInBusiness: 12
    },
    {
      id: 'sup5',
      name: 'Industrial Equipment Pro',
      email: 'sales@industrialequip.com',
      phone: '+1-555-0127',
      location: 'Detroit, MI',
      category: ['Industrial', 'Manufacturing'],
      rating: 4.4,
      description: 'Industrial equipment and machinery supplier',
      certifications: ['OSHA Compliant', 'CE Marked'],
      yearsInBusiness: 28
    }
  ]

  useEffect(() => {
    onUpdate(suppliers)
  }, [suppliers, onUpdate])

  useEffect(() => {
    if (suppliers.length > 0) {
      onComplete()
    }
  }, [suppliers.length, onComplete])

  const addSuppliersFromList = (selectedSupplierIds: string[]) => {
    const newSuppliers = existingSuppliers
      .filter(supplier => selectedSupplierIds.includes(supplier.id))
      .map(supplier => ({ ...supplier, source: 'existing' as const }))
    
    setSuppliers(prev => [...prev, ...newSuppliers])
    setShowQuickAdd(false)
  }

  const addNewSupplier = (supplierData: Partial<Supplier>) => {
    const newSupplier: Supplier = {
      id: `sup_${Date.now()}_${Math.random()}`,
      name: supplierData.name || '',
      email: supplierData.email || '',
      phone: supplierData.phone || '',
      location: supplierData.location || '',
      category: supplierData.category || [],
      rating: 0,
      description: supplierData.description || '',
      certifications: supplierData.certifications || [],
      yearsInBusiness: supplierData.yearsInBusiness || 0,
      source: 'new'
    }
    
    setSuppliers(prev => [...prev, newSupplier])
    setShowCreateNew(false)
  }

  const removeSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={showQuickAdd} onOpenChange={setShowQuickAdd}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Quick Add Suppliers
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add Suppliers from List</DialogTitle>
            </DialogHeader>
            <QuickAddDialog suppliers={existingSuppliers} onAdd={addSuppliersFromList} />
          </DialogContent>
        </Dialog>

        <Dialog open={showCreateNew} onOpenChange={setShowCreateNew}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Create New Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Supplier</DialogTitle>
            </DialogHeader>
            <CreateSupplierDialog onAdd={addNewSupplier} />
          </DialogContent>
        </Dialog>

        <Dialog open={showAdvancedSearch} onOpenChange={setShowAdvancedSearch}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              Advanced Search
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Advanced Supplier Search</DialogTitle>
            </DialogHeader>
            <AdvancedSearchDialog suppliers={existingSuppliers} onAdd={addSuppliersFromList} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Selected Suppliers */}
      {suppliers.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium">Selected Suppliers ({suppliers.length})</h3>
          </div>

          <div className="grid gap-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${supplier.name}`} />
                        <AvatarFallback>{supplier.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900">{supplier.name}</h4>
                            <Badge variant={supplier.source === 'existing' ? 'default' : 'secondary'}>
                              {supplier.source}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{supplier.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-600">{supplier.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-600">{supplier.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-600">{supplier.location}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {supplier.rating > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="flex">{renderStars(supplier.rating)}</div>
                                <span className="text-sm font-medium">{supplier.rating}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                              <Building className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-600">{supplier.yearsInBusiness} years in business</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-slate-700">Categories:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {supplier.category.map((cat, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {supplier.certifications.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-slate-700">Certifications:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {supplier.certifications.map((cert, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {cert}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => removeSupplier(supplier.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No suppliers selected</h3>
            <p className="text-slate-600 text-center mb-4">
              Add suppliers from your existing list, create new ones, or use advanced search to find the right suppliers for your RFQ.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function QuickAddDialog({ suppliers, onAdd }: { suppliers: any[], onAdd: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.some((cat: string) => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredSuppliers.map(supplier => (
          <Card key={supplier.id} className={`cursor-pointer transition-colors ${selected.includes(supplier.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-slate-50'}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selected.includes(supplier.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelected(prev => [...prev, supplier.id])
                    } else {
                      setSelected(prev => prev.filter(id => id !== supplier.id))
                    }
                  }}
                />
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${supplier.name}`} />
                  <AvatarFallback>{supplier.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900">{supplier.name}</h4>
                    <div className="flex">{Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(supplier.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                      />
                    ))}</div>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{supplier.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>{supplier.location}</span>
                    <span>{supplier.yearsInBusiness} years</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {supplier.category.slice(0, 3).map((cat: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
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
          Add {selected.length} Suppliers
        </Button>
      </div>
    </div>
  )
}

function CreateSupplierDialog({ onAdd }: { onAdd: (supplier: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    category: [] as string[],
    description: '',
    certifications: [] as string[],
    yearsInBusiness: 0
  })

  const categories = ['Electronics', 'Furniture', 'Software', 'Marketing', 'Services', 'Industrial', 'Manufacturing', 'Logistics']

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Company Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter company name"
          />
        </div>
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email address"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Enter phone number"
          />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Enter location"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter company description"
        />
      </div>

      <div className="space-y-2">
        <Label>Years in Business</Label>
        <Input
          type="number"
          value={formData.yearsInBusiness}
          onChange={(e) => setFormData(prev => ({ ...prev, yearsInBusiness: parseInt(e.target.value) || 0 }))}
          min="0"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={() => onAdd(formData)} disabled={!formData.name || !formData.email}>
          Create Supplier
        </Button>
      </div>
    </div>
  )
}

function AdvancedSearchDialog({ suppliers, onAdd }: { suppliers: any[], onAdd: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const [filters, setFilters] = useState({
    category: '',
    minRating: 0,
    location: '',
    minYears: 0
  })

  const filteredSuppliers = suppliers.filter(supplier => {
    if (filters.category && !supplier.category.includes(filters.category)) return false
    if (filters.minRating && supplier.rating < filters.minRating) return false
    if (filters.location && !supplier.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (filters.minYears && supplier.yearsInBusiness < filters.minYears) return false
    return true
  })

  return (
    <div className="space-y-4">
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filters.category || 'any'} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value === 'any' ? '' : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any category</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Minimum Rating</Label>
              <Select value={filters.minRating === 0 ? 'any' : filters.minRating.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value === 'any' ? 0 : parseFloat(value) }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any rating</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
            <div className="space-y-2">
              <Label>Minimum Years in Business</Label>
              <Input
                type="number"
                value={filters.minYears}
                onChange={(e) => setFilters(prev => ({ ...prev, minYears: parseInt(e.target.value) || 0 }))}
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Found {filteredSuppliers.length} suppliers</span>
          <Button variant="outline" size="sm" onClick={() => setFilters({ category: '', minRating: 0, location: '', minYears: 0 })}>
            Clear Filters
          </Button>
        </div>
        
        <div className="max-h-64 overflow-y-auto space-y-2">
          {filteredSuppliers.map(supplier => (
            <Card key={supplier.id} className={`cursor-pointer transition-colors ${selected.includes(supplier.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-slate-50'}`}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selected.includes(supplier.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelected(prev => [...prev, supplier.id])
                      } else {
                        setSelected(prev => prev.filter(id => id !== supplier.id))
                      }
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{supplier.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs">{supplier.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span>{supplier.location}</span>
                      <span>{supplier.yearsInBusiness} years</span>
                      <span>{supplier.category.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setSelected([])}>Cancel</Button>
        <Button onClick={() => onAdd(selected)} disabled={selected.length === 0}>
          Add {selected.length} Suppliers
        </Button>
      </div>
    </div>
  )
}