export type ApiResponse<T> = {
  page: number;
  pageSize: number;
  hasMore: boolean;
  items: T[];
};
