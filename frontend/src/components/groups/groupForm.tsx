// components/groups/group-form.tsx - Reusable group creation/editing form

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateGroupRequest } from '@/lib/types';

interface GroupFormProps {
  initialData?: CreateGroupRequest;
  onSubmit: (data: CreateGroupRequest) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function GroupForm({ 
  initialData, 
  onSubmit, 
  isSubmitting = false, 
  submitLabel = 'Save' 
}: GroupFormProps) {
  const [formData, setFormData] = useState<CreateGroupRequest>({
    name: initialData?.name || '',
    description: initialData?.description || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Group name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Group name must be less than 50 characters';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined
      });
    }
  };

  const handleInputChange = (field: keyof CreateGroupRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Group Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Group Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          type="text"
          placeholder="e.g., User Data APIs"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name}</p>
        )}
        <p className="text-xs text-gray-500">
          Choose a descriptive name for your API group
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Brief description of what this group contains (optional)"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
            errors.description ? 'border-red-500 focus:border-red-500' : ''
          }`}
          disabled={isSubmitting}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
        <p className="text-xs text-gray-500">
          {formData.description?.length || 0}/200 characters
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Creating...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}