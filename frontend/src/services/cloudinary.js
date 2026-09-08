export function optimizeCloudinaryImage(url, width) {
  if (!url || !url.includes("/image/upload/")) {
    return url;
  }

  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,w_${width}/`
  );
}