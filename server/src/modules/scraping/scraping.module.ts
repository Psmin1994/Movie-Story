import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapingDAO } from './dao/scraping.dao';

@Module({
  providers: [ScrapingService, ScrapingDAO],
  exports: [ScrapingService, ScrapingDAO],
})
export class ScrapingModule {}
