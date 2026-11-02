import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Building2,
  Check,
  Download,
  FileText,
  Image,
  Mail,
  MessageCircle,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Upload,
  Users,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

import AdminSidebar from '../../components/admin/adminSiderbar.jsx';
import dummyData from '../../assets/dummyData.json';
import { contentIconMap, getContentIcon } from '../../components/client/ContentIcons.jsx';
import { useAppContext } from '../../context/AppContext.jsx';

const iconOptions = contentIconMap;

const imageFieldPattern = /image|avatar|mediaurl|logo/i;
const iconFieldPattern = /(^|[.])icon$/i;

const compressImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('Unable to read this image file.'));
  reader.onload = () => {
    const image = new window.Image();
    image.onerror = () => reject(new Error('This image could not be decoded.'));
    image.onload = () => {
      const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Image processing is not supported by this browser.'));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      let quality = 0.82;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);
      while (dataUrl.length > 520_000 && quality > 0.42) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }
      if (dataUrl.length > 520_000) {
        reject(new Error('This image is too large after compression. Choose a smaller image.'));
        return;
      }
      resolve(dataUrl);
    };
    image.src = String(reader.result);
  };
  reader.readAsDataURL(file);
});

const IconPicker = ({ value, onChange }) => {
  const IconPreview = iconOptions[value] || Sparkles;
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
        <IconPreview className="h-5 w-5" />
      </span>
      <select
        value={iconOptions[value] ? value : 'Sparkles'}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/40"
      >
        {Object.keys(iconOptions).map((name) => <option key={name} value={name}>{name}</option>)}
      </select>
    </div>
  );
};

const ImageFieldEditor = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Choose an image smaller than 8 MB.');
      return;
    }
    setUploading(true);
    try {
      onChange(await compressImage(file));
      toast.success('Image uploaded and optimized.');
    } catch (error) {
      console.error('Unable to process content image.', error);
      toast.error(error.message || 'Image could not be processed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste an image URL or upload an image"
        className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/40"
      />
      {value && (
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-2.5">
          <img src={value} alt="Content preview" className="h-16 w-20 rounded-lg object-cover" />
          <span className="min-w-0 break-all text-[10px] text-gray-500">{value.startsWith('data:') ? 'Optimized uploaded image' : value}</span>
          <button type="button" onClick={() => onChange('')} className="ml-auto shrink-0 rounded-lg border border-rose-300/15 px-2.5 py-1.5 text-[10px] font-semibold text-rose-200 hover:bg-rose-300/10">
            Remove
          </button>
        </div>
      )}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06] px-3.5 py-2.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/15">
        <Image className="h-4 w-4" />
        {uploading ? 'Optimizing image...' : 'Upload image'}
        <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={handleUpload} className="sr-only" />
      </label>
      <p className="text-[10px] leading-relaxed text-gray-500">JPG, PNG, WebP up to 8 MB. Uploaded images are resized/compressed for browser storage.</p>
    </div>
  );
};

const managementSections = [
  {
    id: 'header',
    label: 'Header Manage',
    description: 'Manage the site logo, primary navigation and dropdown menu items.',
    icon: Activity,
    accent: 'text-cyan-200 border-cyan-300/20 bg-cyan-300/10',
    sources: [
      { key: 'headerData', label: 'Header branding', collections: [] },
      { key: 'navigation', label: 'Navigation menu', collections: [] }
    ]
  },
  {
    id: 'footer',
    label: 'Footer Manage',
    description: 'Manage footer content, useful links, social channels, groups and legal links.',
    icon: FileText,
    accent: 'text-indigo-200 border-indigo-300/20 bg-indigo-300/10',
    sources: [{
      key: 'footerData',
      label: 'Footer content',
      collections: ['usefulLinks', 'socialLinks', 'communityGroups', 'legalLinks']
    }]
  },
  {
    id: 'hero',
    label: 'Hero Manage',
    description: 'Homepage headline, calls to action, slogans and highlight cards.',
    icon: Activity,
    accent: 'text-amber-200 border-amber-300/20 bg-amber-300/10',
    sources: [{ key: 'heroData', label: 'Homepage hero', collections: ['slogans', 'highlights'] }]
  },
  {
    id: 'about',
    label: 'About Manage',
    description: 'Homepage about summary and the full About page content.',
    icon: FileText,
    accent: 'text-violet-200 border-violet-300/20 bg-violet-300/10',
    sources: [
      { key: 'aboutSection', label: 'Homepage about section', collections: ['features'] },
      { key: 'aboutPage', label: 'About page', collections: ['stats', 'detailedStory', 'values', 'timeline'] }
    ]
  },
  {
    id: 'contact',
    label: 'Contact Manage',
    description: 'Contact page details, response stats, support channels and FAQs.',
    icon: Mail,
    accent: 'text-cyan-200 border-cyan-300/20 bg-cyan-300/10',
    sources: [{ key: 'contactPage', label: 'Contact page', collections: ['supportStats', 'contactInfo', 'faqs'] }]
  },
  {
    id: 'reviews',
    label: 'Reviews Manage',
    description: 'View all review page information and manage individual client testimonials.',
    icon: Star,
    accent: 'text-yellow-200 border-yellow-300/20 bg-yellow-300/10',
    sources: [{ key: 'reviewsData', label: 'Reviews page', collections: ['testimonials'] }]
  },
  {
    id: 'blogs',
    label: 'Blogs Manage',
    description: 'Create, update, publish and remove blog posts.',
    icon: BookOpen,
    accent: 'text-emerald-200 border-emerald-300/20 bg-emerald-300/10',
    sources: [{ key: 'blogs', label: 'Blog posts', collections: [] }]
  },
  {
    id: 'community',
    label: 'Community Manage',
    description: 'Community landing page and moderated sample posts.',
    icon: Users,
    accent: 'text-sky-200 border-sky-300/20 bg-sky-300/10',
    sources: [{ key: 'communityPage', label: 'Community page', collections: ['initialPosts'] }]
  },
  {
    id: 'account-management',
    label: 'Account Manage',
    description: 'Manage the full page copy, market details, descriptions and client terms.',
    icon: Building2,
    accent: 'text-lime-200 border-lime-300/20 bg-lime-300/10',
    sources: [{ key: 'accountManagementPage', label: 'Account management page', collections: ['markets'] }]
  },
  {
    id: 'account-opening',
    label: 'Account Opening Manage',
    description: 'Manage account opening page fields, referral links, registration guidance and market requirements.',
    icon: Building2,
    accent: 'text-teal-200 border-teal-300/20 bg-teal-300/10',
    sources: [{
      key: 'accountOpeningPage',
      label: 'Account opening page',
      collections: ['markets', 'occupationOptions', 'requestFields', 'psxRegistration.formFields', 'psxRegistration.documentUploads']
    }]
  }
];

const getAtPath = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);

const setAtPath = (object, path, value) => {
  const keys = path.split('.');
  let current = object;
  keys.slice(0, -1).forEach((key) => {
    current[key] = current[key] ?? {};
    current = current[key];
  });
  current[keys[keys.length - 1]] = value;
};

const getEditableFields = (value, prefix = '', includeStringArrays = false) => {
  if (Array.isArray(value) || value === null || typeof value !== 'object') {
    return prefix && (
      typeof value === 'string'
      || typeof value === 'number'
      || typeof value === 'boolean'
      || (includeStringArrays && Array.isArray(value) && value.every((item) => typeof item === 'string'))
    )
      ? [{ path: prefix, value }]
      : [];
  }
  return Object.entries(value).flatMap(([key, child]) => {
    if (key === 'id' || child === null) return [];
    const childPath = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(child)) {
      return includeStringArrays && child.every((item) => typeof item === 'string')
        ? [{ path: childPath, value: child }]
        : [];
    }
    return typeof child === 'object'
      ? getEditableFields(child, childPath, includeStringArrays)
      : [{ path: childPath, value: child }];
  });
};

const makeBlankRecord = (template) => {
  if (Array.isArray(template)) return [];
  if (template && typeof template === 'object') {
    return Object.fromEntries(Object.entries(template).map(([key, value]) => [key, makeBlankRecord(value)]));
  }
  if (typeof template === 'number') return 0;
  if (typeof template === 'boolean') return false;
  return '';
};

const readableLabel = (path) => path
  .split('.')
  .pop()
  .replace(/([A-Z])/g, ' $1')
  .replace(/^./, (letter) => letter.toUpperCase());

const formatContentValue = (value) => {
  if (typeof value === 'string') return value || 'Not set';
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return `${value.length} items`;
  return '';
};

const formatFileSize = (size) => `${(size / (1024 * 1024)).toFixed(2)} MB`;

const makeSlug = (title) => title
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const AdminAnalytics = () => {
  const {
    siteContent,
    updateSiteContent,
    accountManagementPdf,
    accountManagementPdfLoaded,
    accountManagementPdfError,
    saveAccountManagementPdf,
    deleteAccountManagementPdf
  } = useAppContext();
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [activeSourceKey, setActiveSourceKey] = useState('heroData');
  const [contentDraft, setContentDraft] = useState(null);
  const [recordDraft, setRecordDraft] = useState(null);
  const [editingRecordIndex, setEditingRecordIndex] = useState(null);
  const [deleteRecordIndex, setDeleteRecordIndex] = useState(null);
  const [agreementPdfBusy, setAgreementPdfBusy] = useState(false);
  const [deleteAgreementPdfOpen, setDeleteAgreementPdfOpen] = useState(false);

  const activeSection = managementSections.find(({ id }) => id === activeSectionId) || managementSections[0];
  const [selectedSourceKey, selectedCollectionKey] = activeSourceKey.split(':');
  const activeSource = activeSection.sources.find(({ key }) => key === selectedSourceKey) || activeSection.sources[0];
  const currentData = siteContent[activeSource.key];
  const currentCollection = activeSource.collections.includes(selectedCollectionKey)
    ? selectedCollectionKey
    : activeSource.collections[0] || null;
  const collectionPath = currentCollection;
  const isReviewManagement = activeSource.key === 'reviewsData';
  const records = collectionPath
    ? getAtPath(currentData, collectionPath) || []
    : Array.isArray(currentData) ? currentData : [];
  const contentFields = Array.isArray(currentData) ? [] : getEditableFields(currentData);
  const totalRecords = useMemo(() => managementSections.reduce((count, section) => (
    count + section.sources.reduce((sourceCount, source) => {
      const value = siteContent[source.key];
      if (Array.isArray(value)) return sourceCount + value.length;
      return sourceCount + source.collections.reduce((collectionCount, collection) => (
        collectionCount + (getAtPath(value, collection)?.length || 0)
      ), 0);
    }, 0)
  ), 0), [siteContent]);

  const setSection = (section) => {
    setActiveSectionId(section.id);
    setActiveSourceKey(section.sources[0].key);
    setContentDraft(null);
  };

  const commitSource = (nextValue) => {
    try {
      const contentToSave = activeSource.key === 'reviewsData' && !Array.isArray(nextValue)
        ? { ...nextValue, totalCount: nextValue.testimonials?.length || 0 }
        : nextValue;
      updateSiteContent(activeSource.key, contentToSave);
      return true;
    } catch (error) {
      console.error('Unable to save managed site content.', error);
      toast.error('Changes could not be saved. Please try again.');
      return false;
    }
  };

  const saveContentFields = (event) => {
    event.preventDefault();
    if (commitSource(contentDraft)) {
      setContentDraft(null);
      toast.success(`${activeSource.label} updated.`);
    }
  };

  const handleAgreementPdfUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setAgreementPdfBusy(true);
    try {
      await saveAccountManagementPdf(file);
      toast.success(accountManagementPdf ? 'Agreement PDF replaced.' : 'Agreement PDF uploaded.');
    } catch (error) {
      console.error('Unable to save account management agreement PDF.', error);
      toast.error(error.message || 'Agreement PDF could not be saved.');
    } finally {
      setAgreementPdfBusy(false);
    }
  };

  const handleAgreementPdfDelete = async () => {
    setAgreementPdfBusy(true);
    try {
      await deleteAccountManagementPdf();
      setDeleteAgreementPdfOpen(false);
      toast.success('Agreement PDF deleted.');
    } catch (error) {
      console.error('Unable to delete account management agreement PDF.', error);
      toast.error(error.message || 'Agreement PDF could not be deleted.');
    } finally {
      setAgreementPdfBusy(false);
    }
  };

  const openRecordEditor = (index = null) => {
    const template = records[0]
      || (Array.isArray(currentData) ? dummyData[activeSource.key][0] : getAtPath(dummyData[activeSource.key], collectionPath)?.[0]);
    if (!template) {
      toast.error('No template is available for this content type.');
      return;
    }
    const original = index === null ? makeBlankRecord(template) : structuredClone(records[index]);
    setRecordDraft(original);
    setEditingRecordIndex(index);
  };

  const saveRecord = (event) => {
    event.preventDefault();
    const nextRecord = structuredClone(recordDraft);
    if (nextRecord && typeof nextRecord === 'object' && !Array.isArray(nextRecord)) {
      if (activeSource.key === 'navigation') {
        if (!nextRecord.name?.trim()) {
          toast.error('Enter a navigation label before saving.');
          return;
        }
        if (!['link', 'dropdown'].includes(nextRecord.type)) {
          toast.error('Choose whether this navigation item is a link or dropdown.');
          return;
        }
        nextRecord.name = nextRecord.name.trim();
        if (nextRecord.type === 'link' && !nextRecord.href?.trim()) {
          toast.error('Enter a destination URL for this navigation link.');
          return;
        }
        if (nextRecord.type === 'dropdown') {
          if (!nextRecord.items?.length) {
            toast.error('Add at least one dropdown item.');
            return;
          }
          if (nextRecord.items.some((item) => !item.title?.trim() || !item.href?.trim())) {
            toast.error('Each dropdown item needs a title and destination URL.');
            return;
          }
          nextRecord.items = nextRecord.items.map((item) => ({
            ...item,
            title: item.title.trim(),
            href: item.href.trim()
          }));
        }
      }
      if (activeSource.key === 'accountManagementPage') {
        if (!nextRecord.name?.trim()) {
          toast.error('Enter a market name before saving.');
          return;
        }
        nextRecord.name = nextRecord.name.trim();
        nextRecord.shortName = nextRecord.shortName?.trim() || nextRecord.name;
      }
      if (activeSource.key === 'accountOpeningPage' && currentCollection === 'markets') {
        if (!nextRecord.name?.trim()) {
          toast.error('Enter a market name before saving.');
          return;
        }
        const marketId = editingRecordIndex === null
          ? makeSlug(nextRecord.name)
          : records[editingRecordIndex].id;
        if (!marketId) {
          toast.error('Use a market name containing letters or numbers.');
          return;
        }
        if (records.some((record, index) => record.id === marketId && index !== editingRecordIndex)) {
          toast.error('A market with this name already exists. Choose a different name.');
          return;
        }
        nextRecord.id = marketId;
        nextRecord.name = nextRecord.name.trim();
      }
      if (activeSource.key === 'accountOpeningPage' && currentCollection === 'occupationOptions') {
        if (!nextRecord.label?.trim()) {
          toast.error('Enter an occupation label before saving.');
          return;
        }
        const occupationId = editingRecordIndex === null
          ? makeSlug(nextRecord.label)
          : records[editingRecordIndex].id;
        if (!occupationId) {
          toast.error('Use an occupation label containing letters or numbers.');
          return;
        }
        if (records.some((record, index) => record.id === occupationId && index !== editingRecordIndex)) {
          toast.error('An occupation with this label already exists.');
          return;
        }
        nextRecord.id = occupationId;
        nextRecord.label = nextRecord.label.trim();
      }
      if (
        activeSource.key === 'accountOpeningPage'
        && ['requestFields', 'psxRegistration.formFields', 'psxRegistration.documentUploads'].includes(currentCollection)
      ) {
        if (!nextRecord.label?.trim()) {
          toast.error('Enter a field label before saving.');
          return;
        }
        const fieldKey = (nextRecord.key || (editingRecordIndex === null ? nextRecord.label : records[editingRecordIndex].key))
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
        if (!fieldKey) {
          toast.error('Use a field label or key containing letters or numbers.');
          return;
        }
        if (records.some((record, index) => record.key === fieldKey && index !== editingRecordIndex)) {
          toast.error('A field with this key already exists. Choose a different key.');
          return;
        }
        nextRecord.id = editingRecordIndex === null ? fieldKey : records[editingRecordIndex].id;
        nextRecord.key = fieldKey;
        nextRecord.label = nextRecord.label.trim();
        if (currentCollection === 'requestFields' && !['text', 'email', 'tel', 'textarea'].includes(nextRecord.type)) {
          toast.error('Choose a supported input type: text, email, tel, or textarea.');
          return;
        }
        if (currentCollection === 'psxRegistration.formFields' && !['text', 'email', 'tel', 'date', 'select'].includes(nextRecord.type)) {
          toast.error('Choose a supported PSX input type.');
          return;
        }
        if (currentCollection === 'psxRegistration.formFields' && nextRecord.type === 'select' && !nextRecord.options?.length) {
          toast.error('Add at least one option for this select field.');
          return;
        }
        if (
          ['psxRegistration.formFields', 'psxRegistration.documentUploads'].includes(currentCollection)
          && !nextRecord.visibleFor?.some((type) => ['sahulat', 'normal'].includes(type))
        ) {
          toast.error('Select whether this field appears for Saahulat, Normal, or both account types.');
          return;
        }
        if (currentCollection === 'psxRegistration.formFields' && !['applicant', 'nominee'].includes(nextRecord.section)) {
          toast.error('Choose whether the field belongs to applicant or nominee information.');
          return;
        }
      }
      if (editingRecordIndex === null && activeSource.key !== 'accountOpeningPage') {
        nextRecord.id = `${activeSection.id}-${crypto.randomUUID()}`;
      }
      if (nextRecord.title && nextRecord.slug !== undefined) nextRecord.slug = makeSlug(nextRecord.title);
      const nextCollection = [...records];
      if (editingRecordIndex === null) nextCollection.unshift(nextRecord);
      else nextCollection[editingRecordIndex] = nextRecord;

      const nextSource = Array.isArray(currentData) ? nextCollection : structuredClone(currentData);
      if (!Array.isArray(currentData)) setAtPath(nextSource, collectionPath, nextCollection);
      if (commitSource(nextSource)) {
        setRecordDraft(null);
        toast.success(editingRecordIndex === null ? 'Item created.' : 'Item updated.');
      }
      return;
    }

    const nextCollection = [...records];
    if (editingRecordIndex === null) nextCollection.unshift(nextRecord);
    else nextCollection[editingRecordIndex] = nextRecord;
    const nextSource = Array.isArray(currentData) ? nextCollection : structuredClone(currentData);
    if (!Array.isArray(currentData)) setAtPath(nextSource, collectionPath, nextCollection);
    if (commitSource(nextSource)) {
      setRecordDraft(null);
      toast.success(editingRecordIndex === null ? 'Item created.' : 'Item updated.');
    }
  };

  const deleteRecord = () => {
    if (
      activeSource.key === 'accountManagementPage'
      || (activeSource.key === 'accountOpeningPage' && currentCollection === 'markets')
      || (activeSource.key === 'accountOpeningPage' && currentCollection === 'occupationOptions')
      || (activeSource.key === 'accountOpeningPage' && ['requestFields', 'psxRegistration.formFields', 'psxRegistration.documentUploads'].includes(currentCollection))
    ) {
      if (records.length <= 1) {
        const minimumItemMessage = currentCollection === 'occupationOptions'
          ? 'Keep at least one occupation option available.'
          : currentCollection === 'markets'
            ? 'Keep at least one market available on this page.'
            : 'Keep at least one input or upload field available in this form.';
        toast.error(minimumItemMessage);
        setDeleteRecordIndex(null);
        return;
      }
    }
    const nextCollection = records.filter((_, index) => index !== deleteRecordIndex);
    const nextSource = Array.isArray(currentData) ? nextCollection : structuredClone(currentData);
    if (!Array.isArray(currentData)) setAtPath(nextSource, collectionPath, nextCollection);
    if (commitSource(nextSource)) {
      setDeleteRecordIndex(null);
      toast.success('Item deleted.');
    }
  };

  const updateRecordField = (path, value) => {
    setRecordDraft((current) => {
      const next = structuredClone(current);
      if (path === '$value') return value;
      setAtPath(next, path, value);
      return next;
    });
  };

  const updateNavigationItems = (items) => {
    setRecordDraft((current) => ({ ...current, items }));
  };

  const updateContentField = (path, value) => {
    setContentDraft((current) => {
      const next = structuredClone(current);
      setAtPath(next, path, value);
      return next;
    });
  };

  const draftFields = recordDraft && typeof recordDraft === 'object'
    ? getEditableFields(
      recordDraft,
      '',
      ['accountManagementPage', 'accountOpeningPage'].includes(activeSource.key)
    )
    : [{ path: '$value', value: recordDraft }];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070b09] text-white selection:bg-amber-300 selection:text-black">
      <AdminSidebar />
      <main className="relative z-10 min-h-screen space-y-6 px-4 pb-10 pt-20 sm:px-6 lg:ml-72 lg:px-8 lg:pt-8">
        <div className="pointer-events-none absolute -right-20 top-8 h-72 w-72 rounded-full bg-emerald-400/[0.07] blur-[110px]" />
        <header className="relative overflow-hidden rounded-3xl border border-emerald-300/15 bg-gradient-to-br from-[#10201a] via-[#10151a] to-[#12131a] p-5 shadow-2xl sm:p-8">
          <div className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full bg-emerald-300/[0.08] blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200 sm:text-xs">
                <Activity className="h-4 w-4" />
                Site content studio
              </span>
              <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">System Analytics</h1>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-gray-300 sm:text-sm">
                Manage public website sections and publish changes across the client pages.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-64">
              <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                <p className="text-2xl font-black text-white">{managementSections.length}</p>
                <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">Managed sections</p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                <p className="text-2xl font-black text-white">{totalRecords}</p>
                <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">Content records</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-white/[0.08] bg-[#101713]/90 p-3 shadow-xl">
            <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">Manage website</p>
            <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-1" aria-label="Website content sections">
              {managementSections.map(({ id, label, icon: Icon, accent }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSection(managementSections.find((section) => section.id === id))}
                  aria-current={activeSectionId === id ? 'page' : undefined}
                  className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-3 text-left text-xs font-semibold transition sm:gap-3 ${
                    activeSectionId === id
                      ? `bg-white/[0.06] ${accent}`
                      : 'border-transparent text-gray-400 hover:border-white/[0.08] hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                  <ArrowUpRight className="ml-auto hidden h-3.5 w-3.5 shrink-0 opacity-60 xl:block" />
                </button>
              ))}
            </nav>
          </aside>

          <section className="min-w-0 space-y-5 rounded-2xl border border-white/[0.08] bg-[#101713]/90 p-4 shadow-xl sm:p-6">
            <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${activeSection.accent}`}>
                  <activeSection.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-white sm:text-xl">{activeSection.label}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400">{activeSection.description}</p>
                </div>
              </div>
              {activeSection.sources.length > 1 && (
                <label className="w-full text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:w-auto">
                  Content source
                  <select
                    value={activeSource.key}
                    onChange={(event) => setActiveSourceKey(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-xs normal-case tracking-normal text-white outline-none focus:border-cyan-300/40 sm:min-w-52"
                  >
                    {activeSection.sources.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
                  </select>
                </label>
              )}
            </div>

            {activeSource.key === 'accountManagementPage' && (
              <div className="space-y-4 rounded-2xl border border-lime-300/15 bg-lime-300/[0.04] p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">Client agreement PDF</h3>
                      <p className="mt-1 text-[11px] leading-relaxed text-gray-400">
                        Upload the PDF clients should download. Only valid PDF files up to 20 MB are accepted.
                      </p>
                    </div>
                  </div>
                  <label className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                    agreementPdfBusy || !accountManagementPdfLoaded || accountManagementPdfError
                      ? 'cursor-not-allowed bg-lime-300/40 text-[#07100b]/70'
                      : 'bg-lime-300 text-[#07100b] hover:bg-lime-200'
                  }`}>
                    <Upload className="h-4 w-4" />
                    {agreementPdfBusy ? 'Saving PDF...' : accountManagementPdf ? 'Replace PDF' : 'Upload PDF'}
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      disabled={agreementPdfBusy || !accountManagementPdfLoaded || Boolean(accountManagementPdfError)}
                      onChange={handleAgreementPdfUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                {accountManagementPdfError && (
                  <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-3 text-xs text-rose-200">
                    Agreement PDF storage is unavailable: {accountManagementPdfError}
                  </p>
                )}

                {!accountManagementPdfLoaded ? (
                  <p className="text-xs text-gray-400">Checking saved agreement PDF...</p>
                ) : accountManagementPdf ? (
                  <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-3 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-lime-100">{accountManagementPdf.name}</p>
                      <p className="mt-1 text-[10px] text-gray-500">
                        {formatFileSize(accountManagementPdf.size)} · Updated {new Date(accountManagementPdf.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const url = URL.createObjectURL(accountManagementPdf.file);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = accountManagementPdf.name;
                          link.click();
                          window.setTimeout(() => URL.revokeObjectURL(url), 1000);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyan-300/15 px-3 py-2 text-[11px] font-semibold text-cyan-100 hover:bg-cyan-300/10"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                      <button
                        type="button"
                        disabled={agreementPdfBusy}
                        onClick={() => setDeleteAgreementPdfOpen(true)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-300/15 px-3 py-2 text-[11px] font-semibold text-rose-200 hover:bg-rose-300/10 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-white/10 px-4 py-4 text-center text-xs text-gray-500">
                    No client agreement PDF uploaded. Clients cannot download the agreement until a PDF is added.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isReviewManagement ? 'Review page information' : 'Page content'}
                  </h3>
                  <p className="mt-1 text-[11px] text-gray-500">
                    {isReviewManagement
                      ? 'Page headings and review totals are shown here. Only individual review records can be edited.'
                      : 'Update headings, descriptions, links and other text fields.'}
                  </p>
                </div>
                {contentFields.length > 0 && !isReviewManagement && (
                  <button
                    type="button"
                    onClick={() => setContentDraft(structuredClone(currentData))}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06] px-3.5 py-2.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit page fields
                  </button>
                )}
              </div>
              {contentFields.length ? (
                <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {contentFields.map(({ path, value }) => (
                    <div key={path} className="min-w-0 rounded-xl border border-white/[0.06] bg-black/15 p-3">
                      <dt className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{readableLabel(path)}</dt>
                      <dd className="mt-1 break-words text-xs leading-relaxed text-gray-200">{formatContentValue(value)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="rounded-xl border border-dashed border-white/10 px-4 py-5 text-xs text-gray-500">
                  Manage your content records below.
                </p>
              )}
            </div>

            {(activeSource.collections.length > 0 || Array.isArray(currentData)) && (
              <div className="space-y-4 border-t border-white/[0.07] pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Content lists</h3>
                    <p className="mt-1 text-[11px] text-gray-500">
                      {isReviewManagement
                        ? 'Every review is listed below. Add, edit or remove review records; other review-page fields are read-only.'
                        : 'Manage repeating cards, stats, FAQs, slogans and posts.'}
                    </p>
                  </div>
                  {activeSource.collections.length > 1 && (
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      List
                      <select
                        value={currentCollection}
                        onChange={(event) => setActiveSourceKey(`${activeSource.key}:${event.target.value}`)}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-xs normal-case tracking-normal text-white outline-none focus:border-cyan-300/40 sm:min-w-52"
                      >
                        {activeSource.collections.map((collection) => (
                          <option key={collection} value={collection}>{readableLabel(collection)}</option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-400">{records.length} item{records.length === 1 ? '' : 's'}</p>
                  <button
                    type="button"
                    onClick={() => openRecordEditor()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-300 px-3.5 py-2.5 text-xs font-extrabold text-[#07100b] transition hover:bg-emerald-200"
                  >
                    <Plus className="h-4 w-4" />
                    Add item
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {records.map((record, index) => {
                    const RecordIcon = getContentIcon(record.icon);
                    const title = typeof record === 'string'
                      ? record
                      : record.title || record.name || record.label || record.author?.name || record.year || `${readableLabel(currentCollection)} ${index + 1}`;
                    const summary = typeof record === 'string'
                      ? ''
                      : record.description || record.content || record.review || record.desc || record.sub || record.role
                        || (record.options?.length ? `Options: ${record.options.join(', ')}` : '')
                        || (record.visibleFor?.length ? `Shown for: ${record.visibleFor.join(', ')}` : '');
                    return (
                      <article key={record.id || `${activeSource.key}-${index}`} className="flex min-w-0 flex-col justify-between gap-4 rounded-xl border border-white/[0.07] bg-[#090f0b] p-4">
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-2.5">
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-gray-300">
                                {record.icon ? <RecordIcon className="h-4 w-4" /> : activeSectionId === 'reviews' ? <Star className="h-4 w-4" /> : activeSectionId === 'community' ? <MessageCircle className="h-4 w-4" /> : <Image className="h-4 w-4" />}
                              </span>
                              <div className="min-w-0">
                                <h4 className="break-words text-xs font-bold text-white">{title}</h4>
                                {(record.category || record.key || record.type) && <p className="mt-1 break-all text-[10px] text-cyan-200">{[record.category, record.key && `key: ${record.key}`, record.type].filter(Boolean).join(' · ')}</p>}
                              </div>
                            </div>
                            {typeof record.required === 'boolean' && (
                              <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${record.required ? 'bg-amber-300/10 text-amber-200' : 'bg-white/[0.05] text-gray-400'}`}>
                                {record.required ? 'Required' : 'Optional'}
                              </span>
                            )}
                            {record.rating && (
                              <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-amber-200">
                                <Star className="h-3 w-3 fill-current" />{record.rating}
                              </span>
                            )}
                          </div>
                          {(record.image || record.mediaUrl || record.author?.avatar || record.imageUrl) && (
                            <img
                              src={record.image || record.mediaUrl || record.author?.avatar || record.imageUrl}
                              alt=""
                              className="mt-3 h-32 w-full rounded-xl border border-white/[0.06] object-cover"
                            />
                          )}
                          {summary && (
                            <p className={`mt-3 text-xs leading-relaxed text-gray-400 ${isReviewManagement ? 'whitespace-pre-wrap' : 'line-clamp-3'}`}>
                              {summary}
                            </p>
                          )}
                          {isReviewManagement && (
                            <p className="mt-2 text-[10px] leading-relaxed text-gray-500">
                              {[record.role, record.location].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          {record.publishDate && <p className="mt-2 text-[10px] text-gray-500">{record.publishDate} · {record.readTime}</p>}
                        </div>
                        <div className="flex gap-2 border-t border-white/[0.06] pt-3">
                          <button
                            type="button"
                            onClick={() => openRecordEditor(index)}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.05] px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/10"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteRecordIndex(index)}
                            aria-label={`Delete ${title}`}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-300/15 bg-rose-300/[0.04] px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-300/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </article>
                    );
                  })}
                  {!records.length && (
                    <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-xs text-gray-500 md:col-span-2">
                      No items in this list yet. Use Add item to create the first one.
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-start gap-2 rounded-xl border border-amber-300/10 bg-amber-300/[0.04] p-3 text-[10px] leading-relaxed text-gray-400">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
              Changes are stored in this browser and reflected on public pages in this application. For multiple admin devices, connect a shared backend.
            </div>
          </section>
        </div>
      </main>

      {contentDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <form onSubmit={saveContentFields} className="my-auto max-h-[92vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-3xl border border-cyan-300/15 bg-[#0b120e] p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">{activeSource.label}</span>
                <h2 className="mt-1 text-xl font-black text-white">Edit page fields</h2>
              </div>
              <button type="button" onClick={() => setContentDraft(null)} aria-label="Close editor" className="rounded-xl border border-white/10 p-2 text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {getEditableFields(contentDraft, '', ['accountManagementPage', 'accountOpeningPage'].includes(activeSource.key)).map(({ path, value }) => (
                <label key={path} className="space-y-1.5 text-xs font-semibold text-gray-300">
                  {readableLabel(path)}
                {Array.isArray(value) ? (
                  <textarea
                    rows={Math.max(3, value.length)}
                    value={value.join('\n')}
                    onChange={(event) => updateContentField(path, event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))}
                    className="w-full resize-y rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/40"
                  />
                ) : imageFieldPattern.test(path) ? (
                  <ImageFieldEditor
                    value={String(value)}
                    onChange={(nextValue) => updateContentField(path, nextValue)}
                  />
                ) : iconFieldPattern.test(path) ? (
                  <IconPicker value={String(value)} onChange={(nextValue) => updateContentField(path, nextValue)} />
                ) : typeof value === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(event) => updateContentField(path, event.target.checked)}
                    className="ml-2 accent-cyan-300"
                  />
                ) : typeof value === 'number' ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(event) => updateContentField(path, Number(event.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/40"
                  />
                ) : (
                  <textarea
                    rows={String(value).length > 80 ? 4 : 2}
                    value={value}
                    onChange={(event) => updateContentField(path, event.target.value)}
                    className="w-full resize-y rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/40"
                  />
                  )}
                </label>
              ))}
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setContentDraft(null)} className="rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-gray-300 hover:bg-white/[0.05]">Cancel</button>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-xs font-extrabold text-[#07100b] hover:bg-cyan-200">
                <Save className="h-4 w-4" /> Save page content
              </button>
            </div>
          </form>
        </div>
      )}

      {recordDraft !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <form onSubmit={saveRecord} className="my-auto max-h-[92vh] w-full max-w-3xl space-y-5 overflow-y-auto rounded-3xl border border-emerald-300/15 bg-[#0b120e] p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">{readableLabel(currentCollection || activeSource.label)}</span>
                <h2 className="mt-1 text-xl font-black text-white">{editingRecordIndex === null ? 'Create content item' : 'Edit content item'}</h2>
                <p className="mt-1 text-xs text-gray-400">Update fields used by the corresponding public website section.</p>
              </div>
              <button type="button" onClick={() => setRecordDraft(null)} aria-label="Close item editor" className="rounded-xl border border-white/10 p-2 text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {draftFields.map(({ path, value }) => (
                <label key={path} className={`space-y-1.5 text-xs font-semibold text-gray-300 ${typeof value === 'string' && value.length > 90 ? 'sm:col-span-2' : ''}`}>
                  {path === '$value' ? 'Text' : readableLabel(path)}
                {path === 'type' && activeSource.key === 'navigation' ? (
                  <select
                    value={String(value)}
                    onChange={(event) => updateRecordField(path, event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-300/40"
                  >
                    <option value="link">Link</option>
                    <option value="dropdown">Dropdown</option>
                  </select>
                ) : path === 'type' && activeSource.key === 'accountOpeningPage' ? (
                  <select
                    value={String(value)}
                    onChange={(event) => updateRecordField(path, event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-300/40"
                  >
                    <option value="">Choose input type</option>
                    {(currentCollection === 'requestFields'
                      ? ['text', 'email', 'tel', 'textarea']
                      : ['text', 'email', 'tel', 'date', 'select']
                    ).map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                ) : path === 'section' && activeSource.key === 'accountOpeningPage' ? (
                  <select
                    value={String(value)}
                    onChange={(event) => updateRecordField(path, event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-300/40"
                  >
                    <option value="">Choose a section</option>
                    <option value="applicant">Applicant</option>
                    <option value="nominee">Nominee</option>
                  </select>
                ) : path === 'requiredForOccupation' && activeSource.key === 'accountOpeningPage' ? (
                  <select
                    value={String(value)}
                    onChange={(event) => updateRecordField(path, event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-300/40"
                  >
                    <option value="">Not occupation-specific</option>
                    {['Employee / Salaried', 'Business / Owner'].map((occupation) => <option key={occupation} value={occupation}>{occupation}</option>)}
                  </select>
                ) : Array.isArray(value) ? (
                  <textarea
                    rows={Math.max(3, value.length)}
                    value={value.join('\n')}
                    onChange={(event) => updateRecordField(path, event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))}
                    className="w-full resize-y rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-300/40"
                  />
                ) : imageFieldPattern.test(path) ? (
                  <ImageFieldEditor
                    value={String(value)}
                    onChange={(nextValue) => updateRecordField(path, nextValue)}
                  />
                ) : iconFieldPattern.test(path) ? (
                  <IconPicker value={String(value)} onChange={(nextValue) => updateRecordField(path, nextValue)} />
                ) : typeof value === 'boolean' ? (
                    <input type="checkbox" checked={value} onChange={(event) => updateRecordField(path, event.target.checked)} className="ml-2 accent-emerald-300" />
                  ) : typeof value === 'number' ? (
                    <input type="number" value={value} onChange={(event) => updateRecordField(path, Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-300/40" />
                  ) : (
                    <textarea rows={String(value).length > 90 ? 5 : 2} value={value} onChange={(event) => updateRecordField(path, event.target.value)} className="w-full resize-y rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-300/40" />
                  )}
                </label>
              ))}
            </div>
            {activeSource.key === 'navigation' && recordDraft.type === 'dropdown' && (
              <section className="space-y-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Dropdown menu items</h3>
                    <p className="mt-1 text-[11px] text-gray-400">Manage each title, description, badge and destination shown in the menu.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateNavigationItems([
                      ...(recordDraft.items || []),
                      { title: '', desc: '', badge: '', href: '' }
                    ])}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/20 px-3.5 py-2.5 text-xs font-semibold text-cyan-100 hover:bg-cyan-300/10"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add dropdown item
                  </button>
                </div>
                {(recordDraft.items || []).map((item, index) => (
                  <div key={`${index}-${item.title}`} className="grid grid-cols-1 gap-3 rounded-xl border border-white/[0.07] bg-black/20 p-3 sm:grid-cols-2">
                    {[
                      ['title', 'Item title'],
                      ['desc', 'Description'],
                      ['badge', 'Badge'],
                      ['href', 'Destination URL']
                    ].map(([field, label]) => (
                      <label key={field} className="space-y-1.5 text-xs font-semibold text-gray-300">
                        {label}
                        <input
                          value={item[field] || ''}
                          onChange={(event) => updateRecordField(`items.${index}.${field}`, event.target.value)}
                          placeholder={field === 'href' ? '/page or https://...' : `Enter ${label.toLowerCase()}`}
                          className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/40"
                        />
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={() => updateNavigationItems(recordDraft.items.filter((_, itemIndex) => itemIndex !== index))}
                      className="inline-flex items-center justify-center gap-1.5 justify-self-start rounded-lg border border-rose-300/15 px-3 py-2 text-[11px] font-semibold text-rose-200 hover:bg-rose-300/10 sm:col-span-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove dropdown item
                    </button>
                  </div>
                ))}
                {!recordDraft.items?.length && (
                  <p className="rounded-xl border border-dashed border-white/10 px-4 py-5 text-center text-xs text-gray-500">Add a dropdown item to populate this menu.</p>
                )}
              </section>
            )}
            <div className="flex items-start gap-2 rounded-xl border border-amber-300/10 bg-amber-300/[0.04] p-3 text-[10px] leading-relaxed text-gray-400">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
              Nested list fields such as comments are preserved on existing items and start empty on new items.
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setRecordDraft(null)} className="rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-gray-300 hover:bg-white/[0.05]">Cancel</button>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-xs font-extrabold text-[#07100b] hover:bg-emerald-200">
                <Check className="h-4 w-4" /> {editingRecordIndex === null ? 'Create item' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteRecordIndex !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-2xl border border-rose-300/15 bg-[#0b120e] p-5 shadow-2xl sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-300/15 bg-rose-300/[0.08] text-rose-200"><Trash2 className="h-5 w-5" /></span>
              <div>
                <h2 className="font-bold text-white">Delete this content item?</h2>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">This item will be removed from the public content in this browser.</p>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setDeleteRecordIndex(null)} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/[0.05]">Cancel</button>
              <button type="button" onClick={deleteRecord} className="rounded-xl bg-rose-400 px-4 py-2.5 text-xs font-extrabold text-[#190708] hover:bg-rose-300">Delete item</button>
            </div>
          </div>
        </div>
      )}

      {deleteAgreementPdfOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-2xl border border-rose-300/15 bg-[#0b120e] p-5 shadow-2xl sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-300/15 bg-rose-300/[0.08] text-rose-200"><Trash2 className="h-5 w-5" /></span>
              <div>
                <h2 className="font-bold text-white">Delete client agreement PDF?</h2>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">Clients will no longer be able to download the agreement until another PDF is uploaded.</p>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" disabled={agreementPdfBusy} onClick={() => setDeleteAgreementPdfOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/[0.05] disabled:opacity-50">Cancel</button>
              <button type="button" disabled={agreementPdfBusy} onClick={handleAgreementPdfDelete} className="rounded-xl bg-rose-400 px-4 py-2.5 text-xs font-extrabold text-[#190708] hover:bg-rose-300 disabled:opacity-50">
                {agreementPdfBusy ? 'Deleting...' : 'Delete PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
