import { isEmpty } from "ramda";

export const parseStringDate = (date: string) => {
  if (!isEmpty(date)) {
    const arrString = date.split("-");
    return new Date(
      Number(arrString[0]),
      Number(arrString[1]) - 1,
      Number(arrString[2])
    );
  }
};
