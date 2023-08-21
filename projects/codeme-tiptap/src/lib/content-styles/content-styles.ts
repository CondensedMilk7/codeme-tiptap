export interface CdmContentStylesConfig {
  // Probably just strings?
  fontFamilies: string[];
  globalFontFamily: string;

  // {h1: { fontFamily: 'Helvetica', color: 'red'...}}
  elements: Partial<Record<ElementName, Partial<CdmElementStyles>>>;
}

export interface CdmElementStyles {
  fontFamily: string;
  fontSize: string;
  fontStyle: string;
  // Changed For String
  textAlign: string;
  maxWidth: string;
  textDecoration: string;
  lineLeight: string;
  borderRadius: string;
  letterSpacing: string;
  color: string;
  backgroundColor: string;
  border: Partial<CdmBorderStyles>;
  margin: string;
  padding: string;
  nestedElements?: Partial<Record<ElementName, Partial<CdmElementStyles>>>;
}

export interface CdmBorderStyles {
  width: string;
  color: string;
  //? Changed For String (Had A Problem With Border Style)
  style: string;
  radius: string;
  radiusTopLeft: string;
  radiusTopRight: string;
  radiusBottomLeft: string;
  radiusBottomRight: string;
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export type ElementName =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'p'
  | 'a'
  | 'mark'
  | 'blockquote'
  | '.ProseMirror'
  | 'img'
  | '.mark1'
  | '.mark2';

export interface IThemeStyles {
  color: string;
  blockquoteColor: string;
  backgroundColor: string;
  aColor: string;
  borderColor: string;
}

export const THEMES: Record<string, IThemeStyles> = {
  neutral: {
    color: '#153243',
    blockquoteColor: '#153243',
    backgroundColor: '#3786b5',
    aColor: '#153243',
    borderColor: '#153243',
  },
  dark: {
    color: 'white',
    blockquoteColor: 'gray',
    backgroundColor: '#333',
    aColor: 'blue',
    borderColor: 'orange',
  },
  pink: {
    color: '#ff66cc',
    blockquoteColor: 'gray',
    backgroundColor: '#ffe6f2',
    aColor: '#ff66cc',
    borderColor: '#ff66cc',
  },
};

export const getThemes = (): string[] => {
  return Object.keys(THEMES);
};
