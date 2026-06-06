export interface BranchType {
  name: string;
  subjects: string[];
}

export interface SubItemType {
  name: string;
  subjects?: string[]; // للابتدائي والمتوسط
  branches?: BranchType[]; // للثانوي فقط
}

export interface CardType {
  id: number;
  title: string;
  color: string;
  hover: string;
  text: string;
  border: string;
  icon: string;
  image: string;
  subItems: SubItemType[];
}

export interface NewsArticleType {
  title: string;
  date: string;
  desc: string;
}

export interface PDFFile {
  id: string;
  levelId: number;
  yearName: string;
  branchName: string | null;
  subjectName: string;
  category: string;
  name: string;
  size: string;
  type: string;
  hasSolution?: boolean;
}
