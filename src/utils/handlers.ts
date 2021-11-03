/**
 * Response handler
 *
 * @param res - fetch response object
 * @returns
 */
export const responseHandler = async (res: Response) => {
  const data = res.json();
  if (!res.ok) throw data;
  return data;
};
