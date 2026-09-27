import React, { useState, useMemo, useRef } from 'react';
import {
  Folder,
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Check,
  X,
  FileSpreadsheet,
  Building2,
  Tag,
  FolderTree,
  AlertCircle
} from 'lucide-react';
import { SupplierMapping, MASTER_SUPPLIER_MAPPINGS } from '../data/supplierMappings';

interface SupplierMappingManagerProps {
  mappings: SupplierMapping[];
  onUpdateMappings: (mappings: SupplierMapping[]) => void;
}

export const SupplierMappingManager: React.FC<SupplierMappingManagerProps> = ({
  mappings,
  onUpdateMappings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'Purchases' | 'Overhead/Service'>('ALL');
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SupplierMapping>>({});

  // Add modal state
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<Omit<SupplierMapping, 'id'>>({
    sheetSupplier: '',
    category: 'Purchases',
    driveFolderMatches: '',
    canonicalName: '',
  });

  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filtered mappings
  const filteredMappings = useMemo(() => {
    return mappings.filter((m) => {
      const matchesCategory =
        selectedCategory === 'ALL' || m.category.toLowerCase().includes(selectedCategory.toLowerCase());
      if (!matchesCategory) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        m.sheetSupplier.toLowerCase().includes(term) ||
        m.canonicalName.toLowerCase().includes(term) ||
        m.driveFolderMatches.toLowerCase().includes(term) ||
        m.category.toLowerCase().includes(term)
      );
    });
  }, [mappings, selectedCategory, searchTerm]);

  // Counts
  const stats = useMemo(() => {
    let purchases = 0;
    let overheads = 0;
    mappings.forEach((m) => {
      if (m.category.toLowerCase().includes('overhead')) overheads++;
      else purchases++;
    });
    return {
      total: mappings.length,
      purchases,
      overheads,
    };
  }, [mappings]);

  // Start edit
  const handleStartEdit = (m: SupplierMapping) => {
    setEditingId(m.id);
    setEditForm({ ...m });
  };

  // Save edit
  const handleSaveEdit = () => {
    if (!editingId || !editForm.sheetSupplier?.trim()) return;

    const updated = mappings.map((m) => {
      if (m.id === editingId) {
        return {
          ...m,
          sheetSupplier: editForm.sheetSupplier?.trim() || m.sheetSupplier,
          category: editForm.category?.trim() || m.category,
          driveFolderMatches: editForm.driveFolderMatches?.trim() || '',
          canonicalName: editForm.canonicalName?.trim() || editForm.sheetSupplier?.trim() || m.canonicalName,
        };
      }
      return m;
    });

    onUpdateMappings(updated);
    setEditingId(null);
    setEditForm({});
    showNotification('Supplier mapping updated successfully.');
  };

  // Delete mapping
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the supplier mapping for "${name}"?`)) {
      const updated = mappings.filter((m) => m.id !== id);
      onUpdateMappings(updated);
      showNotification(`Deleted mapping for "${name}".`);
    }
  };

  // Add new
  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.sheetSupplier.trim()) return;

    const newItem: SupplierMapping = {
      id: `sup-${Date.now()}`,
      sheetSupplier: newForm.sheetSupplier.trim(),
      category: newForm.category.trim() || 'Purchases',
      driveFolderMatches: newForm.driveFolderMatches.trim() || newForm.sheetSupplier.trim(),
      canonicalName: newForm.canonicalName.trim() || newForm.sheetSupplier.trim(),
    };

    onUpdateMappings([newItem, ...mappings]);
    setNewForm({
      sheetSupplier: '',
      category: 'Purchases',
      driveFolderMatches: '',
      canonicalName: '',
    });
    setIsAdding(false);
    showNotification(`Added new supplier "${newItem.sheetSupplier}".`);
  };

  // Reset to default 190+ master list
  const handleResetToMaster = () => {
    if (window.confirm('Reset all supplier normalization mappings back to the default master list (190+ suppliers)? Any custom edits will be replaced.')) {
      onUpdateMappings(MASTER_SUPPLIER_MAPPINGS);
      showNotification('Reset all supplier mappings to master defaults.');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const escapeCsv = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
    const headers = ['Sheet Supplier', 'Category', 'Drive Folder Match(es)', 'Canonical Name'];
    const rows = mappings.map((m) => [
      escapeCsv(m.sheetSupplier),
      escapeCsv(m.category),
      escapeCsv(m.driveFolderMatches),
      escapeCsv(m.canonicalName),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supplier_normalization_mappings_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import CSV
  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) return;

        const parseCsvLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const parsedMappings: SupplierMapping[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCsvLine(lines[i]);
          if (cols.length >= 2 && cols[0]) {
            parsedMappings.push({
              id: `imported-${i}-${Date.now()}`,
              sheetSupplier: cols[0],
              category: cols[1] || 'Purchases',
              driveFolderMatches: cols[2] || cols[0],
              canonicalName: cols[3] || cols[0],
            });
          }
        }

        if (parsedMappings.length > 0) {
          onUpdateMappings(parsedMappings);
          showNotification(`Successfully imported ${parsedMappings.length} supplier mappings.`);
        }
      } catch (err: any) {
        alert('Failed to parse CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Building2 className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-white">
                Supplier Normalization &amp; Drive Folder Directory ({mappings.length} Suppliers)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Every invoice is saved inside its corresponding supplier's Google Drive folder. This directory normalizes raw sheet names (e.g. <code className="text-amber-300">BLANCO</code>, <code className="text-amber-300">Screwfix Direct Ltd / Trade</code>) to their exact Drive folder targets. You can add new suppliers or edit folder aliases at any time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAdding(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supplier</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              title="Export current mappings as CSV"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              title="Import CSV of mappings"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Import CSV</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportCsv}
              className="hidden"
            />

            <button
              onClick={handleResetToMaster}
              className="text-xs text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              title="Reset all mappings back to initial 190+ master list"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Total Suppliers</span>
            <span className="text-lg font-bold text-white font-mono">{stats.total}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Purchases Category</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{stats.purchases}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Overhead / Service</span>
            <span className="text-lg font-bold text-amber-400 font-mono">{stats.overheads}</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-1">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            {notification}
          </span>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search supplier, canonical name, or Drive folder..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-slate-500 text-[11px] mr-1 shrink-0">Category:</span>
          {(['ALL', 'Purchases', 'Overhead/Service'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Supplier Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Add New Supplier Normalization
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNew} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Sheet Supplier Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newForm.sheetSupplier}
                  onChange={(e) => setNewForm({ ...newForm, sheetSupplier: e.target.value })}
                  placeholder="e.g. Screwfix Direct Ltd"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Category
                </label>
                <select
                  value={newForm.category}
                  onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-sans"
                >
                  <option value="Purchases">Purchases</option>
                  <option value="Overhead/Service">Overhead/Service</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Drive Folder Match(es) (e.g. exact folder name or aliases separated by / or |)
                </label>
                <input
                  type="text"
                  value={newForm.driveFolderMatches}
                  onChange={(e) => setNewForm({ ...newForm, driveFolderMatches: e.target.value })}
                  placeholder="e.g. Screwfix Direct Ltd / Screwfix"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Canonical Name
                </label>
                <input
                  type="text"
                  value={newForm.canonicalName}
                  onChange={(e) => setNewForm({ ...newForm, canonicalName: e.target.value })}
                  placeholder="e.g. Screwfix Direct Ltd | Screwfix"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Directory Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">
              Supplier Normalization Table ({filteredMappings.length} shown)
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Click edit to update target folder names or aliases
          </span>
        </div>

        <div className="overflow-x-auto max-h-[540px] overflow-y-auto border border-slate-800 rounded-xl bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold sticky top-0 border-b border-slate-800 z-10 text-[10px]">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Sheet Supplier</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Drive Folder Match(es)</th>
                <th className="py-2.5 px-3">Canonical Name</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredMappings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 font-sans italic">
                    No supplier mappings match "{searchTerm}". Click "Add Supplier" to create one.
                  </td>
                </tr>
              ) : (
                filteredMappings.map((item, idx) => {
                  const isEditing = editingId === item.id;
                  return (
                    <tr key={item.id} className="hover:bg-slate-900/60 transition">
                      <td className="py-2 px-3 text-slate-500 font-sans">{idx + 1}</td>
                      
                      {/* Sheet Supplier */}
                      <td className="py-2 px-3 font-sans font-medium text-slate-200">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.sheetSupplier || ''}
                            onChange={(e) => setEditForm({ ...editForm, sheetSupplier: e.target.value })}
                            className="w-full bg-slate-900 border border-amber-500/50 rounded px-2 py-1 text-white text-xs font-mono focus:outline-none"
                          />
                        ) : (
                          item.sheetSupplier
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-2 px-3">
                        {isEditing ? (
                          <select
                            value={editForm.category || 'Purchases'}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="bg-slate-900 border border-amber-500/50 rounded px-2 py-1 text-white text-xs font-sans focus:outline-none"
                          >
                            <option value="Purchases">Purchases</option>
                            <option value="Overhead/Service">Overhead/Service</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans font-medium ${
                              item.category.toLowerCase().includes('overhead')
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            <Tag className="w-3 h-3" />
                            {item.category}
                          </span>
                        )}
                      </td>

                      {/* Drive Folder Matches */}
                      <td className="py-2 px-3 text-slate-300">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.driveFolderMatches || ''}
                            onChange={(e) => setEditForm({ ...editForm, driveFolderMatches: e.target.value })}
                            className="w-full bg-slate-900 border border-amber-500/50 rounded px-2 py-1 text-amber-300 text-xs font-mono focus:outline-none"
                          />
                        ) : (
                          <div className="flex items-center gap-1 text-purple-300">
                            <Folder className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="truncate max-w-[260px]" title={item.driveFolderMatches || item.sheetSupplier}>
                              {item.driveFolderMatches || item.sheetSupplier}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Canonical Name */}
                      <td className="py-2 px-3 text-slate-400">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.canonicalName || ''}
                            onChange={(e) => setEditForm({ ...editForm, canonicalName: e.target.value })}
                            className="w-full bg-slate-900 border border-amber-500/50 rounded px-2 py-1 text-slate-200 text-xs font-mono focus:outline-none"
                          />
                        ) : (
                          <span className="truncate max-w-[260px] block" title={item.canonicalName}>
                            {item.canonicalName}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={handleSaveEdit}
                              className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition cursor-pointer"
                              title="Save changes"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition cursor-pointer"
                              title="Edit folder match and canonical name"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.sheetSupplier)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                              title="Delete mapping"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
