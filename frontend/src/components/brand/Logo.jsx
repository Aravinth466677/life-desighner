import { optimizeCloudinaryImage } from "../../services/cloudinary";

const LOGO_URL = "https://res.cloudinary.com/dgxdlocja/image/upload/v1788953942/logo.png";

export default function Logo({ size }) {
  return (
    <div className="flex items-center rounded-3xl border border-line bg-white p-2 shadow-soft">
      <img
        src={optimizeCloudinaryImage(LOGO_URL, 80)}
        srcSet={`
          ${optimizeCloudinaryImage(LOGO_URL, 44)} 44w,
          ${optimizeCloudinaryImage(LOGO_URL, 80)} 80w,
          ${optimizeCloudinaryImage(LOGO_URL, 120)} 120w
        `}
        sizes={size}
        width="80"
        height="80"
        alt="Life Designers"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
