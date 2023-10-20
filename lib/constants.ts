import "dotenv/config";

export const baseUrl =
  process.env.NODE_ENV === "production"
    ? `https://qr-manager-two.vercel.app`
    : "http://localhost:3000";

export function formatCedula(cedula: string) {
  const firstThreeDigits = cedula.substring(0, 3);
  const middleThreeDigits = cedula.substring(3, 6);
  const middleFourDigits = cedula.substring(6, 10);
  const lastDigit = cedula.charAt(10);
  return `${firstThreeDigits}-${middleThreeDigits}-${middleFourDigits}-${lastDigit}`;
}
