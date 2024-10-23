"use server";
import { cookies } from "next/headers";

/**
 * Deletes a cookie by its name.
 *
 * @param {string} name - The name of the cookie to delete.
 * @returns {Promise<boolean>} A promise that resolves to true when the cookie is deleted.
 */
const deleteCookie = async (name: string) => {
  const cookiesStore = cookies();
  cookiesStore.delete(name);
  return true;
};

export { deleteCookie };
