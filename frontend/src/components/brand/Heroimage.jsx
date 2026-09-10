import { optimizeCloudinaryImage } from "../../services/cloudinary";

const Heroimage = ({ url, aspect = "aspect-[9/11]" }) => {
  return (
    <img
      src={optimizeCloudinaryImage(url, 538)}
      srcSet={`
        ${optimizeCloudinaryImage(url, 353)} 353w,
        ${optimizeCloudinaryImage(url, 538)} 538w,
        ${optimizeCloudinaryImage(url, 706)} 706w,
        ${optimizeCloudinaryImage(url, 1076)} 1076w
      `}
      sizes="(min-width: 768px) 50vw, 100vw"
      alt="Modern luxury living room interior design"
      className={`${aspect} w-full object-cover`}
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  );
};

export default Heroimage;
