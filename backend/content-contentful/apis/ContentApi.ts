import { createClient, ContentfulClientApi } from 'contentful';
import { ContentfulMapper } from '../mappers/ContentfulMapper';
import { Context } from '@frontastic/extension-types';

export default class ContentApi {
  private client: ContentfulClientApi;
  private locale: string;

  constructor(frontasticContext: Context, locale?: string) {
    this.client = createClient({
      space: frontasticContext.project.configuration?.contentful.spaceId,
      accessToken: frontasticContext.project.configuration?.contentful.accessToken,
    });
    this.locale = this.formatLocale(locale !== null ? locale : frontasticContext.project.defaultLocale);
  }

  private formatLocale(locale: string) {
    return locale.replace('_', '-');
  }

  async getContent(id: string) {
    const contentfulEntry = await this.client.getEntry(id, { locale: this.locale });
    const contentfulContentType = await this.client.getContentType(contentfulEntry.sys.contentType.sys.id);

    return ContentfulMapper.contentfulEntryToContent(contentfulEntry, contentfulContentType);
  }
}
