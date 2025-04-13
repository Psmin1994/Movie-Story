import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScrapingService } from '@modules/scraping/scraping.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Cron('0 0 6 * * *') // 매일 오전 6시에 실행
  async handleScraping() {
    console.log('Starting scraping task...');
    try {
      // 영화 목록 크롤링
      const { urlList, browser, page } =
        await this.scrapingService.getPlayingList();

      console.log('Scraping completed. Inserting movie data...');

      // 크롤링한 데이터를 기반으로 DB 삽입 작업 수행
      await this.scrapingService.insertPlayingMovie(urlList, page, browser);

      console.log('Movie data insertion completed.');
    } catch (error) {
      console.error('Error during scraping task:', error);
    }
  }

  @Cron('0 30 6 * * 1') // 매주 월요일 오전 6시 30분에 실행
  async handleUpdateRank() {
    try {
      console.log('Starting weekly box office update task...');
      await this.scrapingService.updateRank();
      console.log('Box office update completed.');
    } catch (error) {
      console.error('Error during box office update task:', error);
    }
  }

  // 테스트용 메서드 추가
  async testScraping() {
    console.log('테스트: 스크래핑 작업을 즉시 실행합니다.');
    try {
      // 영화 목록 크롤링
      const { urlList, browser, page } =
        await this.scrapingService.getPlayingList();

      console.log('테스트: 크롤링 완료. 영화 데이터를 삽입합니다.');

      // 크롤링한 데이터를 기반으로 DB 삽입 작업 수행
      await this.scrapingService.insertPlayingMovie(urlList, page, browser);

      console.log('테스트: 영화 데이터 삽입 완료.');
    } catch (error) {
      console.error('테스트 중 오류 발생:', error);
    }
  }

  // 박스오피스 갱신 테스트용 메서드 추가
  async testUpdateRank() {
    console.log('테스트: 박스오피스 갱신 작업을 즉시 실행합니다.');
    try {
      await this.scrapingService.updateRank();
      console.log('테스트: 박스오피스 갱신 완료.');
    } catch (error) {
      console.error('테스트 중 오류 발생:', error);
    }
  }
}
