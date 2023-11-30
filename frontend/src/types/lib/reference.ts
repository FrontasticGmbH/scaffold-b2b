export interface BaseReference {
  openInNewWindow?: boolean;
}

export interface LinkReference extends BaseReference {
  type?: 'link';
  link?: string;
}

export interface PageFolderReference extends BaseReference {
  type?: 'page-folder';
  pageFolder?: {
    _url?: string;
  };
}

export type Reference = LinkReference | PageFolderReference;
