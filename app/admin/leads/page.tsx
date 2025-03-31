'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { CreateLeadModal } from '@/app/admin/leads/leads/create-lead-modal';
import { UploadLeadsModal } from '@/app/admin/leads/leads/upload-leads-modal';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tag, Filter, Plus } from 'lucide-react';

export default function LeadsPage() {
  const supabase = useSupabaseBrowser();
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
  const [availableGroups, setAvailableGroups] = useState<string[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [showGroupInput, setShowGroupInput] = useState(false);

  const {
    data: leadsList = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Lead[]>({
    queryKey: ['leads', groupFilter],
    queryFn: async () => {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (groupFilter) {
        query = query.eq('group', groupFilter);
      }

      const { data: leadsData, error: leadsError } = await query;

      if (leadsError) throw leadsError;
      return leadsData as Lead[];
    },
  });

  // Fetch available groups
  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('group')
        .not('group', 'is', null);

      if (!error && data) {
        const groups = data
          .map((lead) => lead.group)
          .filter(
            (group, index, self) =>
              group !== null && self.indexOf(group) === index,
          ) as string[];

        setAvailableGroups(groups);
      }
    };

    fetchGroups();
  }, [supabase, leadsList]);

  // Handle lead selection
  const toggleLeadSelection = (lead: Lead) => {
    if (selectedLeads.some((selected) => selected.id === lead.id)) {
      setSelectedLeads(
        selectedLeads.filter((selected) => selected.id !== lead.id),
      );
    } else {
      setSelectedLeads([...selectedLeads, lead]);
    }
  };

  // Select/deselect all leads
  const toggleSelectAll = () => {
    if (selectedLeads.length === leadsList.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads([...leadsList]);
    }
  };

  // Add selected leads to a group
  const addLeadsToGroup = async (groupName: string) => {
    if (selectedLeads.length === 0) return;

    const { error } = await supabase
      .from('leads')
      .update({ group: groupName })
      .in(
        'id',
        selectedLeads.map((lead) => lead.id),
      );

    if (!error) {
      refetch();
      setSelectedLeads([]);
    }
  };

  // Remove leads from group
  const removeFromGroup = async () => {
    if (selectedLeads.length === 0) return;

    const { error } = await supabase
      .from('leads')
      .update({ group: null })
      .in(
        'id',
        selectedLeads.map((lead) => lead.id),
      );

    if (!error) {
      refetch();
      setSelectedLeads([]);
    }
  };

  // Create a new group
  const createNewGroup = async () => {
    if (!newGroupName.trim()) return;

    await addLeadsToGroup(newGroupName.trim());
    setNewGroupName('');
    setShowGroupInput(false);
  };

  const filteredLeads = leadsList;

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Leads Management</CardTitle>
          <div className="flex space-x-2">
            <CreateLeadModal />
            <UploadLeadsModal />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <Select
                value={groupFilter || 'all'}
                onValueChange={(value) =>
                  setGroupFilter(value === 'all' ? null : value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leads</SelectItem>
                  {availableGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedLeads.length > 0 && (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Tag className="mr-2 h-4 w-4" />
                      Add to Group
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {availableGroups.map((group) => (
                      <DropdownMenuItem
                        key={group}
                        onClick={() => addLeadsToGroup(group)}
                      >
                        {group}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onClick={() => setShowGroupInput(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Group
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="sm" variant="outline" onClick={removeFromGroup}>
                  Remove from Group
                </Button>
              </div>
            )}
          </div>

          {showGroupInput && (
            <div className="mb-4 flex items-center gap-2">
              <Input
                placeholder="New group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Button onClick={createNewGroup}>Create</Button>
              <Button
                variant="outline"
                onClick={() => setShowGroupInput(false)}
              >
                Cancel
              </Button>
            </div>
          )}

          {filteredLeads.length === 0 ? (
            <p>No leads available.</p>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selectAll"
                    checked={
                      filteredLeads.length > 0 &&
                      selectedLeads.length === filteredLeads.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                  <label htmlFor="selectAll" className="text-sm font-medium">
                    Select All
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {selectedLeads.length} of {filteredLeads.length} selected
                  </span>
                </div>
              </div>
              <ul className="space-y-4">
                {filteredLeads.map((lead) => (
                  <li key={lead.id} className="flex items-center border-b py-2">
                    <Checkbox
                      id={`lead-${lead.id}`}
                      checked={selectedLeads.some(
                        (selected) => selected.id === lead.id,
                      )}
                      onCheckedChange={() => toggleLeadSelection(lead)}
                      className="mr-3"
                    />
                    <div className="grid flex-1 grid-cols-6 gap-4">
                      <span className="truncate font-semibold">
                        {lead.name}
                      </span>
                      <span className="truncate">{lead.email}</span>
                      <span className="truncate">{lead.phone}</span>
                      <span className="truncate">
                        {lead.group ? (
                          <Badge variant="outline">{lead.group}</Badge>
                        ) : null}
                      </span>
                      <span className="col-span-2 truncate">
                        {lead.message || 'No message'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
