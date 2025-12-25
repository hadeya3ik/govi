import { rgbStringToColorMatrix} from '@/app/helpers/colors.js'

export function BulbSvg({  color, uid} : { color : string, uid : string}) {
  const shadowMatrix = rgbStringToColorMatrix(color, 0.5);
  const filterBlur = `filter-blur-${uid}`
  const filterInner = `filter-inner-${uid}`
  const filterDrop = `filter-drop-${uid}`

  const gradMain = `grad-main-${uid}`
  const gradHighlight = `grad-highlight-${uid}`
  const gradShadow = `grad-shadow-${uid}`

  return (
    <svg
      viewBox="0 0 1050 1072"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base */}
      <circle cx="525" cy="547" r="425" fill={color} />

      {/* Screen glow */}
      <g style={{ mixBlendMode: 'screen' }}>
        <circle
          cx="525"
          cy="547"
          r="425"
          fill={`url(#${gradMain})`}
        />
      </g>

      {/* Top overlay glow */}
      <g filter={`url(#${filterBlur})`}>
        <ellipse
          cx="510"
          cy="370.5"
          rx="295"
          ry="170.5"
          fill={color}
          style={{ mixBlendMode: 'overlay' }}
        />
      </g>

      {/* Radial lighting */}
      <g opacity="0.8">
        <circle
          cx="525"
          cy="547"
          r="425"
          fill={`url(#${gradHighlight})`}
        />
        <circle
          cx="525"
          cy="547"
          r="425"
          fill={`url(#${gradShadow})`}
        />
      </g>

      {/* Inner shadow */}
      <g filter={`url(#${filterInner})`}>
        <circle
          cx="525"
          cy="547"
          r="425"
          fill="black"
          fillOpacity="0.01"
        />
      </g>

      {/* Drop shadow */}
      <g filter={`url(#${filterDrop})`}>
        <circle
          cx="525"
          cy="547"
          r="425"
          fill="white"
          fillOpacity="0.01"
          shapeRendering="crispEdges"
        />
      </g>

      <defs>
        {/* ===== BLUR ===== */}
        <filter
          id={filterBlur}
          x="15"
          y="0"
          width="990"
          height="741"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" />
          <feGaussianBlur stdDeviation="100" />
        </filter>

        {/* ===== INNER SHADOW ===== */}
        <filter
          id={filterInner}
          x="100"
          y="122"
          width="850"
          height="850"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 127 0"
            result="hardAlpha"
          />
          <feGaussianBlur stdDeviation="25" />
          <feComposite
            in2="hardAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
          />
          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 1
              0 0 0 0 1
              0 0 0 0 1
              0 0 0 0.25 0
            "
          />
        </filter>

        {/* ===== DROP SHADOW (COLOR MATRIX) ===== */}
        <filter
          id={filterDrop}
          x="0"
          y="22"
          width="1050"
          height="1050"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 50 0"
            result="hardAlpha"
          />
          <feGaussianBlur stdDeviation="40" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values={shadowMatrix}
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>

        {/* ===== GRADIENTS ===== */}
        <radialGradient
          id={gradMain}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(525 143) rotate(90) scale(829)"
        >
          <stop stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor={color} />
        </radialGradient>

        <radialGradient
          id={gradHighlight}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(543 874) rotate(-91.4) scale(726.8)"
        >
          <stop offset="0.85" stopColor="#F7F7F7" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="0.25" />
        </radialGradient>

        <radialGradient
          id={gradShadow}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(587 173) rotate(75) scale(784)"
        >
          <stop offset="0.85" stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor={color} stopOpacity="0.25" />
        </radialGradient>
      </defs>
    </svg>
  )
}


export function DisabledBulbSvg() {
  const color = "rgb(23, 23, 23)"
  const uid ="fda"
  const shadowMatrix = rgbStringToColorMatrix(color, 0.5);
  const filterBlur = `filter-blur-${uid}`
  const filterInner = `filter-inner-${uid}`
  const filterDrop = `filter-drop-${uid}`

  const gradMain = `grad-main-${uid}`
  const gradHighlight = `grad-highlight-${uid}`
  const gradShadow = `grad-shadow-${uid}`

  return (
    <svg
      viewBox="0 0 1050 1072"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base */}
      <circle cx="525" cy="547" r="425" fill={color} />

      {/* Screen glow */}
      <g style={{ mixBlendMode: 'screen' }}>
        <circle
          cx="525"
          cy="547"
          r="425"
          fill={`url(#${gradMain})`}
        />
      </g>

      {/* Top overlay glow */}
      <g filter={`url(#${filterBlur})`}>
        <ellipse
          cx="510"
          cy="370.5"
          rx="295"
          ry="170.5"
          fill={color}
          style={{ mixBlendMode: 'overlay' }}
        />
      </g>

      {/* Radial lighting */}
      <g opacity="0.8">
        <circle
          cx="525"
          cy="547"
          r="425"
          fill={`url(#${gradHighlight})`}
        />
        <circle
          cx="525"
          cy="547"
          r="425"
          fill={`url(#${gradShadow})`}
        />
      </g>

      {/* Inner shadow */}
      <g filter={`url(#${filterInner})`}>
        <circle
          cx="525"
          cy="547"
          r="425"
          fill="black"
          fillOpacity="0.01"
        />
      </g>

      {/* Drop shadow */}
      {/* <g filter={`url(#${filterDrop})`}>
        <circle
          cx="525"
          cy="547"
          r="425"
          fill="white"
          fillOpacity="0.01"
          shapeRendering="crispEdges"
        />
      </g> */}

      <defs>
        {/* ===== BLUR ===== */}
        <filter
          id={filterBlur}
          x="15"
          y="0"
          width="990"
          height="741"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" />
          <feGaussianBlur stdDeviation="100" />
        </filter>

        {/* ===== INNER SHADOW ===== */}
        {/* <filter
          id={filterInner}
          x="100"
          y="122"
          width="850"
          height="850"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 127 0"
            result="hardAlpha"
          />
          <feGaussianBlur stdDeviation="25" />
          <feComposite
            in2="hardAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
          />
          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 1
              0 0 0 0 1
              0 0 0 0 1
              0 0 0 0.25 0
            "
          />
        </filter> */}

        {/* ===== DROP SHADOW (COLOR MATRIX) ===== */}
        <filter
          id={filterDrop}
          x="0"
          y="22"
          width="1050"
          height="1050"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 50 0"
            result="hardAlpha"
          />
          <feGaussianBlur stdDeviation="40" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values={shadowMatrix}
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>

        {/* ===== GRADIENTS ===== */}
        <radialGradient
          id={gradMain}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(525 143) rotate(90) scale(829)"
        >
          <stop stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor={color} />
        </radialGradient>

        <radialGradient
          id={gradHighlight}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(543 874) rotate(-91.4) scale(726.8)"
        >
          <stop offset="0.85" stopColor="#F7F7F7" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="0.25" />
        </radialGradient>

        <radialGradient
          id={gradShadow}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(587 173) rotate(75) scale(784)"
        >
          <stop offset="0.85" stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor={color} stopOpacity="0.25" />
        </radialGradient>
      </defs>
    </svg>
  )
}
