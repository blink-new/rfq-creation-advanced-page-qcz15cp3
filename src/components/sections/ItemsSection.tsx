import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Package, FileText, Folder, Trash2, Edit, Group } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

interface Item {
  id: string
  name: string
  description: string
  quantity: number
  unit: string
  category: string
  specifications: string
  source: 'catalog' | 'new' | 'request'
  group?: string
}

interface ItemsSectionProps {
  onUpdate: (data: Item[]) => void
  onComplete: () => void
}

export default function ItemsSection({ onUpdate, onComplete }: ItemsSectionProps) {
  const [items, setItems] = useState<Item[]>([])
  const [showAddFromCatalog, setShowAddFromCatalog] = useState(false)
  const [showCreateNew, setShowCreateNew] = useState(false)
  const [showAddFromRequests, setShowAddFromRequests] = useState(false)
  const [showGroupBy, setShowGroupBy] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [groupBy, setGroupBy] = useState<string>('')
  const [customGroups, setCustomGroups] = useState<{[key: string]: string[]}>({})

  // Mock data
  const catalogItems = [
    { id: 'cat1', name: 'Laptop Dell XPS 13', description: 'High-performance laptop', category: 'Electronics', unit: 'pcs' },
    { id: 'cat2', name: 'Office Chair Ergonomic', description: 'Comfortable office chair', category: 'Furniture', unit: 'pcs' },
    { id: 'cat3', name: 'Printer HP LaserJet', description: 'Laser printer', category: 'Electronics', unit: 'pcs' },
    { id: 'cat4', name: 'Desk Lamp LED', description: 'LED desk lamp', category: 'Furniture', unit: 'pcs' }
  ]

  const openRequests = [
    { id: 'req1', name: 'Software Licenses', description: 'Microsoft Office licenses', category: 'Software', unit: 'licenses' },
    { id: 'req2', name: 'Marketing Materials', description: 'Brochures and flyers', category: 'Marketing', unit: 'pcs' },
    { id: 'req3', name: 'Catering Services', description: 'Event catering', category: 'Services', unit: 'events' }
  ]

  const units = ['pcs', 'kg', 'lbs', 'meters', 'liters', 'hours', 'licenses', 'events']
  const categories = ['Electronics', 'Furniture', 'Software', 'Marketing', 'Services', 'Office Supplies']

  useEffect(() => {
    onUpdate(items)
  }, [items, onUpdate])

  useEffect(() => {
    if (items.length > 0) {
      onComplete()
    }
  }, [items.length, onComplete])

  const addItemsFromCatalog = (selectedCatalogItems: string[]) => {
    const newItems = catalogItems
      .filter(item => selectedCatalogItems.includes(item.id))
      .map(item => ({
        id: `item_${Date.now()}_${Math.random()}`,
        name: item.name,
        description: item.description,
        quantity: 1,
        unit: item.unit,
        category: item.category,
        specifications: '',
        source: 'catalog' as const
      }))
    
    setItems(prev => [...prev, ...newItems])
    setShowAddFromCatalog(false)
  }

  const addNewItem = (itemData: Partial<Item>) => {
    const newItem: Item = {
      id: `item_${Date.now()}_${Math.random()}`,
      name: itemData.name || '',
      description: itemData.description || '',
      quantity: itemData.quantity || 1,
      unit: itemData.unit || 'pcs',
      category: itemData.category || '',
      specifications: itemData.specifications || '',
      source: 'new'
    }
    
    setItems(prev => [...prev, newItem])
    setShowCreateNew(false)
  }

  const addItemsFromRequests = (selectedRequestItems: string[]) => {
    const newItems = openRequests
      .filter(item => selectedRequestItems.includes(item.id))
      .map(item => ({
        id: `item_${Date.now()}_${Math.random()}`,
        name: item.name,
        description: item.description,
        quantity: 1,
        unit: item.unit,
        category: item.category,
        specifications: '',
        source: 'request' as const
      }))
    
    setItems(prev => [...prev, ...newItems])
    setShowAddFromRequests(false)
  }

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateItem = (itemId: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ))
  }

  const groupItems = () => {
    if (!groupBy) return items

    const grouped = items.reduce((acc, item) => {
      const key = item[groupBy as keyof Item] as string || 'Ungrouped'
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {} as {[key: string]: Item[]})

    return Object.entries(grouped).flatMap(([group, groupItems]) => [
      { isGroupHeader: true, groupName: group, id: `group_${group}` } as any,
      ...groupItems
    ])
  }

  const displayItems = groupBy ? groupItems() : items

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={showAddFromCatalog} onOpenChange={setShowAddFromCatalog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Package className="w-4 h-4" />
              Add from Catalog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add Items from Catalog</DialogTitle>
            </DialogHeader>
            <CatalogItemsDialog items={catalogItems} onAdd={addItemsFromCatalog} />
          </DialogContent>
        </Dialog>

        <Dialog open={showCreateNew} onOpenChange={setShowCreateNew}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Create New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
            </DialogHeader>
            <CreateNewItemDialog onAdd={addNewItem} units={units} categories={categories} />
          </DialogContent>
        </Dialog>

        <Dialog open={showAddFromRequests} onOpenChange={setShowAddFromRequests}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Add from Open Requests
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add Items from Open Requests</DialogTitle>
            </DialogHeader>
            <OpenRequestsDialog items={openRequests} onAdd={addItemsFromRequests} />
          </DialogContent>
        </Dialog>

        <Dialog open={showGroupBy} onOpenChange={setShowGroupBy}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Group className="w-4 h-4" />
              Group By
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Group Items</DialogTitle>
            </DialogHeader>
            <GroupByDialog 
              currentGroupBy={groupBy} 
              onGroupBy={setGroupBy}
              onClose={() => setShowGroupBy(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Items Table */}
      {items.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Items ({items.length})
              {groupBy && <Badge variant="secondary">Grouped by {groupBy}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayItems.map((item: any) => {
                  if (item.isGroupHeader) {
                    return (
                      <TableRow key={item.id} className="bg-slate-50">
                        <TableCell colSpan={7} className="font-medium text-slate-700">
                          <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4" />
                            {item.groupName}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  }

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                          className="w-20"
                          min="1"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={item.unit} onValueChange={(value) => updateItem(item.id, { unit: value })}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map(unit => (
                              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <Badge variant={item.source === 'catalog' ? 'default' : item.source === 'new' ? 'secondary' : 'outline'}>
                          {item.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No items added yet</h3>
            <p className="text-slate-600 text-center mb-4">
              Start by adding items from your catalog, creating new items, or importing from open requests.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Dialog Components
function CatalogItemsDialog({ items, onAdd }: { items: any[], onAdd: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(item.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelected(prev => [...prev, item.id])
                      } else {
                        setSelected(prev => prev.filter(id => id !== item.id))
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setSelected([])}>Cancel</Button>
        <Button onClick={() => onAdd(selected)} disabled={selected.length === 0}>
          Add {selected.length} Items
        </Button>
      </div>
    </div>
  )
}

function CreateNewItemDialog({ onAdd, units, categories }: { onAdd: (item: any) => void, units: string[], categories: string[] }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 1,
    unit: 'pcs',
    category: '',
    specifications: ''
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter item name"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter item description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
            min="1"
          />
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map(unit => (
                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Specifications</Label>
        <Textarea
          value={formData.specifications}
          onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
          placeholder="Enter technical specifications"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={() => onAdd(formData)} disabled={!formData.name}>
          Add Item
        </Button>
      </div>
    </div>
  )
}

function OpenRequestsDialog({ items, onAdd }: { items: any[], onAdd: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(item.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelected(prev => [...prev, item.id])
                      } else {
                        setSelected(prev => prev.filter(id => id !== item.id))
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setSelected([])}>Cancel</Button>
        <Button onClick={() => onAdd(selected)} disabled={selected.length === 0}>
          Add {selected.length} Items
        </Button>
      </div>
    </div>
  )
}

function GroupByDialog({ currentGroupBy, onGroupBy, onClose }: { currentGroupBy: string, onGroupBy: (value: string) => void, onClose: () => void }) {
  const groupOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'category', label: 'Category' },
    { value: 'source', label: 'Source' },
    { value: 'unit', label: 'Unit' }
  ]

  const handleGroupByChange = (value: string) => {
    // Convert 'none' back to empty string for internal logic
    onGroupBy(value === 'none' ? '' : value)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Group items by:</Label>
        <Select value={currentGroupBy || 'none'} onValueChange={handleGroupByChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select grouping option" />
          </SelectTrigger>
          <SelectContent>
            {groupOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Apply Grouping</Button>
      </div>
    </div>
  )
}