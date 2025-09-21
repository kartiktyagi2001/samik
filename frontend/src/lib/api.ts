import {
  ApiGroup,
  ApiSource,
  AggregatedResponse,
  ApiTestRequest,
  ApiTestResult,
  CreateGroupRequest,
  AddApiRequest,
  AggregationListResponse,
  ApiResponse
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) {
  throw new Error('Backend API URL environment variable is not set');
}

//helper function for error handling
async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`
      };
    }
    
    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Failed to parse response'
    };
  }
}

// Groups API - /api/groups
export const groupsApi = {
  // GET /api/groups - Get all groups
  getAll: async (): Promise<ApiResponse<ApiGroup[]>> => {
    try {
      const response = await fetch(`${API_BASE}/api/groups`, {
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await handleApiResponse<ApiGroup[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error: Unable to fetch groups'
      };
    }
  },

  // GET /api/groups/:id - Get group by ID with details
  getById: async (id: string): Promise<ApiResponse<ApiGroup>> => {
    try {
      const response = await fetch(`${API_BASE}/api/groups/${id}`, {
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await handleApiResponse<ApiGroup>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to fetch group details'
      };
    }
  },

  // POST /api/groups - Create new group
  create: async (data: CreateGroupRequest): Promise<ApiResponse<ApiGroup>> => {
    try {
      const response = await fetch(`${API_BASE}/api/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      return await handleApiResponse<ApiGroup>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to create group'
      };
    }
  },

  // DELETE /api/groups/:id - Delete group
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_BASE}/api/groups/${id}`, {
        method: 'DELETE',
        headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}
      });
      return await handleApiResponse<void>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to delete group'
      };
    }
  },

  // POST /api/groups/:id/apis - Add API to group
  addApi: async (groupId: string, apiData: AddApiRequest): Promise<ApiResponse<ApiSource>> => {
    try {
      const response = await fetch(`${API_BASE}/api/groups/${groupId}/apis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(apiData)
      });
      return await handleApiResponse<ApiSource>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to add API to group'
      };
    }
  },

  // DELETE /api/groups/:groupId/apis/:apiId - Remove API from group
  removeApi: async (groupId: string, apiId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_BASE}/api/groups/${groupId}/apis/${apiId}`, {
        method: 'DELETE',
        headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}
      });
      return await handleApiResponse<void>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to remove API from group'
      };
    }
  }
};

// Aggregation API - /api/aggregate endpoints
export const aggregationApi = {
  //GET /api/aggregate - List all available groups for aggregation, not using it rn
  listGroups: async (): Promise<AggregationListResponse> => {
    try {
      const response = await fetch(`${API_BASE}/api/aggregate`);
      return await handleApiResponse<{
        name: string;
        description?: string;
        apiCount: number;
        endpoint: string;
        csvEndpoint: string;
      }[]>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to fetch aggregation groups'
      };
    }
  },

  //GET /api/aggregate/:groupName - Aggregate data from APIs
  aggregateGroup: async (groupName: string): Promise<ApiResponse<AggregatedResponse>> => {
    try {
      const response = await fetch(`${API_BASE}/api/aggregate/${groupName}`,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await handleApiResponse<AggregatedResponse>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to aggregate group data'
      };
    }
  },

  // GET /api/aggregate/:groupName?format=csv - Get aggregated data as CSV (idk but i will use client-side conversion so might not require it), not using it rn
  aggregateGroupCsv: async (groupName: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE}/api/aggregate/${groupName}?format=csv`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.text();
    } catch (error) {
      throw new Error('Network error: Unable to fetch CSV data');
    }
  },

  // POST /api/aggregate/test - Test individual API before adding to group
  testApi: async (apiData: ApiTestRequest): Promise<ApiResponse<ApiTestResult>> => {
    try {
      const response = await fetch(`${API_BASE}/api/aggregate/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(apiData)
      });
      return await handleApiResponse<ApiTestResult>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to test API'
      };
    }
  }
};

// Demo API - /demo endpoints (no authentication required)
export const demoApi = {
  // GET /demo - Get all demo groups
  getAll: async (): Promise<ApiResponse<ApiGroup[]>> => {
    try {
      const response = await fetch(`${API_BASE}/demo`);
      return await handleApiResponse<ApiGroup[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error: Unable to fetch demo groups'
      };
    }
  },

  // GET /demo/:id - Get demo group by ID with details
  getById: async (id: string): Promise<ApiResponse<ApiGroup>> => {
    try {
      const response = await fetch(`${API_BASE}/demo/${id}`);
      return await handleApiResponse<ApiGroup>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to fetch demo group details'
      };
    }
  },

  // POST /demo - Create new demo group
  create: async (data: CreateGroupRequest): Promise<ApiResponse<ApiGroup>> => {
    try {
      const response = await fetch(`${API_BASE}/demo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await handleApiResponse<ApiGroup>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to create demo group'
      };
    }
  },

  // DELETE /demo/:id - Delete demo group
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_BASE}/demo/${id}`, {
        method: 'DELETE'
      });
      return await handleApiResponse<void>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to delete demo group'
      };
    }
  },

  // POST /demo/:id/apis - Add API to demo group
  addApi: async (groupId: string, apiData: AddApiRequest): Promise<ApiResponse<ApiSource>> => {
    try {
      const response = await fetch(`${API_BASE}/demo/${groupId}/apis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });
      return await handleApiResponse<ApiSource>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to add API to demo group'
      };
    }
  },

  // DELETE /demo/:groupId/apis/:apiId - Remove API from demo group
  removeApi: async (groupId: string, apiId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_BASE}/demo/${groupId}/apis/${apiId}`, {
        method: 'DELETE'
      });
      return await handleApiResponse<void>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to remove API from demo group'
      };
    }
  },

  // GET /demo/:groupName - Aggregate data from demo group APIs
  aggregateGroup: async (groupName: string): Promise<ApiResponse<AggregatedResponse>> => {
    try {
      const response = await fetch(`${API_BASE}/demo/${groupName}`);
      return await handleApiResponse<AggregatedResponse>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to aggregate demo group data'
      };
    }
  },

  // POST /demo/test - Test individual API before adding to demo group
  testApi: async (apiData: ApiTestRequest): Promise<ApiResponse<ApiTestResult>> => {
    try {
      const response = await fetch(`${API_BASE}/demo/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });
      return await handleApiResponse<ApiTestResult>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error: Unable to test API'
      };
    }
  }
};

// Export all APIs as a single object for convenience
export const api = {
  groups: groupsApi,
  aggregation: aggregationApi,
  demo: demoApi
};