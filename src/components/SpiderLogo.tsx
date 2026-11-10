interface SpiderLogoProps {
  className?: string
}

export default function SpiderLogo({ className = "" }: SpiderLogoProps) {
  const imageClassName = [
    "w-[260px] sm:w-[380px] lg:w-[520px] max-w-full h-auto",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <img
      src="/spider-white.png"
      alt="Spider logo"
      width={600}
      height={600}
      fetchPriority="high"
      className={imageClassName}
    />
  )
}
