import { Extension } from '@tiptap/core';
import type { CommandProps } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontFamily: {
      setFontFamily: (fontFamily: string) => ReturnType;
    };
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
    };
  }
}

export const FontFamily = Extension.create({
  name: 'fontFamily',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: element => ({
              fontFamily: element.style.fontFamily.replace(/["']/g, ''),
            }),
            renderHTML: attributes => {
              if (!attributes.fontFamily) return {};
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontFamily:
        (fontFamily: string) =>
          ({ chain }: CommandProps) => {
            return chain().setMark('textStyle', { fontFamily }).run();
          },
    };
  },
});


export const FontSize = Extension.create({
  name: 'fontSize',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            renderHTML: attributes => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
            parseHTML: element => ({
              fontSize: element.style.fontSize.replace(/["']/g, ''),
            }),
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
          ({ chain }: CommandProps) => {
            return chain().setMark('textStyle', { fontSize }).run();
          },
    };
  },
});
