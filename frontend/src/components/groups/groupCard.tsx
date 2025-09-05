// components/groups/group-card.tsx - Individual group display card

'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApiGroup } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';
import { Database, Globe, Trash2, MoreHorizontal } from 'lucide-react';

interface GroupCardProps {
  group: ApiGroup;
  onDelete?: (id: string) => void;
}

export function GroupCard({ group, onDelete }: GroupCardProps) {
  const handleDelete = () => {
    if (onDelete && confirm(`Are you sure you want to delete "${group.name}"?`)) {
      onDelete(group.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{group.name}</CardTitle>
              {group.description && (
                <CardDescription className="mt-1">
                  {group.description}
                </CardDescription>
              )}
            </div>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-blue-600">
              <Globe className="w-4 h-4" />
              <span>{group._count.apiSources} APIs</span>
            </div>
            <div className="text-gray-600">
              {group._count.requests} requests
            </div>
          </div>
          <div className="text-gray-500 text-xs">
            {formatRelativeTime(group.createdAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2 border-t">
          <Link href={`/groups/${group.id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              View Details
            </Button>
          </Link>
          <Link href={`/groups/${group.id}/add-api`}>
            <Button variant="ghost" size="sm">
              Add API
            </Button>
          </Link>
        </div>

        {/* Quick Info */}
        {group.apiSources && group.apiSources.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Recent APIs:</div>
            <div className="space-y-1">
              {group.apiSources.slice(0, 2).map((api) => (
                <div key={api.id} className="flex items-center justify-between text-xs">
                  <span className="font-medium truncate">{api.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    api.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {api.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
              {group.apiSources.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{group.apiSources.length - 2} more APIs
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}