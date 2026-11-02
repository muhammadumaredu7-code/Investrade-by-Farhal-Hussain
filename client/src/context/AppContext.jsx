import { createContext, useContext, useEffect, useState } from 'react';
import dummyData from '../assets/dummyData.json';

const AppContext = createContext(null);

const ACCOUNT_REQUESTS_STORAGE_KEY = 'investrade-account-requests';
const DELETED_DEMO_REQUESTS_STORAGE_KEY = 'investrade-deleted-demo-account-requests';
const SITE_CONTENT_STORAGE_KEY = 'investrade-site-content';
const AGREEMENT_PDF_DATABASE = 'investrade-account-management';
const AGREEMENT_PDF_STORE = 'documents';
const AGREEMENT_PDF_ID = 'agreement-form';
const MAX_AGREEMENT_PDF_SIZE = 20 * 1024 * 1024;

const openAgreementPdfDatabase = () => new Promise((resolve, reject) => {
  if (!window.indexedDB) {
    reject(new Error('This browser does not support persistent agreement file storage.'));
    return;
  }

  const request = window.indexedDB.open(AGREEMENT_PDF_DATABASE, 1);
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains(AGREEMENT_PDF_STORE)) {
      request.result.createObjectStore(AGREEMENT_PDF_STORE, { keyPath: 'id' });
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('Agreement file storage could not be opened.'));
});

const readAgreementPdf = async () => {
  const database = await openAgreementPdfDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(AGREEMENT_PDF_STORE, 'readonly');
    const request = transaction.objectStore(AGREEMENT_PDF_STORE).get(AGREEMENT_PDF_ID);
    let document = null;
    request.onsuccess = () => {
      document = request.result || null;
    };
    transaction.oncomplete = () => {
      database.close();
      resolve(document);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('The agreement PDF could not be loaded.'));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('Loading the agreement PDF was interrupted.'));
    };
  });
};

const writeAgreementPdf = async (document) => {
  const database = await openAgreementPdfDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(AGREEMENT_PDF_STORE, 'readwrite');
    transaction.objectStore(AGREEMENT_PDF_STORE).put(document);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('The agreement PDF could not be saved.'));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('Saving the agreement PDF was interrupted.'));
    };
  });
};

const removeAgreementPdf = async () => {
  const database = await openAgreementPdfDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(AGREEMENT_PDF_STORE, 'readwrite');
    transaction.objectStore(AGREEMENT_PDF_STORE).delete(AGREEMENT_PDF_ID);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('The agreement PDF could not be deleted.'));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('Deleting the agreement PDF was interrupted.'));
    };
  });
};

const validateAgreementPdf = async (file) => {
  if (!file || !file.name.toLowerCase().endsWith('.pdf') || (file.type && file.type !== 'application/pdf')) {
    throw new Error('Choose a valid PDF file only.');
  }
  if (file.size > MAX_AGREEMENT_PDF_SIZE) {
    throw new Error('Choose a PDF smaller than 20 MB.');
  }

  const signature = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  if (signature.length !== 5 || String.fromCharCode(...signature) !== '%PDF-') {
    throw new Error('The selected file is not a valid PDF document.');
  }
};

const mergeSiteContent = (defaults, stored) => {
  if (Array.isArray(defaults)) return Array.isArray(stored) ? stored : defaults;
  if (defaults && typeof defaults === 'object') {
    const storedObject = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    return Object.fromEntries(Object.entries(defaults).map(([key, value]) => [
      key,
      mergeSiteContent(value, storedObject[key])
    ]));
  }
  return stored === undefined ? defaults : stored;
};

const loadSiteContent = () => {
  const defaults = {
    headerData: dummyData.headerData,
    navigation: dummyData.navigation,
    footerData: dummyData.footerData,
    heroData: dummyData.heroData,
    aboutPage: dummyData.aboutPage,
    aboutSection: dummyData.aboutSection,
    contactPage: dummyData.contactPage,
    reviewsData: dummyData.reviewsData,
    blogs: dummyData.blogs,
    communityPage: dummyData.communityPage,
    accountManagementPage: dummyData.accountManagementPage,
    accountOpeningPage: dummyData.accountOpeningPage
  };

  try {
    const storedContent = window.localStorage.getItem(SITE_CONTENT_STORAGE_KEY);
    if (!storedContent) return defaults;
    return mergeSiteContent(defaults, JSON.parse(storedContent));
  } catch (error) {
    console.error('Unable to load saved site content.', error);
    return defaults;
  }
};

const readStoredAccountRequests = () => {
  const storedRequests = window.sessionStorage.getItem(ACCOUNT_REQUESTS_STORAGE_KEY);
  if (!storedRequests) return [];

  try {
    const parsedRequests = JSON.parse(storedRequests);
    return Array.isArray(parsedRequests) ? parsedRequests : [];
  } catch (error) {
    console.error('Unable to read saved account requests.', error);
    return [];
  }
};

const loadAccountRequests = () => {
  const savedRequests = readStoredAccountRequests();
  const deletedDemoIds = JSON.parse(
    window.sessionStorage.getItem(DELETED_DEMO_REQUESTS_STORAGE_KEY) || '[]'
  );
  const requestsById = new Map(
    dummyData.accountRequestDemoData
      .filter((request) => !deletedDemoIds.includes(request.id))
      .map((request) => [request.id, request])
  );
  savedRequests.forEach((request) => requestsById.set(request.id, request));
  return [...requestsById.values()];
};

export const AppContextProvider = ({ children }) => {
  const [vipMarkets, setVipMarkets] = useState(dummyData.vipGroupsPage.markets);
  const [vipSubscriptions, setVipSubscriptions] = useState(dummyData.clientDashboardVipPage.subscriptions);
  const [signals, setSignals] = useState(dummyData.clientDashboardSignalsPage.signals);
  const [academyCourses, setAcademyCourses] = useState(dummyData.academyPage.courses);
  const [courseEnrollments, setCourseEnrollments] = useState(dummyData.clientDashboardCoursesPage.enrolledCourses);
  const [products, setProducts] = useState(dummyData.productsPage.products);
  const [accountRequests, setAccountRequests] = useState(loadAccountRequests);
  const [siteContent, setSiteContent] = useState(loadSiteContent);
  const [accountManagementPdf, setAccountManagementPdf] = useState(null);
  const [accountManagementPdfLoaded, setAccountManagementPdfLoaded] = useState(false);
  const [accountManagementPdfError, setAccountManagementPdfError] = useState('');

  useEffect(() => {
    let isMounted = true;
    readAgreementPdf()
      .then((document) => {
        if (isMounted) setAccountManagementPdf(document);
      })
      .catch((error) => {
        console.error('Unable to load account management agreement PDF.', error);
        if (isMounted) setAccountManagementPdfError(error.message);
      })
      .finally(() => {
        if (isMounted) setAccountManagementPdfLoaded(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const saveAccountRequests = (nextRequests) => {
    window.sessionStorage.setItem(ACCOUNT_REQUESTS_STORAGE_KEY, JSON.stringify(nextRequests));
    setAccountRequests(nextRequests);
  };

  const addAccountRequest = (requestDetails) => {
    const request = {
      ...requestDetails,
      id: `acct-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      requestedAt: new Date().toISOString(),
      status: requestDetails.status || 'PENDING'
    };
    saveAccountRequests([request, ...accountRequests]);
    return request;
  };

  const updateAccountRequest = (requestId, updates) => {
    const requestExists = accountRequests.some((request) => request.id === requestId);
    if (!requestExists) throw new Error(`Account request not found: ${requestId}`);

    const nextRequests = accountRequests.map((request) => (
      request.id === requestId
        ? { ...request, ...updates, id: request.id, updatedAt: new Date().toISOString() }
        : request
    ));
    saveAccountRequests(nextRequests);
  };

  const updateAccountRequestStatus = (requestId, status) => {
    updateAccountRequest(requestId, { status });
  };

  const deleteAccountRequest = (requestId) => {
    if (!accountRequests.some((request) => request.id === requestId)) {
      throw new Error(`Account request not found: ${requestId}`);
    }
    if (dummyData.accountRequestDemoData.some((request) => request.id === requestId)) {
      const deletedDemoIds = JSON.parse(
        window.sessionStorage.getItem(DELETED_DEMO_REQUESTS_STORAGE_KEY) || '[]'
      );
      if (!deletedDemoIds.includes(requestId)) {
        window.sessionStorage.setItem(
          DELETED_DEMO_REQUESTS_STORAGE_KEY,
          JSON.stringify([...deletedDemoIds, requestId])
        );
      }
    }
    saveAccountRequests(accountRequests.filter((request) => request.id !== requestId));
  };

  const updateSiteContent = (contentKey, contentValue) => {
    const nextContent = { ...siteContent, [contentKey]: contentValue };
    window.localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(nextContent));
    setSiteContent(nextContent);
  };

  const saveAccountManagementPdf = async (file) => {
    await validateAgreementPdf(file);
    const document = {
      id: AGREEMENT_PDF_ID,
      name: file.name,
      file: file.slice(0, file.size, 'application/pdf'),
      size: file.size,
      updatedAt: new Date().toISOString()
    };
    await writeAgreementPdf(document);
    setAccountManagementPdf(document);
    setAccountManagementPdfError('');
  };

  const deleteAccountManagementPdf = async () => {
    await removeAgreementPdf();
    setAccountManagementPdf(null);
    setAccountManagementPdfError('');
  };

  return (
    <AppContext.Provider value={{ vipMarkets, setVipMarkets, vipSubscriptions, setVipSubscriptions, signals, setSignals, academyCourses, setAcademyCourses, courseEnrollments, setCourseEnrollments, products, setProducts, accountRequests, addAccountRequest, updateAccountRequest, updateAccountRequestStatus, deleteAccountRequest, siteContent, updateSiteContent, accountManagementPdf, accountManagementPdfLoaded, accountManagementPdfError, saveAccountManagementPdf, deleteAccountManagementPdf }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppContextProvider');
  return context;
};