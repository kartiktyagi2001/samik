// lib/constants.ts - App-wide constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// HTTP Methods
export const HTTP_METHODS = [
  'GET',
  'POST', 
  'PUT',
  'DELETE',
  'PATCH'
] as const;

// API Limits
export const LIMITS = {
  MAX_GROUP_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 200,
  MAX_API_NAME_LENGTH: 100,
  MAX_TIMEOUT_SECONDS: 120,
  MIN_TIMEOUT_SECONDS: 1,
  MAX_HEADERS: 20,
  MAX_QUERY_PARAMS: 20,
} as const;

// UI Configuration
export const UI = {
  ITEMS_PER_PAGE: 50,
  MAX_PREVIEW_ROWS: 5,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  GROUPS: '/groups',
  CREATE_GROUP: '/groups/create',
  GROUP_DETAIL: (id: string) => `/groups/${id}`,
  ADD_API: (groupId: string) => `/groups/${groupId}/add-api`,
  TEST: '/test',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TEST_HISTORY: 'dataforge_test_history',
  USER_PREFERENCES: 'dataforge_preferences',
  RECENT_GROUPS: 'dataforge_recent_groups',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error: Unable to connect to server',
  INVALID_URL: 'Please enter a valid URL',
  REQUIRED_FIELD: 'This field is required',
  GROUP_EXISTS: 'A group with this name already exists',
  API_TEST_FAILED: 'API test failed',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  GROUP_CREATED: 'Group created successfully',
  API_ADDED: 'API added to group successfully',
  DATA_COPIED: 'Data copied to clipboard',
  CSV_DOWNLOADED: 'CSV file downloaded successfully',
} as const;

// Status Colors (Tailwind classes)
export const STATUS_COLORS = {
  SUCCESS: 'text-green-600 bg-green-50',
  ERROR: 'text-red-600 bg-red-50',
  WARNING: 'text-yellow-600 bg-yellow-50',
  INFO: 'text-blue-600 bg-blue-50',
  NEUTRAL: 'text-gray-600 bg-gray-50',
} as const;

// HTTP Method Colors
export const METHOD_COLORS = {
  GET: 'text-green-600 bg-green-50',
  POST: 'text-blue-600 bg-blue-50', 
  PUT: 'text-orange-600 bg-orange-50',
  DELETE: 'text-red-600 bg-red-50',
  PATCH: 'text-purple-600 bg-purple-50',
} as const;

// Chart Colors for Data Visualization
export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#F97316', // Orange
  '#EC4899', // Pink
  '#06B6D4', // Cyan
] as const;

// Common Headers for API Testing
export const COMMON_HEADERS = [
  'Authorization',
  'Content-Type', 
  'Accept',
  'User-Agent',
  'X-API-Key',
  'X-Requested-With',
] as const;

// Common Query Parameters
export const COMMON_PARAMS = [
  'limit',
  'offset',
  'page',
  'sort',
  'order',
  'filter',
  'search',
  'fields',
] as const;

// File Export
export const EXPORT = {
  MAX_FILENAME_LENGTH: 50,
  DEFAULT_CSV_FILENAME: 'dataforge-export',
  SUPPORTED_FORMATS: ['csv', 'json'] as const,
  CSV_MIME_TYPE: 'text/csv;charset=utf-8;',
  JSON_MIME_TYPE: 'application/json;charset=utf-8;',
} as const;

// Aggregation
export const AGGREGATION = {
  MAX_CONCURRENT_APIS: 10,
  DEFAULT_PARALLEL_EXECUTION: true,
  RESPONSE_TIMEOUT: 30000,
} as const;

// Feature Flags (for future features)
export const FEATURES = {
  DARK_MODE: false,
  WEBHOOK_SUPPORT: false,
  SCHEDULED_REQUESTS: false,
  ADVANCED_FILTERING: true,
  REAL_TIME_MONITORING: false,
} as const;