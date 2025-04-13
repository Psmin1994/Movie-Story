// utils/date.utils.ts

export const getNext30Days = () => {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const lastDay = new Date(year, month, 0).getDate(); // 해당 월의 마지막 날짜

  const dates = [];

  for (let i = 0; i < 30; i++) {
    // 현재 날짜 객체 생성
    const currentDate = new Date(year, month, day); // JS에서 month는 0부터 시작

    dates.push({
      year,
      month,
      day,
      weekday: weekdays[currentDate.getDay()],
    });

    // 다음 날짜로 증가
    day++;

    // 현재 날짜가 월의 마지막 날을 넘어가면 다음 달로 이동
    if (day > lastDay) {
      day = 1; // 날짜 초기화
      month++; // 다음 달로

      // 12월을 넘어가면 연도 변경
      if (month > 12) {
        month = 1;
        year++;
      }
    }
  }

  return dates;
};
