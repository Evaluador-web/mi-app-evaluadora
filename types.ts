
export interface InclusionIndexEntry {
  page: string;
  section: string;
  nee: string;
  talents: string;
  genderInterculturality: string;
}

export interface Recommendation {
  page: string;
  location: string;
  suggestion: string;
}

export interface DimensionAnalysis {
  nee: string;
  talents: string;
  genderInterculturality: string;
}

export interface WordCloudData {
  text: string;
  value: number;
}

export interface PageInclusionChartData {
  name: string;
  inclusion: number;
}

export interface OpportunityArea {
  aspect: string;
  suggestion: string;
}

export interface AnalysisResult {
  summary: string;
  documentType: string;
  overallInclusionLevel: 'ALTO' | 'MEDIO' | 'BAJO';
  inclusionIndex: InclusionIndexEntry[];
  recommendations: Recommendation[];
  dimensionAnalysis: DimensionAnalysis;
  wordCloudData: WordCloudData[];
  pageInclusionChartData: PageInclusionChartData[];
  opportunityAreas: OpportunityArea[];
}
