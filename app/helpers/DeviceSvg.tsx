import { rgbStringToColorMatrix} from '@/app/helpers/colors.js'

export function BulbSvg({ fillColor: thisColor, id} : { fillColor : string, id : string}) {
   const shadowMatrix = rgbStringToColorMatrix(thisColor, 0.5);
  return (
    <svg
      viewBox="0 0 389 389"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter={`url(#filter0-${id})`}>
        <circle
          cx="194.098"
          cy="194.098"
          r="123"
          fill={thisColor}
          fillOpacity="0.01"
          shapeRendering="crispEdges"
        />
      </g>

      <mask
        id="mask0_124_734"
        maskUnits="userSpaceOnUse"
        x="71"
        y="71"
        width="247"
        height="247"
      >
        <circle cx="194.098" cy="194.098" r="123" fill="white" />
      </mask>

      <g mask="url(#mask0_124_734)">
        <g filter="url(#filter1_f_124_734)">
          <circle cx="194.098" cy="154.098" r="129" fill={thisColor} />
        </g>

        <g opacity="0.8">
          <ellipse
            cx="194.098"
            cy="194.454"
            rx="123"
            ry="123.355"
            fill="url(#paint0_radial_124_734)"
          />
          <ellipse
            cx="194.098"
            cy="194.454"
            rx="123"
            ry="123.355"
            fill={`url(#paint1-${id})`}
          />
        </g>
      </g>

      <defs>
        <filter
          id={`filter0-${id}`}
          x="-0.000602722"
          y="-0.000114441"
          width="388.197"
          height="388.197"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="35.5491" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values={shadowMatrix}
          />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_124_734" />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_124_734"
            result="shape"
          />
        </filter>

        <filter
          id="filter1_f_124_734"
          x="1.10922"
          y="-38.8903"
          width="385.977"
          height="385.977"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="31.9942" />
        </filter>

        <radialGradient
          id="paint0_radial_124_734"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-5.20698 -210.895 210.288 -5.22203 199.305 289.441)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.850857" stopColor="#F7F7F7" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="0.25" />
        </radialGradient>

        <radialGradient
          id={`paint1-${id}`}
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(58.0762 220.117 -219.483 58.2441 212.127 85.9648)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.9" stopColor={thisColor} stopOpacity="0" />
          <stop offset="1" stopColor={thisColor} stopOpacity="0.25" />
        </radialGradient>
      </defs>
    </svg>
  )
}
