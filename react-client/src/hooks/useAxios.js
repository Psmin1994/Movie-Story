import axios from "axios";
import { useEffect, useState } from "react";

// Axios 기본 설정
const apiClient = axios.create({
  baseURL: "http://localhost:5000", // 서버 주소
  withCredentials: true, // 쿠키를 요청에 포함
});

const useAxios = (reqConfig = {}) => {
  // 가져올 데이터 담을 변수
  const [data, setData] = useState(null); // 응답 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  useEffect(() => {
    const axiosData = async () => {
      setLoading(true); // 로딩 시작
      setError(null); // 에러 초기화

      try {
        let response = await apiClient(reqConfig);

        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (reqConfig?.url) {
      axiosData();
    }
    // eslint-disable-next-line
  }, [reqConfig?.url, reqConfig?.method, reqConfig?.headers, reqConfig?.data]);

  return { data, error, loading };
};

export default useAxios;
