
export interface DatabaseStats {
  labelCount: number;
  flagCount: number;
  flagValuesCount: number;
  labelIssuesCount: number;
  flagIssuesCount: number;
  flagValueIssuesCount: number;
}

export interface AffectedItem {
  id?: string;
  name: string;
  type?: string;
}

export interface FlagIssue {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  affectedItems: AffectedItem[];
  fixAction?: () => Promise<void>;
}
