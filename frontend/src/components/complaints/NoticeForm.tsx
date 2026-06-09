import React, { useState } from 'react';
import { Send, ImagePlus, X, Loader2 } from 'lucide-react';
import api from '../../api';

interface NoticeFormProps {
  onSuccess: () => void;
}

function NoticeForm({ onSuccess }: NoticeFormProps) {
  const [sendToTenant, setSendToTenant] = useState(false);
  const [sendToLandlord, setSendToLandlord] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [priority, setPriority] = useState('moderate');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 3 - images.length);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));

    setImages((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!sendToTenant && !sendToLandlord) {
      setError('Please select at least one recipient (Tenant or Landlord).');
      return;
    }

    if (!subject.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const targets = [];
      if (sendToTenant) targets.push('tenant');
      if (sendToLandlord) targets.push('landlord');

      // Send a separate request for each target role selected
      for (const targetRole of targets) {
        const formData = new FormData();
        formData.append('targetRole', targetRole);
        formData.append('category', targetRole === 'tenant' ? 'tenant-notice' : 'landlord-notice');
        formData.append('subject', subject.trim());
        formData.append('description', description.trim());
        formData.append('isNotice', 'true');
        formData.append('priority', priority);
        if (flatNo.trim()) {
          formData.append('flatNo', flatNo.trim());
        }

        images.forEach((img) => {
          formData.append('images', img);
        });

        await api.post('/complaints', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setSuccessMsg('Notice sent successfully!');
      setSendToTenant(false);
      setSendToLandlord(false);
      setSubject('');
      setDescription('');
      setFlatNo('');
      setPriority('moderate');
      previews.forEach((p) => URL.revokeObjectURL(p));
      setImages([]);
      setPreviews([]);
      onSuccess();

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send notice.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Send className="w-5 h-5 text-[#3b82f6]" />
        Send a Notice
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
          {successMsg}
        </div>
      )}

      {/* Send To */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Send To *</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={sendToTenant} 
              onChange={(e) => setSendToTenant(e.target.checked)} 
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Tenant
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={sendToLandlord} 
              onChange={(e) => setSendToLandlord(e.target.checked)} 
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Landlord
          </label>
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority *</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition"
        >
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Flat Number (Optional for Notices) */}
      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Flat Number (Optional)</label>
        <input
          type="text"
          value={flatNo}
          onChange={(e) => setFlatNo(e.target.value)}
          placeholder="e.g. A-101 (Leave empty to broadcast to all)"
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition"
        />
        <p className="text-xs text-slate-500 mt-1">If provided, notice goes only to the occupants/owners of this flat.</p>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject *</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief title for your notice"
          maxLength={200}
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your notice in detail..."
          rows={4}
          maxLength={2000}
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition resize-none"
        />
        <p className="text-xs text-slate-400 mt-1 text-right">{description.length}/2000</p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Attach Images <span className="text-slate-400 font-normal">(up to 3)</span>
        </label>

        <div className="flex items-center gap-3 flex-wrap">
          {previews.map((src, idx) => (
            <div key={idx} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
              <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          ))}

          {images.length < 3 && (
            <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#3b82f6] hover:bg-blue-50/50 transition-colors">
              <ImagePlus className="w-5 h-5 text-slate-400" />
              <span className="text-[10px] text-slate-400 mt-1">Add</span>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageAdd}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Notice
          </>
        )}
      </button>
    </form>
  );
}

export default NoticeForm;
