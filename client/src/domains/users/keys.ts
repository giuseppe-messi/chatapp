export const usersKeys = {
  all: ["users"],
  detail: (id: string) => [...usersKeys.all, id]
};
