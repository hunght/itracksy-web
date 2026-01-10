'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { CreateLeadModal } from '@/app/admin/leads/leads/create-lead-modal';
import { UploadLeadsModal } from '@/app/admin/leads/leads/upload-leads-modal';
import { ImportFromFeedbackModal } from '@/app/admin/leads/leads/import-from-feedback-modal';
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
import {
  Tag,
  Plus,
  Calendar,
  Users,
  Mail,
  Search,
  RefreshCw,
  Trash2,
  UserPlus,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

// Function to format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function LeadsPage() {
  const supabase = useSupabaseBrowser();
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
  const [availableGroups, setAvailableGroups] = useState<string[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [showGroupInput, setShowGroupInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: leadsList = [],
    isLoading,
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
      const { data, error } = (await (supabase as any)
        .from('leads')
        .select('group')
        .not('group', 'is', null)) as {
        data: { group: string | null }[] | null;
        error: Error | null;
      };

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

  // Filter leads by search
  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leadsList;
    const query = searchQuery.toLowerCase();
    return leadsList.filter(
      (lead) =>
        lead.name?.toLowerCase().includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.message?.toLowerCase().includes(query) ||
        lead.group?.toLowerCase().includes(query),
    );
  }, [leadsList, searchQuery]);

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
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads([...filteredLeads]);
    }
  };

  // Add selected leads to a group
  const addLeadsToGroup = async (groupName: string) => {
    if (selectedLeads.length === 0) return;

    const leadIds = selectedLeads
      .map((lead) => lead.id)
      .filter((id): id is string => id !== undefined);
    if (leadIds.length === 0) return;

    const { error } = await (supabase as any)
      .from('leads')
      .update({ group: groupName })
      .in('id', leadIds);

    if (!error) {
      refetch();
      setSelectedLeads([]);
    }
  };

  // Remove leads from group
  const removeFromGroup = async () => {
    if (selectedLeads.length === 0) return;

    const leadIds = selectedLeads
      .map((lead) => lead.id)
      .filter((id): id is string => id !== undefined);
    if (leadIds.length === 0) return;

    const { error } = await (supabase as any)
      .from('leads')
      .update({ group: null })
      .in('id', leadIds);

    if (!error) {
      refetch();
      setSelectedLeads([]);
    }
  };

  // Delete selected leads
  const deleteSelectedLeads = async () => {
    if (selectedLeads.length === 0) return;

    const leadIds = selectedLeads
      .map((lead) => lead.id)
      .filter((id): id is string => id !== undefined);
    if (leadIds.length === 0) return;

    const { error } = await (supabase as any)
      .from('leads')
      .delete()
      .in('id', leadIds);

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

  // Calculate stats
  const stats = {
    total: leadsList.length,
    withEmail: leadsList.filter((l) => l.email).length,
    groups: availableGroups.length,
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Stats Cards */}
      <div className="grid-shrink-0 mb-6 grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">With Email</p>
              <p className="text-2xl font-bold">{stats.withEmail}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
              <Tag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Groups</p>
              <p className="text-2xl font-bold">{stats.groups}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Leads Management
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                <RefreshCw
                  className={cn('h-4 w-4', isLoading && 'animate-spin')}
                />
              </Button>
              <ImportFromFeedbackModal />
              <CreateLeadModal />
              <UploadLeadsModal />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col p-4">
          {/* Filters */}
          <div className="mb-4 flex flex-shrink-0 flex-wrap items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={groupFilter || 'all'}
              onValueChange={(value) =>
                setGroupFilter(value === 'all' ? null : value)
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leads</SelectItem>
                {availableGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      {group}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selection actions */}
          {selectedLeads.length > 0 && (
            <div className="mb-4 flex flex-shrink-0 items-center gap-2 rounded-lg bg-muted p-3">
              <span className="text-sm font-medium">
                {selectedLeads.length} selected
              </span>
              <div className="flex-1" />
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
              <Button
                size="sm"
                variant="destructive"
                onClick={deleteSelectedLeads}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}

          {showGroupInput && (
            <div className="mb-4 flex flex-shrink-0 items-center gap-2">
              <Input
                placeholder="New group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="max-w-xs"
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

          {/* Table */}
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
              <Users className="mb-4 h-16 w-16" />
              <p className="text-lg">No leads found</p>
              <p className="text-sm">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Add your first lead to get started'}
              </p>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
              <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
                <div className="flex items-center gap-2">
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
                <span className="text-sm text-muted-foreground">
                  {filteredLeads.length} leads
                </span>
              </div>
              <ScrollArea className="h-[calc(100%-41px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <span className="sr-only">Select</span>
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="w-[250px]">Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow
                        key={lead.id}
                        className={cn(
                          selectedLeads.some((s) => s.id === lead.id) &&
                            'bg-muted/50',
                        )}
                      >
                        <TableCell>
                          <Checkbox
                            id={`lead-${lead.id}`}
                            checked={selectedLeads.some(
                              (selected) => selected.id === lead.id,
                            )}
                            onCheckedChange={() => toggleLeadSelection(lead)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {lead.name || (
                            <span className="text-muted-foreground">
                              No name
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lead.email || (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lead.phone || (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lead.group ? (
                            <Badge variant="outline" className="font-normal">
                              <Tag className="mr-1 h-3 w-3" />
                              {lead.group}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDate(lead.created_at ?? null)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <p className="truncate text-sm text-muted-foreground">
                            {lead.message || (
                              <span className="italic">No message</span>
                            )}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
