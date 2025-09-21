import type { Prisma } from "@prisma/client";

export interface ApiGroup {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;

  apiSources: ApiSource[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiSource {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Prisma.JsonValue;
  queryParams?: Prisma.JsonValue;
  timeout: number;
  groupId: string;
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface AggregatedResponse {
  success: boolean;
  data: any[];
  metadata: {
    totalAPIs: number;
    successfulAPIs: number;
    failedAPIs: number;
    responseTime: number;
    timestamp: string;
    sources: ApiResponseMeta[];
    groupName: string;
  };
  errors?: ApiError[];
}

export interface ApiResponseMeta {
  apiName: string;
  success: boolean;
  responseTime: number;
  recordCount?: number;
  error?: string;
}

export interface ApiError {
  apiName: string;
  error: string;
  timestamp: string;
}


export interface ApiTestRequest {
  name: string;
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  queryParams?: Record<string, any>;
  timeout?: number;
}

export interface ApiTestResult {
  success: boolean;
  responseTime: number;
  dataPreview?: {
    type: string;
    length?: number;
    sample: any;
    fields?: string[];
  };
  error?: string;
}

// types/demo.ts

export interface DemoApiSource {
  id: string;
  name: string;
  url: string;
  method: string;     
  timeout: number;    
  groupId: string;
  createdAt: string;  
  updatedAt: string;  
}

export interface DemoRequest {
  id: string;
  endpoint: string;
  method: string;     
  params?: Record<string, any>;
  response: any;      
  metadata: any;      
  createdAt: string;  
  groupId: string;
}

export interface DemoGroup {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;  
  updatedAt: string;  

  apiSources?: DemoApiSource[];
  requests?: DemoRequest[];
}
