declare module 'markdown' {
  declare interface markdown {
    toHTML(markdown: string): string;
  }

  declare const markdown: markdown;
}
