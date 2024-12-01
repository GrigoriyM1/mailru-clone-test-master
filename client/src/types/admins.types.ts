export interface IReport {
  type: 'QUESTION' | 'ANSWER';
  elementId: string;
  elementLink: string;
  title: string 
  description?: string
}