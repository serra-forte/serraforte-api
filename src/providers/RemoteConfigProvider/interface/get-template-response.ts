export interface RemoteConfigTemplate {
    conditions: any[]; // Vazio, mas pode conter condições futuramente
    parameters: {
      systemStatus: {
        defaultValue: {
          value: string; // JSON string que precisa ser parseado
        };
        valueType: 'JSON';
      };
    };
    parameterGroups: Record<string, any>;
    etag: string;
    version: {
      versionNumber: string;
      updateOrigin: 'CONSOLE' | 'REMOTE_CONFIG_UPDATE_ORIGIN_UNSPECIFIED' | string;
      updateType: 'INCREMENTAL_UPDATE' | 'ROLLBACK' | string;
      updateUser: {
        email: string;
      };
      updateTime: string; // Ex: "Tue, 13 May 2025 16:50:59 GMT"
    };
  }
  
  // Interface para o valor parseado de systemStatus
  export interface SystemStatus {
    isSystemUpdating: boolean;
  }
  