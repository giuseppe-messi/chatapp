export type GetUsersApiResponse<T> = {
  page: number;
  pageSize: number;
  hasMore: boolean;
  items: T[];
};
