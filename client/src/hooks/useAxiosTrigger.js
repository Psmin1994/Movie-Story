// useAxios.js
import { useState, useCallback } from "react";
import axios from "axios";

// Axios 기본 설정
const apiClient = axios.create({
  baseURL: "http://localhost:5000", // 서버 주소
  withCredentials: true, // 쿠키를 요청에 포함
});

const useAxiosTrigger = (reqConfig = {}) => {
  const [data, setData] = useState(null); // API 응답 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  // trigger 함수 정의
  const trigger = useCallback(async () => {
    setLoading(true); // 요청 시작 시 로딩 상태 true
    setError(null); // 요청을 다시 시작할 때 에러 상태 초기화

    try {
      const response = await apiClient(reqConfig);

      setData(response.data); // 요청이 성공하면 데이터 업데이트
    } catch (err) {
      setError(err); // 오류가 발생하면 에러 상태 설정
    } finally {
      setLoading(false); // 요청 완료 후 로딩 상태 false
    }
    // eslint-disable-next-line
  }, [reqConfig?.url, reqConfig?.method, reqConfig?.headers, reqConfig?.data]); // url, method, body가 변경될 때마다 trigger 함수 업데이트

  return { data, loading, error, trigger };
};

export default useAxiosTrigger;
