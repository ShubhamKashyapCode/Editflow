import {
  Client,
  Project,
  Task,
  LeadQualification,
  ClientBrief,
  Proposal,
  Payment,
  Revision,
  ProjectAsset,
  DeliveryChecklist,
  RetainerOpportunity,
  EmailTemplate,
  UserSettings,
  BackupData
} from '../types';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates';
import { createDemoDataset } from '../data/demoData';

const DB_NAME = 'EditFlowOS_DB';
const DB_VERSION = 1;

export type StoreName =
  | 'settings'
  | 'clients'
  | 'projects'
  | 'tasks'
  | 'leads'
  | 'briefs'
  | 'proposals'
  | 'payments'
  | 'revisions'
  | 'assets'
  | 'deliveries'
  | 'retainers'
  | 'templates';

const STORES: StoreName[] = [
  'settings',
  'clients',
  'projects',
  'tasks',
  'leads',
  'briefs',
  'proposals',
  'payments',
  'revisions',
  'assets',
  'deliveries',
  'retainers',
  'templates'
];

export const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  businessName: '',
  email: '',
  currency: 'USD',
  currencySymbol: '$',
  defaultRevisionLimit: 2,
  theme: 'Dark',
  accentColor: 'indigo',
  onboardingCompleted: false,
  createdAt: new Date().toISOString()
};

let dbInstance: IDBDatabase | null = null;

// LocalStorage Shadow Backup helpers for 100% resilient desktop persistence
function syncToLocalStorage<T>(storeName: StoreName, data: T): void {
  try {
    localStorage.setItem(`editflow_db_${storeName}`, JSON.stringify(data));
  } catch {
    // Ignore quota errors if data is very large
  }
}

function readFromLocalStorage<T>(storeName: StoreName): T | null {
  try {
    const raw = localStorage.getItem(`editflow_db_${storeName}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function openDatabase(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      STORES.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          if (store === 'settings') {
            db.createObjectStore(store); // key-value
          } else {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        }
      });
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      dbInstance.onversionchange = () => {
        dbInstance?.close();
        dbInstance = null;
      };
      dbInstance.onclose = () => {
        dbInstance = null;
      };
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function getAllFromStore<T>(storeName: StoreName): Promise<T[]> {
  try {
    const db = await openDatabase();
    return await new Promise<T[]>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = (request.result || []) as T[];
        syncToLocalStorage(storeName, results);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`Falling back to localStorage for store: ${storeName}`, err);
    const cached = readFromLocalStorage<T[]>(storeName);
    return cached || [];
  }
}

export async function getFromStore<T>(storeName: StoreName, key: IDBValidKey): Promise<T | null> {
  try {
    const db = await openDatabase();
    return await new Promise<T | null>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve((request.result ?? null) as T | null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`Falling back to localStorage for getFromStore: ${storeName}`, err);
    if (storeName === 'settings') {
      return readFromLocalStorage<T>(storeName);
    }
    const list = readFromLocalStorage<any[]>(storeName);
    return (list?.find((item) => item.id === key) as T) || null;
  }
}

export async function putToStore<T>(storeName: StoreName, item: T, key?: IDBValidKey): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = key !== undefined ? store.put(item, key) : store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`IndexedDB put failed for ${storeName}, falling back to localStorage:`, err);
  }

  // Always keep localStorage shadow backup up to date
  if (storeName === 'settings') {
    syncToLocalStorage(storeName, item);
  } else {
    const current = readFromLocalStorage<any[]>(storeName) || [];
    const itemId = (item as any)?.id;
    const existingIndex = current.findIndex((x) => x.id === itemId);
    if (existingIndex >= 0) {
      current[existingIndex] = item;
    } else {
      current.unshift(item);
    }
    syncToLocalStorage(storeName, current);
  }
}

export async function deleteFromStore(storeName: StoreName, key: IDBValidKey): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`IndexedDB delete failed for ${storeName}:`, err);
  }

  const current = readFromLocalStorage<any[]>(storeName) || [];
  const filtered = current.filter((x) => x.id !== key);
  syncToLocalStorage(storeName, filtered);
}

export async function clearStore(storeName: StoreName): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`IndexedDB clear failed for ${storeName}:`, err);
  }

  localStorage.removeItem(`editflow_db_${storeName}`);
}

// Bulk put helper
export async function bulkPut<T>(storeName: StoreName, items: T[]): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    items.forEach((item) => {
      store.put(item);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Get or initialize user settings
export async function getSettings(): Promise<UserSettings> {
  const saved = await getFromStore<UserSettings>('settings', 'user_settings');
  if (saved) {
    return saved;
  }
  await putToStore('settings', DEFAULT_SETTINGS, 'user_settings');
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await putToStore('settings', settings, 'user_settings');
}

// Initialize templates if empty
export async function ensureTemplates(): Promise<EmailTemplate[]> {
  const existing = await getAllFromStore<EmailTemplate>('templates');
  if (existing.length === 0) {
    await bulkPut('templates', DEFAULT_TEMPLATES);
    return DEFAULT_TEMPLATES;
  }
  return existing;
}

// Full Export
export async function exportAllData(): Promise<BackupData> {
  const settings = await getSettings();
  const clients = await getAllFromStore<Client>('clients');
  const projects = await getAllFromStore<Project>('projects');
  const tasks = await getAllFromStore<Task>('tasks');
  const leads = await getAllFromStore<LeadQualification>('leads');
  const briefs = await getAllFromStore<ClientBrief>('briefs');
  const proposals = await getAllFromStore<Proposal>('proposals');
  const payments = await getAllFromStore<Payment>('payments');
  const revisions = await getAllFromStore<Revision>('revisions');
  const assets = await getAllFromStore<ProjectAsset>('assets');
  const deliveries = await getAllFromStore<DeliveryChecklist>('deliveries');
  const retainers = await getAllFromStore<RetainerOpportunity>('retainers');
  const templates = await getAllFromStore<EmailTemplate>('templates');

  return {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    data: {
      settings,
      clients,
      projects,
      tasks,
      leads,
      briefs,
      proposals,
      payments,
      revisions,
      assets,
      deliveries,
      retainers,
      templates
    }
  };
}

// Full Import
export async function importAllData(backup: BackupData): Promise<void> {
  if (!backup || !backup.data) {
    throw new Error('Invalid backup file format.');
  }

  const { data } = backup;

  // Clear all stores first
  for (const store of STORES) {
    await clearStore(store);
  }

  if (data.settings) {
    await putToStore('settings', data.settings, 'user_settings');
  } else {
    await putToStore('settings', DEFAULT_SETTINGS, 'user_settings');
  }

  if (data.clients?.length) await bulkPut('clients', data.clients);
  if (data.projects?.length) await bulkPut('projects', data.projects);
  if (data.tasks?.length) await bulkPut('tasks', data.tasks);
  if (data.leads?.length) await bulkPut('leads', data.leads);
  if (data.briefs?.length) await bulkPut('briefs', data.briefs);
  if (data.proposals?.length) await bulkPut('proposals', data.proposals);
  if (data.payments?.length) await bulkPut('payments', data.payments);
  if (data.revisions?.length) await bulkPut('revisions', data.revisions);
  if (data.assets?.length) await bulkPut('assets', data.assets);
  if (data.deliveries?.length) await bulkPut('deliveries', data.deliveries);
  if (data.retainers?.length) await bulkPut('retainers', data.retainers);
  if (data.templates?.length) await bulkPut('templates', data.templates);
  else await bulkPut('templates', DEFAULT_TEMPLATES);
}

// Reset All Data
export async function resetAllData(): Promise<void> {
  for (const store of STORES) {
    await clearStore(store);
  }
  // Reset settings
  await putToStore('settings', DEFAULT_SETTINGS, 'user_settings');
  // Re-seed default templates
  await bulkPut('templates', DEFAULT_TEMPLATES);
}

// Seed Demo Data
export async function seedDemoData(): Promise<void> {
  const demo = createDemoDataset();
  await bulkPut('clients', demo.clients);
  await bulkPut('projects', demo.projects);
  await bulkPut('tasks', demo.tasks);
  await bulkPut('leads', demo.leads);
  await bulkPut('briefs', demo.briefs);
  await bulkPut('proposals', demo.proposals);
  await bulkPut('payments', demo.payments);
  await bulkPut('revisions', demo.revisions);
  await bulkPut('assets', demo.assets);
  await bulkPut('deliveries', demo.deliveries);
  await bulkPut('retainers', demo.retainers);

  // If user hasn't set their name yet, set a friendly demo profile
  const settings = await getSettings();
  if (!settings.name) {
    await saveSettings({
      ...settings,
      name: 'Jordan Hayes',
      businessName: 'Apex Cut Studio',
      email: 'jordan@apexcut.studio',
      currency: 'USD',
      currencySymbol: '$',
      defaultRevisionLimit: 2,
      onboardingCompleted: true
    });
  }
}

// Clear only demo data (keep settings and templates)
export async function clearAllContentData(): Promise<void> {
  const contentStores: StoreName[] = [
    'clients',
    'projects',
    'tasks',
    'leads',
    'briefs',
    'proposals',
    'payments',
    'revisions',
    'assets',
    'deliveries',
    'retainers'
  ];
  for (const store of contentStores) {
    await clearStore(store);
  }
}
