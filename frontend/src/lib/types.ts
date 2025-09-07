export interface ApiGroup {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  apiSources: ApiSource[];
  requests?: Request[];
  _count: {
    apiSources: number;
    requests: number;
  };
}

export interface ApiSource {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  timeout: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  groupId: string;
}

export interface ApiResponseMeta {
  apiName: string;
  success: boolean;
  responseTime: number;
  recordCount?: number;
  error?: string;
}

export interface AggregatedResponse {
  success: boolean;
  data: unknown[];
  metadata: {
    totalAPIs: number;
    successfulAPIs: number;
    failedAPIs: number;
    responseTime: number;
    timestamp: string;
    groupName: string;
    sources: ApiResponseMeta[];
  };
}

export interface ApiTestRequest {
  name: string;
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  timeout?: number;
}

export interface ApiTestResult {
  success: boolean;
  responseTime: number;
  dataPreview?: {
    type: 'array' | 'object' | 'string' | 'number';
    length?: number;
    sample?: unknown;
    fields?: string[];
  };
  error?: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface AddApiRequest {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  timeout?: number;
}

export interface Request {
  id: string;
  method: string;
  endpoint: string;
  params: unknown;
  response: unknown;
  metadata: unknown;
  createdAt: string;
  groupId: string;
}

//UI component props
export interface GroupCardProps {
  group: ApiGroup;
  onDelete?: (id: string) => void;
}

export interface ApiListProps {
  apis: ApiSource[];
  onDelete?: (apiId: string) => void;
  onToggleActive?: (apiId: string, isActive: boolean) => void;
}

export interface DataTableProps {
  data: unknown[];
  title?: string;
  isLoading?: boolean;
}

export interface MetadataDisplayProps {
  metadata: AggregatedResponse['metadata'];
}

//API response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  metadata?: Record<string, unknown>
  error?: string;
}

// export interface GroupListResponse extends ApiResponse<ApiGroup[]> {}
// export interface GroupDetailResponse extends ApiResponse<ApiGroup> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AggregationListResponse extends ApiResponse<{
  name: string;
  description?: string;
  apiCount: number;
  endpoint: string;
  csvEndpoint: string;
}[]> {}