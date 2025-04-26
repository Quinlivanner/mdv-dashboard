"use client"

import {useState} from 'react'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {PlusCircle, Search} from 'lucide-react'

interface EmployeeSearchProps {
  onSearch: (searchTerm: string) => void
  onAddClick: () => void
  title: string
}

export function EmployeeSearch({ onSearch, onAddClick, title }: EmployeeSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`搜索${title}...`}
          value={searchTerm}
          onChange={handleSearch}
          className="pl-9 w-full sm:max-w-sm"
        />
      </div>
      <Button onClick={onAddClick} className="flex-shrink-0">
        <PlusCircle className="mr-2 h-4 w-4" />
        添加{title}
      </Button>
    </div>
  )
} 