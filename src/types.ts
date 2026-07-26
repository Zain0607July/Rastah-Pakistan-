export type Province =
  | 'Punjab'
  | 'Sindh'
  | 'KPK'
  | 'Balochistan'
  | 'Gilgit-Baltistan'
  | 'AJK'
  | 'Islamabad';

export type Sector = 'Public' | 'Private';

export type DegreeLevel = 'Bachelor' | 'Master';

export type Category =
  | 'Computer Science & IT'
  | 'Engineering & Tech'
  | 'Business & Finance'
  | 'Medical & Health'
  | 'Social Sciences'
  | 'Natural Sciences';

export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  province: Province;
  sector: Sector;
  website: string;
  logoUrl?: string;
  hecRanking?: string;
  establishedYear: number;
  campusAddress: string;
}

export interface Program {
  id: string;
  universityId: string;
  name: string;
  degreeLevel: DegreeLevel;
  category: Category;
  durationYears: number;
  feePerSemester: number;
  totalFee: number;
  feeLastUpdated: string; // e.g. "July 2026 (Confirmed)" or "Verify with Admissions"
  feeUnverified?: boolean; // True if figures were not confirmed in public sources
  feeNote?: string; // Special notes like tuition waivers or credit hour rates
  eligibilityCriteria: string;
  minPercentageRequired: number;
  admissionTestRequired: string;
  careerOutlookSummary: string;
  commonPublicJobs: string[];
}

export interface EnrichedProgram extends Program {
  university: University;
}

export interface AdvisorInput {
  marksPercentage: number;
  monthlyBudget: number; // in PKR
  preferredProvince: Province | 'Any';
  degreeLevel: DegreeLevel | 'Any';
  interests: string;
}

export interface AdvisorRecommendation {
  programId: string;
  matchScore: number;
  fitReason: string;
  marksWarning?: string;
  feeFitNote: string;
}

export interface AdvisorResponse {
  recommendations: AdvisorRecommendation[];
  generalAdvice: string;
  timestamp: string;
}

export interface FilterState {
  searchQuery: string;
  degreeLevel: DegreeLevel | 'All';
  province: Province | 'All';
  sector: Sector | 'All';
  category: Category | 'All';
  maxFeeSemester: number;
  minMarks: number;
  sortBy: 'fee-low' | 'fee-high' | 'name' | 'marks-low' | 'duration';
}
