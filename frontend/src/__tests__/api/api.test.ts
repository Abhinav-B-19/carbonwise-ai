import api from "@/api/api";
import { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

describe("api", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates axios instance", () => {
    expect(api).toBeDefined();
  });

  it("adds user key header", async () => {
    localStorage.setItem("carbonwise_userKey", "abc123");

    const interceptor = api.interceptors.request.handlers?.[0]?.fulfilled!;

    const config = {
      headers: new AxiosHeaders(),
    } as InternalAxiosRequestConfig;

    const result = await interceptor(config);

    expect(result.headers["X-User-Key"]).toBe("abc123");
  });

  it("does not add header when key is absent", async () => {
    const interceptor = api.interceptors.request.handlers?.[0]?.fulfilled!;

    const config = {
      headers: new AxiosHeaders(),
    } as InternalAxiosRequestConfig;

    const result = await interceptor(config);

    expect(result.headers["X-User-Key"]).toBeUndefined();
  });
});
