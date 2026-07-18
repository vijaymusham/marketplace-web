import type { SVGProps } from "react";
import {
  Doodle,
  Shadow,
  Sparkle,
  DEPTH,
  LIGHT,
  type CategoryIconComponent,
} from "@/components/icons/category-icons";

type IconProps = SVGProps<SVGSVGElement>;

/* ─── Mobiles & Tablets ─── */

export function MobilePhonesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={53} rx={14} />
      <path d="M24 12l14 3.5 4-2.2-14-3.5z" fill={LIGHT} />
      <path d="M38 15.5l4-2.2v32l-4 2.2z" fill={DEPTH} />
      <path d="M24 12l14 3.5v32L24 44z" fill="#fff" />
      <path d="M27 16.5l9 2.2v24l-9-2.2z" fill={DEPTH} stroke="none" />
      <path d="M27 16.5l9 2.2v24l-9-2.2z" strokeWidth={1.2} />
      <path d="M29.5 18.8l5 1.2" strokeWidth={1.2} />
      <circle cx="31" cy="42" r="1.2" fill="currentColor" stroke="none" />
      <Sparkle x={52} y={14} />
    </Doodle>
  );
}

export function TabletsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={33} cy={52} rx={18} />
      <path d="M14 14l26 5.5 6-3.2-26-5.5z" fill={LIGHT} />
      <path d="M40 19.5l6-3.2v28l-6 3.2z" fill={DEPTH} />
      <path d="M14 14l26 5.5v28L14 42z" fill="#fff" />
      <path d="M18 18l18 4v20l-18-4z" fill={DEPTH} stroke="none" />
      <path d="M18 18l18 4v20l-18-4z" strokeWidth={1.2} />
      <circle cx="27" cy="39" r="1.2" fill="currentColor" stroke="none" />
      <Sparkle x={54} y={12} />
    </Doodle>
  );
}

export function AccessoriesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={53} rx={16} />
      {/* earbud case */}
      <path d="M20 28h18l8-5H28z" fill={LIGHT} />
      <path d="M38 28l8-5v16l-8 5z" fill={DEPTH} />
      <path d="M20 28h18v16H20z" fill="#fff" />
      <path d="M20 36h18" strokeWidth={1.2} />
      <circle cx="29" cy="32" r="1.4" fill="currentColor" stroke="none" />
      {/* earbud */}
      <ellipse cx="46" cy="20" rx="5" ry="6" fill="#fff" />
      <path d="M46 26v8c0 2 2 3 4 2" strokeWidth={1.5} />
      <Sparkle x={14} y={14} />
    </Doodle>
  );
}

export function SmartWatchesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={14} />
      {/* band top */}
      <path d="M26 12h10l3-2H29z" fill={LIGHT} />
      <path d="M26 12h10v8H26z" fill="#fff" />
      {/* watch body */}
      <path d="M22 20h18l6-3.5H28z" fill={LIGHT} />
      <path d="M40 20l6-3.5v18L40 38z" fill={DEPTH} />
      <path d="M22 20h18v18H22z" fill="#fff" />
      <path d="M26 24h10v10H26z" fill={DEPTH} stroke="none" />
      <path d="M26 24h10v10H26z" strokeWidth={1.2} />
      <path d="M31 27v4l3 1.5" strokeWidth={1.3} />
      {/* band bottom */}
      <path d="M26 38h10v8H26z" fill="#fff" />
      <path d="M36 38l4-2.5v8L36 46z" fill={DEPTH} />
      <Sparkle x={52} y={14} />
    </Doodle>
  );
}

/* ─── Electronics ─── */

export function TvsVideoAudioIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={20} />
      <path d="M12 16h32l8-4.5H20z" fill={LIGHT} />
      <path d="M44 16l8-4.5v22L44 38z" fill={DEPTH} />
      <path d="M12 16h32v22H12z" fill="#fff" />
      <path d="M16 20h24v14H16z" fill={DEPTH} stroke="none" />
      <path d="M16 20h24v14H16z" strokeWidth={1.2} />
      <path d="M28 38v6M22 44h12" />
      <Sparkle x={14} y={10} />
    </Doodle>
  );
}

export function KitchenAppliancesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={31} cy={54} rx={15} />
      {/* blender jar */}
      <path d="M24 14h12l5-3H29z" fill={LIGHT} />
      <path d="M36 14l5-3v16l-5 3z" fill={DEPTH} />
      <path d="M24 14h12v16H24z" fill="#fff" />
      <path d="M27 20h6" strokeWidth={1.2} opacity={0.6} />
      {/* base */}
      <path d="M20 30h20l6-3.5H26z" fill={LIGHT} />
      <path d="M40 30l6-3.5v16L40 46z" fill={DEPTH} />
      <path d="M20 30h20v16H20z" fill="#fff" />
      <circle cx="30" cy="38" r="3.5" fill={DEPTH} />
      <Sparkle x={52} y={12} />
    </Doodle>
  );
}

export function ComputersLaptopsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={30} cy={52} rx={20} />
      <path d="M16 10l26 6v18l-26-6z" fill="#fff" />
      <path d="M19 13.5l20 5v12l-20-5z" fill={DEPTH} stroke="none" />
      <path d="M19 13.5l20 5v12l-20-5z" strokeWidth={1.2} />
      <path d="M16 28l26 6-8 9-26-6z" fill="#fff" />
      <path d="M8 37l26 6v3l-26-6z" fill={DEPTH} />
      <path d="M34 43l8-9v3l-8 9z" fill={DEPTH} />
      <Sparkle x={53} y={12} />
    </Doodle>
  );
}

export function CamerasLensesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={53} rx={17} />
      <path d="M16 24h26l8-5H24z" fill={LIGHT} />
      <path d="M42 24l8-5v18l-8 5z" fill={DEPTH} />
      <path d="M16 24h26v18H16z" fill="#fff" />
      <circle cx="30" cy="33" r="7" fill="#fff" />
      <circle cx="30" cy="33" r="4" fill={DEPTH} />
      <circle cx="30" cy="33" r="1.5" fill="currentColor" stroke="none" />
      <path d="M22 24l3-5h8l3 5" fill="#fff" />
      <rect x="40" y="27" width="4" height="3" rx="1" fill={DEPTH} stroke="none" />
      <Sparkle x={54} y={14} />
    </Doodle>
  );
}

export function GamesEntertainmentIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={52} rx={18} />
      <path d="M14 28c0-4 3-7 8-7h20c5 0 8 3 8 7v8c0 4-3 7-8 7H22c-5 0-8-3-8-7z" fill="#fff" />
      <path d="M50 28v8c0 4-3 7-8 7h-2l10-5.5V25.5z" fill={DEPTH} stroke="none" />
      <circle cx="24" cy="32" r="2.2" fill="currentColor" stroke="none" />
      <path d="M24 28v8M20 32h8" strokeWidth={1.4} />
      <circle cx="40" cy="30" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="44" cy="34" r="1.6" fill="currentColor" stroke="none" />
      <Sparkle x={14} y={14} />
    </Doodle>
  );
}

export function FridgesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={30} cy={54} rx={14} />
      <path d="M20 10h18l6-3.5H26z" fill={LIGHT} />
      <path d="M38 10l6-3.5v40L38 50z" fill={DEPTH} />
      <path d="M20 10h18v40H20z" fill="#fff" />
      <path d="M20 28h18" strokeWidth={1.3} />
      <path d="M34 16v6M34 34v8" strokeWidth={1.4} />
      <Sparkle x={52} y={12} />
    </Doodle>
  );
}

export function ComputerAccessoriesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={18} />
      {/* keyboard */}
      <path d="M12 34h32l8-5H20z" fill={LIGHT} />
      <path d="M44 34l8-5v12l-8 5z" fill={DEPTH} />
      <path d="M12 34h32v12H12z" fill="#fff" />
      <path d="M16 38h4M22 38h4M28 38h4M34 38h4M16 42h24" strokeWidth={1.1} />
      {/* mouse */}
      <ellipse cx="48" cy="22" rx="6" ry="8" fill="#fff" />
      <path d="M48 16v6" strokeWidth={1.3} />
      <Sparkle x={14} y={14} />
    </Doodle>
  );
}

export function HardDisksPrintersMonitorsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={18} />
      {/* monitor */}
      <path d="M14 12h28l7-4H21z" fill={LIGHT} />
      <path d="M42 12l7-4v18l-7 4z" fill={DEPTH} />
      <path d="M14 12h28v18H14z" fill="#fff" />
      <path d="M18 16h20v10H18z" fill={DEPTH} stroke="none" />
      <path d="M18 16h20v10H18z" strokeWidth={1.2} />
      <path d="M28 30v4M22 34h12" />
      {/* HDD */}
      <path d="M18 40h20l6-3.5H24z" fill={LIGHT} />
      <path d="M38 40l6-3.5v8L38 48z" fill={DEPTH} />
      <path d="M18 40h20v8H18z" fill="#fff" />
      <circle cx="24" cy="44" r="1.3" fill="currentColor" stroke="none" />
      <Sparkle x={54} y={10} />
    </Doodle>
  );
}

export function AcsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={52} rx={18} />
      <path d="M12 20h36l8-5H20z" fill={LIGHT} />
      <path d="M48 20l8-5v16l-8 5z" fill={DEPTH} />
      <path d="M12 20h36v16H12z" fill="#fff" />
      <path d="M16 26h28" strokeWidth={1.2} />
      <path d="M18 32h4M26 32h4M34 32h4" strokeWidth={1.3} />
      <path d="M20 36c4 4 8 4 12 0M32 36c4 4 8 4 12 0" strokeWidth={1.2} opacity={0.7} />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

export function WashingMachinesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={31} cy={54} rx={15} />
      <path d="M18 10h22l7-4H25z" fill={LIGHT} />
      <path d="M40 10l7-4v40l-7 4z" fill={DEPTH} />
      <path d="M18 10h22v40H18z" fill="#fff" />
      <path d="M18 18h22" strokeWidth={1.2} />
      <circle cx="24" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="29" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="29" cy="34" r="10" fill="#fff" />
      <circle cx="29" cy="34" r="6.5" fill={DEPTH} strokeWidth={1.3} />
      <path d="M29 30.5c2 0 3.5 1.5 3.5 3.5" strokeWidth={1.2} />
      <Sparkle x={54} y={12} />
    </Doodle>
  );
}

/* ─── Furniture ─── */

export function SofaDiningIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={20} />
      <path d="M14 22h28l6-3.5H20z" fill={LIGHT} />
      <path d="M42 22l6-3.5v12L42 34z" fill={DEPTH} />
      <path d="M14 22h28v12H14z" fill="#fff" />
      <path d="M10 34h36l6-4H16z" fill="#fff" />
      <path d="M46 34l6-4v10l-6 4z" fill={DEPTH} />
      <path d="M10 34h36v10H10z" fill="#fff" />
      <path d="M14 44v4M42 44v4" />
      <Sparkle x={54} y={14} />
    </Doodle>
  );
}

export function BedsWardrobesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={20} />
      {/* headboard */}
      <path d="M14 16h28l6-3.5H20z" fill={LIGHT} />
      <path d="M42 16l6-3.5v12L42 28z" fill={DEPTH} />
      <path d="M14 16h28v12H14z" fill="#fff" />
      {/* mattress */}
      <path d="M12 28h36l6-3.5H18z" fill={LIGHT} />
      <path d="M48 28l6-3.5v10L48 38z" fill={DEPTH} />
      <path d="M12 28h36v10H12z" fill="#fff" />
      <path d="M16 38v6M44 38v6" />
      <Sparkle x={14} y={10} />
    </Doodle>
  );
}

export function HomeDecorGardenIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={14} />
      {/* pot */}
      <path d="M24 36h16l4-3H28z" fill={LIGHT} />
      <path d="M40 36l4-3v10l-4 3z" fill={DEPTH} />
      <path d="M24 36h16v10H24z" fill="#fff" />
      {/* plant */}
      <path d="M32 36c-6-8-2-16 0-20 2 4 6 12 0 20z" fill="#fff" />
      <path d="M32 36c6-8 2-16 0-20-2 4-6 12 0 20z" fill={LIGHT} />
      <path d="M32 16v20" strokeWidth={1.3} />
      <Sparkle x={50} y={14} />
    </Doodle>
  );
}

export function KidsFurnitureIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={16} />
      <path d="M22 16h16l5-3H27z" fill={LIGHT} />
      <path d="M38 16l5-3v14l-5 3z" fill={DEPTH} />
      <path d="M22 16h16v14H22z" fill="#fff" />
      <path d="M18 30h22l5-3H23z" fill="#fff" />
      <path d="M40 30l5-3v10l-5 3z" fill={DEPTH} />
      <path d="M18 30h22v10H18z" fill="#fff" />
      <path d="M22 40v5M36 40v5" />
      <Sparkle x={52} y={12} />
    </Doodle>
  );
}

export function OtherHouseholdItemsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={12} />
      {/* lamp shade */}
      <path d="M20 18h24l6-8H26z" fill={LIGHT} />
      <path d="M44 18l6-8v4l-6 8z" fill={DEPTH} />
      <path d="M20 18h24l-4 8H24z" fill="#fff" />
      <path d="M32 26v16" />
      <path d="M26 42h12l3-2H29z" fill={LIGHT} />
      <path d="M38 42l3-2v6l-3 2z" fill={DEPTH} />
      <path d="M26 42h12v6H26z" fill="#fff" />
      <Sparkle x={52} y={10} />
    </Doodle>
  );
}

/* ─── Fashion ─── */

export function MenIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={52} rx={15} />
      <path d="M26 14l-8 10 5 4 3-3v18h12V25l3 3 5-4-8-10c-2 2-10 2-12 0z" fill="#fff" />
      <path
        d="M26 14l-8 10 5 4 3-3v18h12V25l3 3 5-4-8-10c-2 2-10 2-12 0z"
        transform="translate(3.5 -2.5)"
        fill={DEPTH}
        stroke="none"
      />
      <path d="M26 14l-8 10 5 4 3-3v18h12V25l3 3 5-4-8-10c-2 2-10 2-12 0z" fill="#fff" />
      <path d="M32 14v8" strokeWidth={1.3} />
      <Sparkle x={52} y={14} />
    </Doodle>
  );
}

export function WomenIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={53} rx={14} />
      {/* dress */}
      <path d="M28 14l-4 8 4 3v4l-10 16h24L32 29v-4l4-3-4-8z" fill="#fff" />
      <path d="M42 45l4-2.5V29l-4 2.5z" fill={DEPTH} stroke="none" />
      <path d="M28 14c2 2 6 2 8 0" strokeWidth={1.3} />
      {/* bag accent */}
      <path d="M46 28h6l2-1.5h-6z" fill={LIGHT} />
      <path d="M52 28l2-1.5v10l-2 1.5z" fill={DEPTH} />
      <path d="M46 28h6v10h-6z" fill="#fff" />
      <path d="M48 28c.8-2 3.2-2 4 0" strokeWidth={1.2} />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

export function KidsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={52} rx={14} />
      <path d="M28 16l-7 8 4.5 3.5 2.5-2.5v16h10V25l2.5 2.5 4.5-3.5-7-8c-1.5 1.5-7.5 1.5-9 0z" fill="#fff" />
      <path
        d="M28 16l-7 8 4.5 3.5 2.5-2.5v16h10V25l2.5 2.5 4.5-3.5-7-8c-1.5 1.5-7.5 1.5-9 0z"
        transform="translate(3 -2)"
        fill={DEPTH}
        stroke="none"
      />
      <path d="M28 16l-7 8 4.5 3.5 2.5-2.5v16h10V25l2.5 2.5 4.5-3.5-7-8c-1.5 1.5-7.5 1.5-9 0z" fill="#fff" />
      <circle cx="32" cy="12" r="3.5" fill="#fff" />
      <Sparkle x={52} y={14} />
    </Doodle>
  );
}

/* ─── Vehicles ─── */

export function CarsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={53} rx={22} />
      <path d="M8 40v-5c0-1.5.7-2.4 2.2-2.8l7-1.4 5.5-7.5c.9-1.2 2-1.8 3.6-1.8h11c1.6 0 2.7.6 3.6 1.8l5.5 7.5 4.5.9c1.5.4 2.2 1.3 2.2 2.8v5c0 .9-.6 1.4-1.5 1.4H9.5C8.6 41.4 8 40.9 8 40z" fill="#fff" />
      <path d="M8 40v-5c0-1.5.7-2.4 2.2-2.8l7-1.4 5.5-7.5c.9-1.2 2-1.8 3.6-1.8h11c1.6 0 2.7.6 3.6 1.8l5.5 7.5 4.5.9c1.5.4 2.2 1.3 2.2 2.8v5c0 .9-.6 1.4-1.5 1.4H9.5C8.6 41.4 8 40.9 8 40z" transform="translate(3.5 -3)" fill={DEPTH} stroke="none" />
      <path d="M8 40v-5c0-1.5.7-2.4 2.2-2.8l7-1.4 5.5-7.5c.9-1.2 2-1.8 3.6-1.8h11c1.6 0 2.7.6 3.6 1.8l5.5 7.5 4.5.9c1.5.4 2.2 1.3 2.2 2.8v5c0 .9-.6 1.4-1.5 1.4H9.5C8.6 41.4 8 40.9 8 40z" fill="#fff" />
      <path d="M25 23.5h3.5v7H18z" fill={DEPTH} strokeWidth={1.2} />
      <path d="M32 22.5h4c.9 0 1.4.4 1.8.9l4 6.1H32z" fill={DEPTH} strokeWidth={1.2} />
      <circle cx="18" cy="41" r="4.5" fill="#fff" />
      <circle cx="18" cy="41" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="44" cy="41" r="4.5" fill="#fff" />
      <circle cx="44" cy="41" r="1.5" fill="currentColor" stroke="none" />
    </Doodle>
  );
}

export function MotorcyclesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={20} />
      <circle cx="16" cy="42" r="7" fill="#fff" />
      <circle cx="16" cy="42" r="2" fill="currentColor" stroke="none" />
      <circle cx="48" cy="42" r="7" fill="#fff" />
      <circle cx="48" cy="42" r="2" fill="currentColor" stroke="none" />
      <path d="M16 42l12-14h10l6 8 4 6" fill="none" />
      <path d="M28 28h8l4-6h6" />
      <path d="M34 28v8l-6 6" />
      <path d="M40 22h6l2 4" fill="#fff" />
      <Sparkle x={14} y={14} />
    </Doodle>
  );
}

export function ScootersIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={18} />
      <circle cx="18" cy={44} r="6" fill="#fff" />
      <circle cx="18" cy={44} r="1.8" fill="currentColor" stroke="none" />
      <circle cx="46" cy={44} r="6" fill="#fff" />
      <circle cx="46" cy={44} r="1.8" fill="currentColor" stroke="none" />
      <path d="M18 44h20c4 0 8-4 8-10V26" />
      <path d="M46 26h-6l-2-6h8z" fill="#fff" />
      <path d="M28 34h10" strokeWidth={1.3} />
      <path d="M38 26v-4c0-2 2-3 4-2" />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

export function BicyclesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={20} />
      <circle cx="16" cy="42" r="7.5" fill="#fff" />
      <circle cx="16" cy="42" r="2" fill="currentColor" stroke="none" />
      <circle cx="48" cy="42" r="7.5" fill="#fff" />
      <circle cx="48" cy="42" r="2" fill="currentColor" stroke="none" />
      <path d="M16 42l14-16h8l10 16" />
      <path d="M30 26l-4 10h12" />
      <path d="M38 26v-6h6" />
      <path d="M26 36l6-4" />
      <Sparkle x={32} y={12} />
    </Doodle>
  );
}

export function SparePartsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={14} />
      {/* gear */}
      <circle cx="28" cy="30" r="10" fill="#fff" />
      <circle cx="28" cy="30" r="4" fill={DEPTH} />
      <path d="M28 16v4M28 40v4M14 30h4M38 30h4M18 20l3 3M35 37l3 3M18 40l3-3M35 23l3-3" strokeWidth={2} />
      {/* wrench */}
      <path d="M42 18c3-3 8-3 9 0l-4 4 4 4c-1 3-6 3-9 0" fill="#fff" />
      <path d="M42 26l-12 12" strokeWidth={2} />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

export function CommercialVehiclesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={22} />
      {/* cabin */}
      <path d="M8 28h14l5-3H13z" fill={LIGHT} />
      <path d="M22 28l5-3v14l-5 3z" fill={DEPTH} />
      <path d="M8 28h14v14H8z" fill="#fff" />
      <path d="M11 31h8v5h-8z" fill={DEPTH} strokeWidth={1.2} />
      {/* cargo */}
      <path d="M22 22h26l6-3.5H28z" fill={LIGHT} />
      <path d="M48 22l6-3.5v20L48 42z" fill={DEPTH} />
      <path d="M22 22h26v20H22z" fill="#fff" />
      <circle cx="14" cy="44" r="4" fill="#fff" />
      <circle cx="14" cy="44" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="36" cy="44" r="4" fill="#fff" />
      <circle cx="36" cy="44" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="46" cy="44" r="4" fill="#fff" />
      <circle cx="46" cy="44" r="1.3" fill="currentColor" stroke="none" />
      <Sparkle x={54} y={12} />
    </Doodle>
  );
}

/* ─── Books & Hobbies ─── */

export function BooksIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={31} cy={54} rx={16} />
      <path d="M18 16l-4 2v28l4-2 14 4 4-2V18l-4 2z" fill="#fff" />
      <path d="M32 20l4-2v28l-4 2z" fill={DEPTH} />
      <path d="M18 16l14 4v28L18 44z" fill="#fff" />
      <path d="M22 24h8M22 30h8M22 36h6" strokeWidth={1.2} opacity={0.65} />
      <Sparkle x={50} y={14} />
    </Doodle>
  );
}

export function MusicalInstrumentsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={30} cy={54} rx={16} />
      {/* guitar body */}
      <ellipse cx="28" cy="38" rx="12" ry="10" fill="#fff" />
      <ellipse cx="28" cy="38" rx="5" ry="4" fill={DEPTH} />
      {/* neck */}
      <path d="M34 30l14-18 3 2.5-14 18z" fill="#fff" />
      <path d="M48 12l3 2.5v4l-3-2.5z" fill={DEPTH} />
      <path d="M36 28l2-2.5M40 23l2-2.5M44 18l2-2.5" strokeWidth={1.1} />
      <Sparkle x={14} y={14} />
    </Doodle>
  );
}

export function OtherHobbiesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={14} />
      {/* palette */}
      <ellipse cx="30" cy="32" rx="16" ry="14" fill="#fff" />
      <circle cx="22" cy="26" r="2.5" fill={DEPTH} stroke="none" />
      <circle cx="30" cy="24" r="2.5" fill="currentColor" stroke="none" opacity={0.35} />
      <circle cx="38" cy="28" r="2.5" fill={DEPTH} stroke="none" />
      <circle cx="26" cy="36" r="2.5" fill="currentColor" stroke="none" opacity={0.25} />
      <ellipse cx="40" cy="38" rx="4" ry="5" fill={LIGHT} />
      {/* brush */}
      <path d="M44 18l8 8-3 3-8-8z" fill="#fff" />
      <path d="M52 26l4-2-2 6z" fill={DEPTH} />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

/* ─── Home & Living ─── */

export function KitchenwareIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={30} cy={54} rx={16} />
      {/* pot */}
      <path d="M16 28h28l6-4H22z" fill={LIGHT} />
      <path d="M44 28l6-4v16l-6 4z" fill={DEPTH} />
      <path d="M16 28h28v16H16z" fill="#fff" />
      <path d="M12 30h4M48 28h4" strokeWidth={1.5} />
      <path d="M24 28v-6h12v6" />
      <path d="M28 22c0-3 8-3 8 0" strokeWidth={1.3} />
      <Sparkle x={52} y={12} />
    </Doodle>
  );
}

export function LightingIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={12} />
      <path d="M32 12c-8 0-12 6-12 12 0 5 3 8 5 10h14c2-2 5-5 5-10 0-6-4-12-12-12z" fill="#fff" />
      <path d="M44 24c0 5-3 8-5 10l3-1.5c2-2 4-5 4-8.5 0-5-3-10-9-11.5z" fill={DEPTH} stroke="none" />
      <path d="M25 34h14v4H25z" fill="#fff" />
      <path d="M27 38h10v4c0 2-2 4-5 4s-5-2-5-4z" fill="#fff" />
      <path d="M28 22v6M32 20v8M36 22v6" strokeWidth={1.2} opacity={0.5} />
      <Sparkle x={50} y={14} />
    </Doodle>
  );
}

/* ─── Sports & Fitness ─── */

export function GymFitnessIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={52} rx={19} />
      <path d="M20 36l24-9v3.5l-24 9z" fill="#fff" />
      <g transform="rotate(-20 17 39)">
        <rect x="14" y="30" width="7" height="18" rx="3.4" fill={DEPTH} />
        <ellipse cx="14.5" cy="39" rx="3.2" ry="9" fill="#fff" />
      </g>
      <g transform="rotate(-20 46 28)">
        <rect x="43" y="19" width="7" height="18" rx="3.4" fill={DEPTH} />
        <ellipse cx="43.5" cy="28" rx="3.2" ry="9" fill="#fff" />
      </g>
      <Sparkle x={14} y={14} />
    </Doodle>
  );
}

export function SportsEquipmentIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={16} />
      {/* ball */}
      <circle cx="28" cy="34" r="14" fill="#fff" />
      <path d="M16 30c8 4 16 4 24 0" strokeWidth={1.3} />
      <path d="M28 20c4 8 4 16 0 28" strokeWidth={1.3} />
      <path d="M18 42c6-3 14-3 20 0" strokeWidth={1.2} />
      {/* racket handle tip */}
      <path d="M44 16l8 8-2 2-8-8z" fill="#fff" />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

export function CyclingIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={20} />
      <circle cx="16" cy="42" r="7.5" fill="#fff" />
      <circle cx="16" cy="42" r="2" fill="currentColor" stroke="none" />
      <circle cx="48" cy="42" r="7.5" fill="#fff" />
      <circle cx="48" cy="42" r="2" fill="currentColor" stroke="none" />
      <path d="M16 42l14-16h8l10 16" />
      <path d="M30 26l-4 10h12" />
      <path d="M38 26v-6h6" />
      <path d="M32 16l2 4-2 2-2-2z" fill={DEPTH} />
      <Sparkle x={32} y={10} />
    </Doodle>
  );
}

export function OtherSportsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={14} />
      {/* trophy */}
      <path d="M22 18h20l4-2.5H26z" fill={LIGHT} />
      <path d="M42 18l4-2.5v14L42 32z" fill={DEPTH} />
      <path d="M22 18h20c0 10-4 14-10 14s-10-4-10-14z" fill="#fff" />
      <path d="M18 20c-4 2-4 10 0 12M46 20c4 2 4 10 0 12" strokeWidth={1.4} />
      <path d="M28 32h8v4H28z" fill="#fff" />
      <path d="M24 36h16l3-2H27z" fill={LIGHT} />
      <path d="M40 36l3-2v6l-3 2z" fill={DEPTH} />
      <path d="M24 36h16v6H24z" fill="#fff" />
      <Sparkle x={52} y={12} />
    </Doodle>
  );
}

/* ─── Kids & Baby ─── */

export function ToysIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={18} />
      <path d="M16 30h16l8-5.5H24z" fill={LIGHT} />
      <path d="M32 30l8-5.5v16L32 46z" fill={DEPTH} />
      <path d="M16 30h16v16H16z" fill="#fff" />
      <path d="M20 41l3.5-8 3.5 8M21.2 38h5.6" strokeWidth={1.4} />
      <path d="M28 18h14l6-4H34z" fill={LIGHT} />
      <path d="M42 18l6-4v14l-6 4z" fill={DEPTH} />
      <path d="M28 18h14v14H28z" fill="#fff" />
      <circle cx="35" cy="25" r="3.5" strokeWidth={1.4} />
      <Sparkle x={54} y={12} />
    </Doodle>
  );
}

export function PramsWalkersIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={18} />
      {/* canopy */}
      <path d="M18 16h22c4 0 6 3 6 6v4H18z" fill="#fff" />
      <path d="M46 22v4l4-2.5V19.5z" fill={DEPTH} stroke="none" />
      {/* body */}
      <path d="M18 26h24l5-3H23z" fill={LIGHT} />
      <path d="M42 26l5-3v12l-5 3z" fill={DEPTH} />
      <path d="M18 26h24v12H18z" fill="#fff" />
      <path d="M42 26l8-10" />
      <circle cx="24" cy="44" r="5" fill="#fff" />
      <circle cx="24" cy="44" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="40" cy="44" r="5" fill="#fff" />
      <circle cx="40" cy="44" r="1.5" fill="currentColor" stroke="none" />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

export function KidsClothingIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={52} rx={14} />
      <path d="M28 16l-7 8 4.5 3.5 2.5-2.5v16h10V25l2.5 2.5 4.5-3.5-7-8c-1.5 1.5-7.5 1.5-9 0z" fill="#fff" />
      <path
        d="M28 16l-7 8 4.5 3.5 2.5-2.5v16h10V25l2.5 2.5 4.5-3.5-7-8c-1.5 1.5-7.5 1.5-9 0z"
        transform="translate(3 -2)"
        fill={DEPTH}
        stroke="none"
      />
      <path d="M28 16l-7 8 4.5 3.5 2.5-2.5v16h10V25l2.5 2.5 4.5-3.5-7-8c-1.5 1.5-7.5 1.5-9 0z" fill="#fff" />
      <path d="M29 28h6M29 34h6" strokeWidth={1.2} opacity={0.6} />
      <Sparkle x={52} y={14} />
    </Doodle>
  );
}

/* ─── Real Estate ─── */

export function ForSaleHousesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={30} cy={54} rx={18} />
      <path d="M26 18l10-5 10 9-10 5z" fill={LIGHT} />
      <path d="M36 27l10-5v18l-10 5z" fill={DEPTH} />
      <path d="M16 27l10-9 10 9v18H16z" fill="#fff" />
      <path d="M23 45v-6c0-1.6 1.2-2.6 2.6-2.6s2.6 1 2.6 2.6V45" fill={DEPTH} />
      <path d="M18 30h5v5h-5z" fill="#fff" strokeWidth={1.2} />
      {/* sale tag */}
      <path d="M46 14l8 4-4 8-8-4z" fill="#fff" />
      <circle cx="50" cy="20" r="1.2" fill="currentColor" stroke="none" />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

export function ForRentHousesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={28} cy={54} rx={18} />
      <path d="M24 18l10-5 10 9-10 5z" fill={LIGHT} />
      <path d="M34 27l10-5v18l-10 5z" fill={DEPTH} />
      <path d="M14 27l10-9 10 9v18H14z" fill="#fff" />
      <path d="M21 45v-6c0-1.6 1.2-2.6 2.6-2.6s2.6 1 2.6 2.6V45" fill={DEPTH} />
      {/* key */}
      <circle cx="50" cy="18" r="5" fill="#fff" />
      <circle cx="50" cy="18" r="2" fill={DEPTH} />
      <path d="M50 23v12l3 2v-3l-3-1" strokeWidth={1.5} />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

export function LandsPlotsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={52} rx={20} />
      <path d="M10 40l18-22 26 10-18 22z" fill="#fff" />
      <path d="M36 28l18-8v18l-18 8z" fill={DEPTH} stroke="none" />
      <path d="M10 40l18-22 26 10-18 22z" fill="#fff" />
      <path d="M18 36l10-12M28 42l12-8" strokeWidth={1.2} opacity={0.55} />
      <path d="M32 22v-6M29 19h6" strokeWidth={1.4} />
      <Sparkle x={52} y={12} />
    </Doodle>
  );
}

export function NewProjectsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={30} cy={54} rx={18} />
      <path d="M20 14h16l6-3.5H26z" fill={LIGHT} />
      <path d="M36 14l6-3.5v30L36 44z" fill={DEPTH} />
      <path d="M20 14h16v30H20z" fill="#fff" />
      <path d="M24 20h3M29 20h3M24 26h3M29 26h3M24 32h3M29 32h3" strokeWidth={1.5} />
      {/* crane */}
      <path d="M42 12h12M48 12v28M42 18h8" strokeWidth={1.4} />
      <path d="M54 12l-2 4h4z" fill={DEPTH} />
      <Sparkle x={14} y={10} />
    </Doodle>
  );
}

export function ForRentShopsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={30} cy={54} rx={18} />
      <path d="M14 24h28l8-5H22z" fill={LIGHT} />
      <path d="M42 24l8-5v22l-8 5z" fill={DEPTH} />
      <path d="M14 24h28v22H14z" fill="#fff" />
      <path d="M14 24l4-8h20l4 8" fill="#fff" />
      <path d="M24 46v-10h8v10" fill={DEPTH} />
      <path d="M18 30h5v5h-5z" fill="#fff" strokeWidth={1.2} />
      <circle cx="52" cy="16" r="4.5" fill="#fff" />
      <path d="M52 20.5v8l2.5 1.5" strokeWidth={1.3} />
      <Sparkle x={14} y={10} />
    </Doodle>
  );
}

export function ForSaleShopsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={18} />
      <path d="M14 24h28l8-5H22z" fill={LIGHT} />
      <path d="M42 24l8-5v22l-8 5z" fill={DEPTH} />
      <path d="M14 24h28v22H14z" fill="#fff" />
      <path d="M14 24l4-8h20l4 8" fill="#fff" />
      <path d="M24 46v-10h8v10" fill={DEPTH} />
      <path d="M18 30h5v5h-5z" fill="#fff" strokeWidth={1.2} />
      <path d="M48 12l8 4-4 8-8-4z" fill="#fff" />
      <circle cx="52" cy="18" r="1.1" fill="currentColor" stroke="none" />
      <Sparkle x={14} y={10} />
    </Doodle>
  );
}

export function PgGuestHousesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={18} />
      <path d="M16 20h28l8-5H24z" fill={LIGHT} />
      <path d="M44 20l8-5v26l-8 5z" fill={DEPTH} />
      <path d="M16 20h28v26H16z" fill="#fff" />
      {/* bed inside */}
      <path d="M20 34h16l4-2.5H24z" fill={LIGHT} />
      <path d="M36 34l4-2.5v8L36 42z" fill={DEPTH} />
      <path d="M20 34h16v8H20z" fill="#fff" />
      <path d="M20 28h6v6h-6z" fill={DEPTH} strokeWidth={1.2} />
      <path d="M26 46v-4h8v4" fill={DEPTH} />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

/* ─── Pet Supplies ─── */

export function FishesAquariumIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={16} />
      {/* tank */}
      <path d="M16 18h28l6-3.5H22z" fill={LIGHT} />
      <path d="M44 18l6-3.5v28L44 46z" fill={DEPTH} />
      <path d="M16 18h28v28H16z" fill="#fff" />
      {/* water line */}
      <path d="M16 24h28" strokeWidth={1.2} opacity={0.5} />
      {/* fish */}
      <ellipse cx="30" cy="34" rx="7" ry="4.5" fill={DEPTH} />
      <path d="M37 34l5-3.5v7z" fill="#fff" />
      <circle cx="27" cy="33" r="1" fill="currentColor" stroke="none" />
      <Sparkle x={54} y={12} />
    </Doodle>
  );
}

export function PetFoodAccessoriesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={30} cy={54} rx={16} />
      <path d="M16 34c0 8 5 13 14 13s14-5 14-13z" fill="#fff" />
      <ellipse cx="30" cy="34" rx="14" ry="4.5" fill="#fff" />
      <ellipse cx="30" cy="34" rx="10" ry="3" fill={DEPTH} strokeWidth={1.2} />
      {/* bone */}
      <path d="M44 18c2-2 6-2 6 1s-2 3-2 3l8 8s1 2-1 4-5 0-5 0l-8-8s-2 1-4-1 0-5 2-5z" fill="#fff" />
      <Sparkle x={14} y={14} />
    </Doodle>
  );
}

export function DogsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={14} />
      {/* head */}
      <ellipse cx="32" cy="30" rx="14" ry="12" fill="#fff" />
      <path d="M46 30c0 6-4 10-8 11.5V22c4 1 8 4 8 8z" fill={DEPTH} stroke="none" />
      {/* ears */}
      <path d="M20 22l-4-10 10 6z" fill="#fff" />
      <path d="M44 22l4-10-10 6z" fill="#fff" />
      <path d="M48 12l-2 8 4-4z" fill={DEPTH} stroke="none" />
      {/* face */}
      <circle cx="26" cy="28" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="36" cy="28" r="1.5" fill="currentColor" stroke="none" />
      <ellipse cx="31" cy="34" rx="3" ry="2" fill="currentColor" stroke="none" />
      <path d="M28 38c2 2 4 2 6 0" strokeWidth={1.3} />
      <Sparkle x={52} y={14} />
    </Doodle>
  );
}

export function OtherPetsIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={14} />
      <ellipse cx="32" cy="34" rx="10" ry="8" fill="#fff" />
      <ellipse cx="20" cy="24" rx="4" ry="5" fill="#fff" transform="rotate(-20 20 24)" />
      <ellipse cx="28" cy="20" rx="4" ry="5" fill="#fff" transform="rotate(-6 28 20)" />
      <ellipse cx="38" cy="20" rx="4" ry="5" fill="#fff" transform="rotate(8 38 20)" />
      <ellipse cx="46" cy="26" rx="4" ry="5" fill="#fff" transform="rotate(22 46 26)" />
      <ellipse cx="48" cy="28" rx="3" ry="4" fill={DEPTH} stroke="none" transform="rotate(22 48 28)" />
      <Sparkle x={14} y={14} />
    </Doodle>
  );
}

/* ─── Services ─── */

export function EducationClassesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={16} />
      {/* cap */}
      <path d="M12 28l20-10 20 10-20 10z" fill="#fff" />
      <path d="M32 38l20-10v4L32 42z" fill={DEPTH} />
      <path d="M32 18v4" />
      <path d="M48 30v10c-4 3-10 4-16 4" strokeWidth={1.4} />
      <path d="M20 34v6c4 2 8 3 12 3" strokeWidth={1.3} />
      <Sparkle x={14} y={14} />
    </Doodle>
  );
}

export function ToursTravelIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={16} />
      {/* suitcase */}
      <path d="M18 26h24l8-5H26z" fill={LIGHT} />
      <path d="M42 26l8-5v20l-8 5z" fill={DEPTH} />
      <path d="M18 26h24v20H18z" fill="#fff" />
      <path d="M28 26v-6c0-3 8-3 8 0v6" strokeWidth={1.5} />
      <path d="M30 34h8" strokeWidth={1.3} />
      {/* plane accent */}
      <path d="M48 14l8 3-6 2-1 5-3-4-5 1z" fill="#fff" />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

export function ElectronicsRepairIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={16} />
      {/* phone */}
      <path d="M22 16l12 3 3.5-2-12-3z" fill={LIGHT} />
      <path d="M34 19l3.5-2v20L34 39z" fill={DEPTH} />
      <path d="M22 16l12 3v20l-12-3z" fill="#fff" />
      {/* screwdriver */}
      <path d="M40 22l12 12" strokeWidth={2} />
      <path d="M50 32l4 4c1.5 1.5 0 4-2 4s-2.5-3.5-1-5z" fill="#fff" />
      <path d="M40 22l-2-4 4 2z" fill={DEPTH} />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

export function HealthBeautyIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={14} />
      {/* mirror */}
      <ellipse cx="28" cy="28" rx="12" ry="14" fill="#fff" />
      <ellipse cx="28" cy="28" rx="8" ry="10" fill={DEPTH} strokeWidth={1.2} />
      <path d="M28 42v6" />
      <path d="M22 48h12l2-1.5H24z" fill={LIGHT} />
      <path d="M34 48l2-1.5v4l-2 1.5z" fill={DEPTH} />
      <path d="M22 48h12v4H22z" fill="#fff" />
      {/* scissors */}
      <circle cx="48" cy="18" r="3" fill="#fff" />
      <circle cx="48" cy="28" r="3" fill="#fff" />
      <path d="M46 20l-8 14M50 20l8 14" strokeWidth={1.4} />
      <Sparkle x={14} y={12} />
    </Doodle>
  );
}

export function HomeRenovationIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={16} />
      {/* hammer */}
      <path d="M18 16h16l4-2.5H22z" fill={LIGHT} />
      <path d="M34 16l4-2.5v10L34 26z" fill={DEPTH} />
      <path d="M18 16h16v10H18z" fill="#fff" />
      <path d="M26 26l4 4 2-2-4-4z" fill={DEPTH} />
      <path d="M30 30l8 16" strokeWidth={2.2} />
      {/* nail */}
      <path d="M48 28v16M45 28h6" strokeWidth={1.4} />
      <Sparkle x={50} y={14} />
    </Doodle>
  );
}

export function CleaningPestControlIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={30} cy={54} rx={14} />
      {/* spray bottle */}
      <path d="M24 28h14l5-3H29z" fill={LIGHT} />
      <path d="M38 28l5-3v18l-5 3z" fill={DEPTH} />
      <path d="M24 28h14v18H24z" fill="#fff" />
      <path d="M28 28v-6h6c2 0 3 1 3 3" />
      <path d="M37 22h8" strokeWidth={1.4} />
      <path d="M45 20v4" strokeWidth={1.3} />
      <path d="M28 36h6" strokeWidth={1.2} opacity={0.6} />
      <Sparkle x={14} y={14} />
    </Doodle>
  );
}

export function LegalDocumentationIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={16} />
      {/* scales */}
      <path d="M32 14v28" strokeWidth={1.6} />
      <path d="M18 20h28" strokeWidth={1.5} />
      <path d="M18 20l-6 12h12z" fill="#fff" />
      <path d="M46 20l-6 12h12z" fill="#fff" />
      <path d="M40 32l6-3v2l-6 3z" fill={DEPTH} stroke="none" />
      <path d="M28 42h8l3-2H31z" fill={LIGHT} />
      <path d="M36 42l3-2v6l-3 2z" fill={DEPTH} />
      <path d="M28 42h8v6H28z" fill="#fff" />
      <Sparkle x={52} y={12} />
    </Doodle>
  );
}

export function PackersMoversIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={16} />
      {/* box */}
      <path d="M16 26h24l10-6H26z" fill={LIGHT} />
      <path d="M40 26l10-6v20l-10 6z" fill={DEPTH} />
      <path d="M16 26h24v20H16z" fill="#fff" />
      <path d="M28 26v20" strokeWidth={1.3} />
      <path d="M16 26l12-4 12 4" />
      <path d="M40 26l5-8" strokeWidth={1.2} opacity={0.5} />
      <Sparkle x={54} y={14} />
    </Doodle>
  );
}

export function OtherServicesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={16} />
      <path d="M18 28h24l8-5H26z" fill={LIGHT} />
      <path d="M42 28l8-5v18l-8 5z" fill={DEPTH} />
      <path d="M18 28h24v18H18z" fill="#fff" />
      <path d="M28 28v-6c0-3 8-3 8 0v6" strokeWidth={1.5} />
      <path d="M18 34h24" strokeWidth={1.2} />
      <path d="M28 34v4h4v-4" fill="#fff" strokeWidth={1.2} />
      <Sparkle x={14} y={14} />
    </Doodle>
  );
}

/** Fallback when a subcategory name has no dedicated icon */
export function SubcategoryFallbackIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <Shadow cx={32} cy={54} rx={14} />
      <path d="M20 18h20l6-3.5H26z" fill={LIGHT} />
      <path d="M40 18l6-3.5v24L40 42z" fill={DEPTH} />
      <path d="M20 18h20v24H20z" fill="#fff" />
      <path d="M26 28h8M26 34h8" strokeWidth={1.3} />
      <Sparkle x={52} y={12} />
    </Doodle>
  );
}

export type { CategoryIconComponent };
