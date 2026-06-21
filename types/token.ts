export interface ColorToken {
  name: string;
  value: string;
  variable: string;
  role: string;
}

export interface TypographyToken {
  family: string;
  weights: number[];
  sizes: { role: string; size: string; lineHeight: string; letterSpacing: string }[];
  substitute?: string;
}

export interface SpacingToken {
  name: string;
  value: string;
  token: string;
}

export interface ShapeToken {
  element: string;
  value: string;
}

export interface BrandToken {
  slug: string;
  name: string;
  category: string;
  country: 'KR' | 'GLOBAL';
  serviceTypes: string[];
  theme: 'dark' | 'light';
  description: string;
  colors: ColorToken[];
  typography: TypographyToken;
  spacing: {
    baseUnit: string;
    density: string;
    scale: SpacingToken[];
  };
  shapes: ShapeToken[];
  layout: {
    maxWidth: string;
    sectionGap: string;
  };
  guidelines: {
    dos: string[];
    donts: string[];
  };
  updatedAt: string;
}
