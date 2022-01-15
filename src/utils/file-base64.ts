
export const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const codeBase64 = (data: string) => {
  return Buffer.from(data, "utf8").toString("base64");
};

export const decodeBase64 = (base64Input: string) => {
  return Buffer.from(base64Input, "base64").toString("utf8");
};
