export interface ColorToken {
  name: string;
  value: string;
  variable: string;
  role: string;
}

export interface TypographySize {
  role: string;
  size: string;
  lineHeight: string;
  letterSpacing: string;
}

export interface TypographyToken {
  family: string;
  substitute?: string;
  weights: number[];
  sizes: TypographySize[];
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

export interface PlatformToken {
  spacing: {
    baseUnit: string;
    density: string;
    scale: SpacingToken[];
  };
  shapes: ShapeToken[];
  layout: {
    maxWidth: string;
    sectionGap: string;
    columns?: string;
    touchTarget?: string;
  };
  typography: TypographyToken;
}

export interface ComponentSpec {
  name: string;
  anatomy: string;
  states?: string;
  spec: string;
}

export interface BrandDeep {
  interaction: {
    duration: string;
    easing: string;
    hoverScale?: string;
    pressScale?: string;
    notes: string;
  };
  voice: {
    tone: string;
    examples: string[];
    avoid: string[];
  };
  components: ComponentSpec[];
  breakpoints: { name: string; value: string; behavior: string }[];
  iconStyle: string;
  imageStyle: string;
  accessibilityNotes: string;
}

export interface BrandToken {
  slug: string;
  name: string;
  nameKo?: string;
  tagline: string;
  category: string;
  country: 'KR' | 'GLOBAL';
  serviceTypes: string[];
  theme: 'dark' | 'light';
  description: string;
  colors: ColorToken[];
  platforms: {
    mobile: PlatformToken;
    web: PlatformToken;
  };
  guidelines: {
    dos: string[];
    donts: string[];
  };
  updatedAt: string;
  deep?: BrandDeep;
}
