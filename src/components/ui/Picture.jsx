// <picture> with AVIF and WebP sources. Pass an `image` from assets/images/art.js,
// or a plain `src` for single files (placeholders, remote thumbnails).
export default function Picture({
  image,
  src,
  alt,
  sizes = "100vw",
  width,
  height,
  loading = "lazy",
  fetchPriority,
  className,
  imgClassName,
  ...rest
}) {
  if (!image) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={[className, imgClassName].filter(Boolean).join(" ") || undefined}
        {...rest}
      />
    );
  }
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={image.avif} sizes={sizes} />
      <source type="image/webp" srcSet={image.webp} sizes={sizes} />
      <img
        src={image.src}
        alt={alt}
        width={width ?? image.width}
        height={height ?? image.height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={imgClassName}
        {...rest}
      />
    </picture>
  );
}
