export type PortfolioMediaType = 'image' | 'video' | 'pdf';

export interface PortfolioAsset {
  id: string;
  src: string;
  type: PortfolioMediaType;
  name: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  desc: string;
  coverSrc: string;
  coverType: PortfolioMediaType;
  tags: string[];
  assets: PortfolioAsset[];
  mediaSrc?: string;
  mediaType?: PortfolioMediaType;
}
