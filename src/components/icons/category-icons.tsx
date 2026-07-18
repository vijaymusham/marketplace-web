import type { ComponentType, SVGProps } from "react";

export type CategoryIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Hand-drawn isometric "3D doodle" icons (MakeMyTrip-style):
 * white front faces, gray extruded side faces for depth,
 * a soft ground shadow, and tiny sparkle accents.
 * Strokes use currentColor so active/hover states tint them.
 */

export const DEPTH = "#e2e8f0";
export const LIGHT = "#f1f5f9";

export function Doodle({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Shadow({ cx = 32, cy = 55, rx = 18 }: { cx?: number; cy?: number; rx?: number }) {
  return (
    <ellipse cx={cx} cy={cy} rx={rx} ry={3.2} fill="#94a3b8" opacity={0.3} stroke="none" />
  );
}

export function Sparkle({ x, y, s = 3 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x} ${y - s}v${2 * s}M${x - s} ${y}h${2 * s}`} strokeWidth={1.5} />;
}

export function MobilesTabletsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Doodle {...props}>
      <Shadow cx={33} cy={51} rx={19} />
      {/* tablet slab */}
      <path d="M14 16l20 4 5-2.5-20-4z" fill={LIGHT} />
      <path d="M34 20l5-2.5v24L34 44z" fill={DEPTH} />
      <path d="M14 16l20 4v24l-20-4z" fill="#fff" />
      <path d="M17 19.5l14 3v18l-14-3z" fill={DEPTH} stroke="none" />
      <path d="M17 19.5l14 3v18l-14-3z" strokeWidth={1.2} />
      {/* phone slab */}
      <path d="M38 26l12 3 4-2-12-3z" fill={LIGHT} />
      <path d="M50 29l4-2v16l-4 2z" fill={DEPTH} />
      <path d="M38 26l12 3v18l-12-3z" fill="#fff" />
      <path d="M41.5 31l6 1.4" strokeWidth={1.3} />
      <circle cx="44" cy="40.5" r="1.1" fill="currentColor" stroke="none" />
      <Sparkle x={55} y={13} />
    </Doodle>
  );
}

export function ElectronicsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Doodle {...props}>
      <Shadow cx={30} cy={52} rx={20} />
      {/* screen */}
      <path d="M16 10l26 6v18l-26-6z" fill="#fff" />
      <path d="M19 13.5l20 5v12l-20-5z" fill={DEPTH} stroke="none" />
      <path d="M19 13.5l20 5v12l-20-5z" strokeWidth={1.2} />
      {/* base */}
      <path d="M16 28l26 6-8 9-26-6z" fill="#fff" />
      <path d="M8 37l26 6v3l-26-6z" fill={DEPTH} />
      <path d="M34 43l8-9v3l-8 9z" fill={DEPTH} />
      <path d="M14.5 31.2l23 5.4M12.5 33.6l23 5.4" strokeWidth={1.1} opacity={0.8} />
      <Sparkle x={53} y={12} />
    </Doodle>
  );
}

export function FurnitureIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Doodle {...props}>
      <Shadow cx={30} cy={57} rx={21} />
      {/* backrest (at the back plane) */}
      <path d="M18 14h30l4-2.5H22z" fill={LIGHT} />
      <path d="M48 14l4-2.5v19L48 33z" fill={DEPTH} />
      <path d="M18 14h30v19H18z" fill="#fff" />
      {/* seat */}
      <path d="M10 38h30l8-5H18z" fill="#fff" />
      <path d="M40 38l8-5v10l-8 5z" fill={DEPTH} />
      <path d="M10 38h30v10H10z" fill="#fff" />
      <path d="M25 38l8-5M25 38v10" strokeWidth={1.3} />
      {/* arms */}
      <path d="M6 30h7l8-5h-7z" fill={LIGHT} />
      <path d="M6 30h7v20H6z" fill="#fff" />
      <path d="M37 30h7l8-5h-7z" fill={LIGHT} />
      <path d="M44 30l8-5v20l-8 5z" fill={DEPTH} />
      <path d="M37 30h7v20h-7z" fill="#fff" />
      {/* legs */}
      <path d="M9 50v3.5M41 50v3.5" />
    </Doodle>
  );
}

const SHIRT =
  "M25 19l-9 8 5.5 5 3.5-3v15h14V29l3.5 3 5.5-5-9-8c-2.5 2.3-11.5 2.3-14 0z";

export function FashionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={51} rx={17} />
      {/* hanger */}
      <path d="M32 13.5v-1.8c0-2.6 3.6-2.6 3.6-.5" strokeWidth={1.5} />
      <path d="M25.5 19L32 13.5 38.5 19z" fill="#fff" />
      {/* depth silhouette */}
      <path d={SHIRT} transform="translate(3.5 -3)" fill={DEPTH} />
      {/* shirt */}
      <path d={SHIRT} fill="#fff" />
      <path d="M25 29v-2M39 29v-2" strokeWidth={1.2} opacity={0.7} />
      <Sparkle x={54} y={16} />
    </Doodle>
  );
}

const CAR_BODY =
  "M8 42v-6c0-1.7.8-2.6 2.5-3l7.5-1.5 6-8c1-1.3 2.2-2 4-2h12c1.8 0 3 .7 4 2l6 8 5 1c1.7.4 2.5 1.3 2.5 3v6c0 1-.7 1.5-1.7 1.5H9.7C8.7 43.5 8 43 8 42z";

export function VehiclesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={53} rx={22} />
      {/* depth silhouette */}
      <g transform="translate(4 -3.5)">
        <path d={CAR_BODY} fill={DEPTH} />
      </g>
      {/* body */}
      <path d={CAR_BODY} fill="#fff" />
      <path d="M26.5 24.5c.5-.6 1-1 2-1h2.5v7.5h-10z" fill={DEPTH} strokeWidth={1.3} />
      <path d="M34 23.5h4c1 0 1.5.4 2 1l4.5 6.5H34z" fill={DEPTH} strokeWidth={1.3} />
      <path d="M34 35h3.5" strokeWidth={1.3} />
      <circle cx="19" cy="43" r="5" fill="#fff" />
      <circle cx="19" cy="43" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="45" cy="43" r="5" fill="#fff" />
      <circle cx="45" cy="43" r="1.6" fill="currentColor" stroke="none" />
    </Doodle>
  );
}

export function BooksHobbiesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Doodle {...props}>
      <Shadow cx={31} cy={55} rx={19} />
      {/* bottom book */}
      <path d="M13 42h28l8-5H21z" fill="#fff" />
      <path d="M41 42l8-5v7l-8 5z" fill={DEPTH} />
      <path d="M13 42h28v7H13z" fill="#fff" />
      <path d="M15 45.5h24" strokeWidth={1} opacity={0.55} />
      {/* middle book */}
      <path d="M16 35h24l8-5H24z" fill="#fff" />
      <path d="M40 35l8-5v7l-8 5z" fill={DEPTH} />
      <path d="M16 35h24v7H16z" fill={LIGHT} />
      {/* top book */}
      <path d="M19 28h18l8-5H27z" fill="#fff" />
      <path d="M37 28l8-5v7l-8 5z" fill={DEPTH} />
      <path d="M19 28h18v7H19z" fill="#fff" />
      <path d="M31 25.7l4-2.5" strokeWidth={1.3} />
      <Sparkle x={54} y={14} />
    </Doodle>
  );
}

export function HomeLivingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Doodle {...props}>
      <Shadow cx={33} cy={54} rx={20} />
      {/* roof side panel */}
      <path d="M28 20l12-6 12 10-12 6z" fill={LIGHT} />
      {/* side wall */}
      <path d="M40 30l12-6v18l-12 6z" fill={DEPTH} />
      <path d="M43 32.5l5-2.5v5.5l-5 2.5z" fill="#fff" strokeWidth={1.3} />
      {/* front gable */}
      <path d="M16 30l12-10 12 10v18H16z" fill="#fff" />
      <path d="M25 48v-6.5c0-1.9 1.3-3 3-3s3 1.1 3 3V48" fill={DEPTH} />
      <path d="M19 33.5h5.5V39H19z" fill="#fff" strokeWidth={1.3} />
      <path d="M21.75 33.5V39M19 36.25h5.5" strokeWidth={1} />
      <Sparkle x={12} y={14} />
    </Doodle>
  );
}

export function SportsFitnessIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={52} rx={19} />
      {/* bar */}
      <path d="M20 36l24-9v3.5l-24 9z" fill="#fff" />
      {/* left plate cylinder */}
      <g transform="rotate(-20 17 39)">
        <rect x="14" y="30" width="7" height="18" rx="3.4" fill={DEPTH} />
        <ellipse cx="14.5" cy="39" rx="3.2" ry="9" fill="#fff" />
      </g>
      {/* right plate cylinder */}
      <g transform="rotate(-20 46 28)">
        <rect x="43" y="19" width="7" height="18" rx="3.4" fill={DEPTH} />
        <ellipse cx="43.5" cy="28" rx="3.2" ry="9" fill="#fff" />
      </g>
      <Sparkle x={14} y={14} />
    </Doodle>
  );
}

export function KidsBabyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={21} />
      {/* bottom block */}
      <path d="M14 34h14l8-5.5H22z" fill={LIGHT} />
      <path d="M28 34l8-5.5v14L28 48z" fill={DEPTH} />
      <path d="M14 34h14v14H14z" fill="#fff" />
      <path d="M18 45l3-7 3 7M19.2 42.5h3.6" strokeWidth={1.4} />
      {/* top block */}
      <path d="M20 22h12l7-4.5H27z" fill={LIGHT} />
      <path d="M32 22l7-4.5V29L32 33.5z" fill={DEPTH} />
      <path d="M20 22h12v11.5H20z" fill="#fff" />
      <circle cx="26" cy="28" r="3" strokeWidth={1.4} />
      {/* ball */}
      <circle cx="47" cy="42" r="6.5" fill="#fff" />
      <path d="M40.8 40.5c4 2.8 8.4 2.8 12.4 0" strokeWidth={1.3} />
      <path d="M47 35.5c2.7 4.3 2.7 8.7 0 13" strokeWidth={1.3} />
      <Sparkle x={52} y={16} />
    </Doodle>
  );
}

export function RealEstateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Doodle {...props}>
      <Shadow cx={28} cy={52} rx={20} />
      {/* tower */}
      <path d="M22 10h14l7-4.5H29z" fill={LIGHT} />
      <path d="M36 10l7-4.5V43L36 48z" fill={DEPTH} />
      <path d="M38.5 15.5l3-2M38.5 21.5l3-2M38.5 27.5l3-2M38.5 33.5l3-2" strokeWidth={1.2} />
      <path d="M22 10h14v38H22z" fill="#fff" />
      <path d="M26 15.5h2.5M31 15.5h2.5M26 21.5h2.5M31 21.5h2.5M26 27.5h2.5M31 27.5h2.5M26 33.5h2.5M31 33.5h2.5" strokeWidth={1.6} />
      <path d="M27 48v-5.5h5V48" fill={DEPTH} />
      {/* low block */}
      <path d="M8 32h12l6-4h-8z" fill={LIGHT} />
      <path d="M8 32h12v16H8z" fill="#fff" />
      <path d="M11.5 36h5v4.5h-5z" fill="#fff" strokeWidth={1.2} />
      <Sparkle x={52} y={14} />
    </Doodle>
  );
}

export function PetSuppliesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Doodle {...props}>
      <Shadow cx={29} cy={53} rx={17} />
      {/* bowl */}
      <path d="M15 34c0 8 5 13.5 14 13.5S43 42 43 34z" fill="#fff" />
      <ellipse cx="29" cy="34" rx="14" ry="4.8" fill="#fff" />
      <ellipse cx="29" cy="34" rx="10" ry="3.1" fill={DEPTH} strokeWidth={1.2} />
      <circle cx="25.5" cy="33.6" r="1" fill="currentColor" stroke="none" />
      <circle cx="30" cy="34.6" r="1" fill="currentColor" stroke="none" />
      <circle cx="33.5" cy="33.2" r="1" fill="currentColor" stroke="none" />
      <path d="M22 41.5h14" strokeWidth={1.2} opacity={0.6} />
      {/* paw print */}
      <ellipse cx="49" cy="20" rx="3.4" ry="2.9" fill="currentColor" stroke="none" />
      <ellipse cx="44.2" cy="16.2" rx="1.6" ry="2" fill="currentColor" stroke="none" transform="rotate(-18 44.2 16.2)" />
      <ellipse cx="47.8" cy="14" rx="1.6" ry="2" fill="currentColor" stroke="none" transform="rotate(-6 47.8 14)" />
      <ellipse cx="51.8" cy="14.4" rx="1.6" ry="2" fill="currentColor" stroke="none" transform="rotate(8 51.8 14.4)" />
      <ellipse cx="54.8" cy="17.4" rx="1.6" ry="2" fill="currentColor" stroke="none" transform="rotate(22 54.8 17.4)" />
      <Sparkle x={12} y={16} />
    </Doodle>
  );
}

export function ServicesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Doodle {...props}>
      <Shadow cx={31} cy={52} rx={19} />
      {/* toolbox */}
      <path d="M14 30h24l10-7H24z" fill={LIGHT} />
      <path d="M38 30l10-7v16l-10 7z" fill={DEPTH} />
      <path d="M38 35.5l10-7" strokeWidth={1.2} />
      <path d="M14 30h24v16H14z" fill="#fff" />
      <path d="M14 35.5h24" strokeWidth={1.2} />
      <path d="M24 30h4v4.5h-4z" fill="#fff" strokeWidth={1.3} />
      {/* handle */}
      <path d="M27 26.5c1.7-3.6 6.6-3.6 8.3 0" strokeWidth={1.6} />
      <Sparkle x={11} y={13} />
    </Doodle>
  );
}
