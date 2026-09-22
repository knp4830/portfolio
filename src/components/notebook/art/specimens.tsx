import type { CSSProperties } from "react";

type ArtProps = { className?: string; style?: CSSProperties };

// PNW specimens and the colophon's figure, extracted from design/html (rev 8).
// Decorative: always aria-hidden; the page names each specimen in text.

/** Sword fern (Polystichum munitum), opening spread. Salal line work, 160×230. */
export function SwordFern({ className, style }: ArtProps) {
  return (
    <svg width={160} height={230} viewBox="0 0 210 300" fill="none" aria-hidden className={className} style={{stroke: "var(--salal)", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", ...style}}>
      <path d="M70 296Q40 150 150 14" />
      <path d="M65.4 266.9Q84.4 262.4 99.1 244.1Q77.5 252.1 65.4 266.9" />
      <path d="M64.5 256.9Q48.1 240.8 20.9 237.7Q42.2 254.2 64.5 256.9" />
      <path d="M63.9 247.0Q89.6 242.7 110.7 219.7Q81.2 228.3 63.9 247.0" />
      <path d="M63.6 237.1Q44.5 215.7 10.8 209.4Q36.1 231.8 63.6 237.1" />
      <path d="M63.6 227.2Q91.4 224.4 115.5 201.4Q83.5 208.5 63.6 227.2" />
      <path d="M64.0 217.3Q47.5 195.9 16.1 187.9Q38.5 210.6 64.0 217.3" />
      <path d="M64.8 207.5Q91.0 206.6 115.1 186.5Q84.6 191.2 64.8 207.5" />
      <path d="M65.8 197.6Q51.6 176.6 22.7 167.1Q42.3 189.8 65.8 197.6" />
      <path d="M67.2 187.8Q91.7 188.7 115.5 171.5Q86.7 173.9 67.2 187.8" />
      <path d="M68.9 178.1Q57.0 157.6 30.7 147.0Q47.5 169.3 68.9 178.1" />
      <path d="M71.0 168.3Q93.7 170.6 116.8 156.1Q89.9 156.6 71.0 168.3" />
      <path d="M73.3 158.6Q63.6 138.9 40.0 127.5Q54.1 149.2 73.3 158.6" />
      <path d="M76.0 148.9Q96.8 152.4 118.9 140.4Q94.2 139.2 76.0 148.9" />
      <path d="M79.1 139.2Q71.3 120.7 50.4 108.9Q62.1 129.5 79.1 139.2" />
      <path d="M82.5 129.6Q101.1 133.9 121.9 124.3Q99.5 121.8 82.5 129.6" />
      <path d="M86.2 119.9Q80.2 102.8 62.0 90.9Q71.3 110.2 86.2 119.9" />
      <path d="M90.2 110.3Q106.6 115.2 125.8 107.8Q105.9 104.3 90.2 110.3" />
      <path d="M94.6 100.7Q90.2 85.2 74.7 73.8Q81.9 91.3 94.6 100.7" />
      <path d="M99.3 91.2Q113.4 96.3 130.6 90.7Q113.3 86.7 99.3 91.2" />
      <path d="M104.3 81.6Q101.3 68.0 88.4 57.3Q93.8 72.9 104.3 81.6" />
      <path d="M109.7 72.1Q121.4 77.1 136.2 73.2Q121.8 69.0 109.7 72.1" />
      <path d="M115.3 62.6Q113.5 51.2 103.3 41.8Q107.1 54.9 115.3 62.6" />
      <path d="M121.4 53.2Q130.6 57.7 142.7 55.2Q131.2 51.2 121.4 53.2" />
      <path d="M127.7 43.7Q126.7 34.8 119.3 27.2Q121.7 37.4 127.7 43.7" />
      <path d="M134.4 34.3Q140.9 37.9 149.6 36.5Q141.6 33.2 134.4 34.3" />
      <path d="M141.4 24.9Q141.1 19.3 136.6 14.2Q137.8 20.7 141.4 24.9" />
      <path d="M82 296Q150 200 196 110" />
      <path d="M95.4 276.9Q107.1 282.9 122.5 280.0Q108.0 274.6 95.4 276.9" />
      <path d="M102.9 265.9Q100.8 249.5 86.8 235.5Q91.5 254.4 102.9 265.9" />
      <path d="M110.2 255.1Q126.9 263.4 148.8 258.9Q128.1 251.5 110.2 255.1" />
      <path d="M117.4 244.2Q114.9 226.6 99.6 211.7Q104.9 232.0 117.4 244.2" />
      <path d="M124.4 233.4Q139.7 240.7 159.5 236.4Q140.6 230.0 124.4 233.4" />
      <path d="M131.3 222.7Q128.8 206.8 114.8 193.6Q119.9 211.8 131.3 222.7" />
      <path d="M138.0 211.9Q151.8 218.3 169.5 214.1Q152.5 208.6 138.0 211.9" />
      <path d="M144.7 201.3Q142.2 187.2 129.6 175.8Q134.4 191.8 144.7 201.3" />
      <path d="M151.1 190.6Q163.3 195.9 178.6 192.0Q163.7 187.5 151.1 190.6" />
      <path d="M157.4 180.0Q155.1 168.0 144.1 158.3Q148.5 172.0 157.4 180.0" />
      <path d="M163.6 169.4Q173.9 173.8 186.9 170.3Q174.2 166.6 163.6 169.4" />
      <path d="M169.6 158.9Q167.6 149.0 158.4 141.2Q162.2 152.5 169.6 158.9" />
      <path d="M175.5 148.4Q183.8 151.7 194.0 148.7Q183.9 146.1 175.5 148.4" />
      <path d="M181.2 138.0Q179.6 130.6 172.5 124.8Q175.5 133.2 181.2 138.0" />
      <path d="M186.8 127.6Q192.6 129.8 199.7 127.6Q192.6 125.8 186.8 127.6" />
      <path d="M192.3 117.2Q191.2 112.9 187.1 109.6Q188.9 114.5 192.3 117.2" />
      <path d="M66 296Q48 280 47.8 264.9 L47.8 264.9 45.1 265.5 42.3 265.5 39.6 265.1 37.1 264.2 34.8 262.9 32.8 261.2 31.2 259.3 30.0 257.1 29.1 254.8 28.7 252.5 28.8 250.1 29.2 247.8 30.0 245.7 31.1 243.8 32.6 242.2 34.3 240.8 36.1 239.8 38.1 239.2 40.1 238.9 42.0 239.0 43.9 239.4 45.6 240.1 47.2 241.2 48.5 242.4 49.5 243.8 50.3 245.3 50.7 246.9 50.9 248.5 50.7 250.1 50.3 251.6 49.7 252.9 48.9 254.1 47.8 255.1 46.7 255.8 45.5 256.3 44.3 256.6 43.0 256.7 41.8 256.5 40.8 256.1 39.8 255.6 39.0 254.9 38.3 254.1 37.9 253.3 37.6 252.4 37.5 251.5 37.5 250.6 37.8 249.9 38.1 249.2 38.5 248.6 39.0 248.1 39.6 247.8 40.2 247.6 40.7 247.6 41.2 247.6 41.7 247.8 42.1 248.0 42.4 248.3 42.6 248.6 42.7 248.9" />
    </svg>
  );
}

/** Beaver (Castor canadensis), skills page. Walnut line work, front-facing, 130×154. */
export function Beaver({ className, style }: ArtProps) {
  return (
    <svg width={130} height={154} viewBox="0 0 200 236" fill="none" aria-hidden className={className} style={{stroke: "var(--walnut)", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round", ...style}}>
      <path d="M100 22C76 22 60 38 62 60C46 78 36 110 38 140C40 176 62 194 100 194C138 194 160 176 162 140C164 110 154 78 138 60C140 38 124 22 100 22Z" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M66 44q-6 -8 2 -12q7 1 6 9" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M134 44q6 -8 -2 -12q-7 1 -6 9" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M92 64Q100 57 108 64Q107 73 100 74Q93 73 92 64Z" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M100 74L100 82M86 80q14 10 28 0" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M96 84h8v10h-8Z" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M100 84v10" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M70 100C74 116 82 124 92 124" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M130 100C126 116 118 124 108 124" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M88 120q4 -8 12 -2q8 -6 12 2q-2 8 -12 8q-10 0 -12 -8Z" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M92 118v6M100 118v8M108 118v6" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M50 182q-12 10 -4 14h24" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M150 182q12 10 4 14h-24" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M42 194l-4 6M50 196l-2 6M58 196l0 6M142 196l2 6M150 196l2 6M158 194l4 6" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M88 192C87 200 76 206 75 216C74 228 90 230 100 230C110 230 126 228 125 216C124 206 113 200 112 192" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M92 196Q100 200 108 196" style={{strokeWidth: "1.4", opacity: "1"}} />
      <path d="M80 210l4 9" style={{strokeWidth: "0.9", opacity: "0.6"}} />
      <path d="M87 211l4 9" style={{strokeWidth: "0.9", opacity: "0.6"}} />
      <path d="M94 210l4 9" style={{strokeWidth: "0.9", opacity: "0.6"}} />
      <path d="M101 211l4 9" style={{strokeWidth: "0.9", opacity: "0.6"}} />
      <path d="M108 210l4 9" style={{strokeWidth: "0.9", opacity: "0.6"}} />
      <path d="M115 211l4 9" style={{strokeWidth: "0.9", opacity: "0.6"}} />
      <path d="M80 224l6 -8" style={{strokeWidth: "0.9", opacity: "0.5"}} />
      <path d="M88 224l6 -8" style={{strokeWidth: "0.9", opacity: "0.5"}} />
      <path d="M96 224l6 -8" style={{strokeWidth: "0.9", opacity: "0.5"}} />
      <path d="M104 224l6 -8" style={{strokeWidth: "0.9", opacity: "0.5"}} />
      <path d="M112 224l6 -8" style={{strokeWidth: "0.9", opacity: "0.5"}} />
      <path d="M86 206Q100 210 114 206" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M80 218Q100 222 120 218" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M59.7 178.8q1.4 4.6 -0.2 9.2" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M63.1 150.1q0.3 3.0 -2.4 6.1" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M52.9 118.9q0.9 4.0 -1.2 8.0" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M61.9 174.1q1.5 3.3 -0.0 6.7" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M64.1 142.6q0.8 5.1 -1.4 10.2" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M55.1 149.3q1.1 5.4 -0.8 10.7" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M66.7 152.2q0.9 4.5 -1.1 8.9" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M52.7 168.3q0.7 4.4 -1.5 8.8" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M65.4 122.2q1.4 2.9 -0.1 5.7" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M65.9 130.6q1.3 5.2 -0.5 10.5" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M49.0 123.8q0.4 3.3 -2.3 6.6" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M51.0 169.4q1.4 4.8 -0.2 9.5" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M66.2 159.1q0.2 5.1 -2.7 10.2" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M62.7 116.3q1.4 3.1 -0.3 6.2" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M49.6 134.9q1.5 5.1 0.1 10.3" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M48.0 138.5q1.3 3.4 -0.4 6.7" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M65.0 141.8q1.2 3.8 -0.6 7.7" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M50.2 165.6q0.4 3.0 -2.1 6.0" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M54.1 149.9q0.2 5.2 -2.6 10.4" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M61.1 173.4q1.3 2.7 -0.5 5.4" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M58.6 116.7q1.4 3.9 -0.3 7.7" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M58.9 165.4q0.9 3.8 -1.2 7.6" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M52.5 128.7q1.5 2.9 -0.0 5.9" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M64.8 157.9q0.9 4.8 -1.1 9.7" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M47.9 139.0q0.4 2.7 -2.1 5.3" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M62.5 141.6q1.0 4.2 -1.1 8.4" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M134.9 145.7q3.1 4.8 3.2 9.5" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M150.5 141.1q1.5 2.9 0.0 5.8" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M133.1 129.5q2.8 3.5 2.7 7.0" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M139.7 114.3q1.8 3.1 0.5 6.2" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M142.3 153.3q2.4 5.1 1.8 10.2" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M133.1 121.1q2.5 4.6 2.1 9.2" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M147.2 152.9q2.0 4.6 0.9 9.3" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M138.9 145.6q2.4 3.1 1.8 6.3" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M139.9 175.3q3.0 4.9 3.0 9.7" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M144.0 133.5q2.4 3.9 1.8 7.9" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M149.7 143.8q1.5 3.0 0.0 6.0" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M138.6 132.1q2.2 5.1 1.4 10.1" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M142.3 143.5q2.9 3.9 2.8 7.8" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M145.5 141.3q2.4 5.1 1.8 10.2" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M135.4 152.2q1.8 2.9 0.7 5.9" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M137.6 132.0q2.2 5.2 1.4 10.5" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M150.4 149.9q1.9 3.1 0.8 6.2" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M140.6 179.6q1.4 3.0 -0.2 6.1" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M138.7 102.5q2.7 4.2 2.4 8.3" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M149.0 146.5q1.9 4.3 0.9 8.5" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M142.5 128.4q2.7 4.9 2.4 9.8" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M135.0 126.5q2.6 5.2 2.3 10.5" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M140.5 137.6q1.7 3.6 0.4 7.2" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M136.9 147.5q2.2 3.5 1.4 7.0" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M150.1 156.8q3.1 4.5 3.2 9.1" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M152.5 145.6q1.7 4.0 0.4 8.1" style={{strokeWidth: "0.8", opacity: "0.5"}} />
      <path d="M82.3 154.3q1.4 2.5 -0.2 5.1" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M110.5 143.2q1.3 2.4 -0.3 4.9" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M83.0 158.5q1.9 4.1 0.9 8.2" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M106.3 159.9q1.0 3.3 -1.0 6.7" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M88.3 167.2q1.3 3.1 -0.4 6.1" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M90.4 145.0q2.1 3.7 1.1 7.3" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M129.3 157.8q1.4 2.2 -0.2 4.4" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M111.0 160.2q1.0 2.7 -1.0 5.4" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M81.1 174.1q1.8 3.2 0.5 6.5" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M93.0 162.0q1.4 3.9 -0.3 7.7" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M107.9 167.9q1.6 2.2 0.2 4.4" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M72.9 160.4q1.3 3.2 -0.4 6.4" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M107.1 153.9q1.4 2.9 -0.2 5.8" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M91.9 156.0q1.2 2.3 -0.5 4.6" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M113.5 175.5q0.9 3.0 -1.1 5.9" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M87.3 165.1q1.8 3.4 0.6 6.8" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M104.5 166.2q1.5 2.4 0.1 4.9" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M83.8 145.4q1.1 3.1 -0.7 6.2" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M88.6 170.8q2.2 3.5 1.5 7.0" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M91.7 169.9q2.0 3.0 1.1 6.0" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M83.7 153.8q1.0 3.5 -1.1 6.9" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M101.2 174.5q1.0 3.1 -1.1 6.3" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M94.0 157.0q1.5 3.1 0.0 6.1" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M84.2 167.6q1.4 3.2 -0.2 6.5" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M87.8 160.5q1.6 4.1 0.2 8.3" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M95.1 161.9q2.2 3.2 1.3 6.3" style={{strokeWidth: "0.8", opacity: "0.4"}} />
      <path d="M81.4 42.2q1.9 2.6 0.9 5.2" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M80.1 39.6q2.8 2.4 2.5 4.8" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M84.1 33.5q2.7 2.0 2.3 4.1" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M119.7 44.9q2.0 1.8 1.0 3.6" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M125.4 38.9q2.3 2.8 1.6 5.6" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M101.7 41.0q2.1 1.8 1.3 3.6" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M104.7 44.6q2.9 2.3 2.7 4.5" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M77.8 43.4q2.5 2.8 2.0 5.6" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M78.8 40.0q2.3 2.1 1.7 4.3" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M125.9 39.8q2.1 3.0 1.3 6.0" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M95.0 44.4q2.3 1.7 1.6 3.5" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M101.6 33.7q2.0 2.4 1.0 4.9" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M123.1 37.6q2.7 1.8 2.3 3.7" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M115.0 36.3q1.9 2.5 0.7 5.0" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M118.5 43.5q2.0 2.2 1.1 4.4" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <path d="M112.8 43.0q2.0 3.1 1.0 6.3" style={{strokeWidth: "0.8", opacity: "0.45"}} />
      <circle cx="86" cy="50" r="2.6" style={{fill: "var(--walnut)", stroke: "none"}} />
      <circle cx="114" cy="50" r="2.6" style={{fill: "var(--walnut)", stroke: "none"}} />
    </svg>
  );
}

/** Licorice fern (Polypodium glycyrrhiza), projects grid. Salal line work, 220×172. */
export function LicoriceFern({ className, style }: ArtProps) {
  return (
    <svg width={220} height={172} viewBox="0 0 260 190" fill="none" aria-hidden className={className} style={{stroke: "var(--salal)", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", ...style}}>
      <path d="M4 168Q70 156 130 164T256 158" />
      <path d="M4 184Q80 176 140 182T256 176" />
      <path d="M30 172q6 -4 12 0M90 170q5 -3 10 0M160 172q6 -4 12 0M210 166q5 -3 10 0" />
      <path d="M60 164Q60 90 150 30" />
      <path d="M60.9 149.3Q72.6 155.7 85.4 147.2Q71.4 142.5 60.9 149.3" />
      <path d="M62.0 142.0Q53.1 128.1 34.0 129.8Q46.5 143.3 62.0 142.0" />
      <path d="M63.6 134.8Q79.5 146.2 99.7 136.1Q80.2 126.7 63.6 134.8" />
      <path d="M65.7 127.6Q57.4 110.4 35.4 109.6Q47.7 126.8 65.7 127.6" />
      <path d="M68.2 120.5Q81.9 133.2 102.2 126.0Q84.8 114.8 68.2 120.5" />
      <path d="M71.2 113.5Q65.4 96.3 44.6 93.1Q54.3 110.7 71.2 113.5" />
      <path d="M74.7 106.6Q86.1 120.0 106.1 115.4Q90.9 103.0 74.7 106.6" />
      <path d="M78.6 99.7Q74.9 82.9 55.7 77.7Q63.0 95.3 78.6 99.7" />
      <path d="M82.9 92.9Q92.3 106.6 111.4 104.3Q98.5 91.2 82.9 92.9" />
      <path d="M87.8 86.1Q85.9 70.2 68.7 63.5Q73.7 80.5 87.8 86.1" />
      <path d="M93.0 79.5Q100.4 92.9 118.2 92.6Q107.5 79.3 93.0 79.5" />
      <path d="M98.8 72.9Q98.5 58.2 83.2 50.6Q86.4 66.6 98.8 72.9" />
      <path d="M105.0 66.4Q110.6 79.1 126.8 80.2Q118.1 67.4 105.0 66.4" />
      <path d="M111.7 59.9Q112.5 46.8 99.4 38.9Q101.1 53.4 111.7 59.9" />
      <path d="M118.8 53.5Q122.8 65.0 136.8 67.1Q130.2 55.3 118.8 53.5" />
      <path d="M126.4 47.2Q127.9 36.2 117.4 28.8Q117.9 41.1 126.4 47.2" />
      <path d="M134.4 41.0Q137.0 50.4 148.1 52.8Q143.4 43.0 134.4 41.0" />
      <path d="M142.9 34.8Q144.5 27.2 137.5 21.5Q137.3 30.1 142.9 34.8" />
      <path d="M120 164Q150 110 236 72" />
      <path d="M126.6 153.4Q133.0 162.8 146.1 161.2Q137.3 152.2 126.6 153.4" />
      <path d="M131.5 146.5Q129.9 131.7 113.9 125.4Q118.5 141.2 131.5 146.5" />
      <path d="M137.0 139.8Q144.6 154.2 163.5 154.1Q152.4 139.8 137.0 139.8" />
      <path d="M142.9 133.2Q142.9 117.3 126.6 108.8Q129.7 126.1 142.9 133.2" />
      <path d="M149.3 126.7Q155.1 140.9 172.8 142.6Q163.7 128.2 149.3 126.7" />
      <path d="M156.2 120.4Q157.6 105.7 143.3 96.4Q144.6 112.7 156.2 120.4" />
      <path d="M163.6 114.3Q167.8 127.9 184.0 130.9Q176.8 116.9 163.6 114.3" />
      <path d="M171.5 108.3Q173.9 94.9 161.5 85.2Q161.5 100.3 171.5 108.3" />
      <path d="M179.9 102.4Q182.7 115.0 197.2 118.8Q191.6 105.7 179.9 102.4" />
      <path d="M188.8 96.6Q191.8 84.9 181.4 75.5Q180.4 88.9 188.8 96.6" />
      <path d="M198.2 91.0Q199.8 102.1 212.1 106.4Q208.2 94.6 198.2 91.0" />
      <path d="M208.0 85.6Q211.2 75.9 203.0 67.4Q201.4 78.6 208.0 85.6" />
      <path d="M218.4 80.2Q219.2 89.1 228.6 93.1Q226.1 83.5 218.4 80.2" />
      <path d="M229.2 75.1Q231.7 68.7 226.5 62.6Q225.0 70.1 229.2 75.1" />
      <path d="M40 166Q18 120 30 60" />
      <path d="M35.9 156.7Q44.9 156.7 49.7 147.5Q39.9 149.2 35.9 156.7" />
      <path d="M32.7 147.5Q21.8 141.5 9.8 149.4Q22.8 153.8 32.7 147.5" />
      <path d="M30.1 138.0Q42.1 139.7 50.3 128.2Q36.8 128.8 30.1 138.0" />
      <path d="M28.1 128.3Q18.8 121.4 6.7 127.2Q18.2 133.0 28.1 128.3" />
      <path d="M26.7 118.4Q37.3 121.3 46.0 112.0Q33.8 110.9 26.7 118.4" />
      <path d="M25.9 108.2Q18.5 101.0 7.1 104.8Q16.6 111.2 25.9 108.2" />
      <path d="M25.8 97.7Q34.7 101.4 43.2 94.2Q32.8 91.9 25.8 97.7" />
      <path d="M26.3 87.0Q20.7 80.3 10.8 82.3Q18.2 88.6 26.3 87.0" />
      <path d="M27.4 76.0Q34.0 79.6 41.3 74.8Q33.3 72.1 27.4 76.0" />
      <path d="M29.1 64.8Q26.0 60.0 19.4 60.7Q23.8 65.3 29.1 64.8" />
    </svg>
  );
}

/** Banana slug (Ariolimax columbianus), back cover. Salal line work, 300×104. */
export function BananaSlug({ className, style }: ArtProps) {
  return (
    <svg width={300} height={104} viewBox="0 0 290 100" fill="none" aria-hidden className={className} style={{stroke: "var(--salal)", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", ...style}}>
      <path d="M10 84C40 76 80 50 140 44C175 40 215 38 240 50C258 58 270 70 266 84C262 90 250 90 240 90L40 90C26 90 16 88 10 84Z" />
      <path d="M150 49C170 35 222 34 242 52" />
      <path d="M150 49C168 62 214 64 246 60" />
      <path d="M10 84C40 74 70 60 104 56" />
      <path d="M254 56Q262 40 272 28" />
      <path d="M262 60Q272 48 282 40" />
      <path d="M266 80Q272 84 278 84" />
      <path d="M44 86L238 86" />
      <circle cx="272.5" cy="27" r="2.6" />
      <circle cx="282.5" cy="39" r="2.4" />
      <circle cx="170" cy="56" r="3" />
      <ellipse cx="72" cy="75" rx="3" ry="1.6" />
      <ellipse cx="104" cy="66" rx="3.4" ry="1.8" />
      <ellipse cx="128" cy="58" rx="2.4" ry="1.4" />
      <ellipse cx="206" cy="47" rx="3" ry="1.6" />
      <ellipse cx="190" cy="72" rx="2.6" ry="1.5" />
    </svg>
  );
}

/** Fig. 1 — the fold: page, spine, C, P, Q and the fold line. 518×252; labels are set in HTML over it. */
export function FoldFigure({ className, style }: ArtProps) {
  return (
    <svg width={518} height={252} viewBox="0 0 518 252" fill="none" aria-hidden className={className} style={style}>
      <path d="M250.0 22.3Q260.0 22.0 265.0 22.0Q270.0 21.9 275.0 21.9Q280.0 21.8 285.0 21.7Q290.0 21.6 295.0 21.6Q300.0 21.7 305.0 21.7Q310.0 21.7 315.0 21.8Q320.0 21.8 325.0 21.7Q330.0 21.6 335.0 21.7Q340.0 21.8 345.0 21.8Q350.0 21.8 355.0 22.0Q360.0 22.2 365.0 22.3Q370.0 22.3 375.0 22.2Q380.0 22.1 385.0 22.3Q390.0 22.6 395.0 22.6Q400.0 22.6 405.0 22.5Q410.0 22.4 415.0 22.4L420.0 22.3M419.8 22.0Q420.2 32.0 420.3 37.0Q420.4 42.0 420.3 47.0Q420.3 52.0 420.4 57.0Q420.4 62.0 420.3 67.0Q420.2 72.0 420.2 77.0Q420.3 82.0 420.3 87.0Q420.2 92.0 420.2 97.0Q420.2 102.0 420.1 107.0Q420.0 112.0 420.1 117.0Q420.1 122.0 420.0 127.0Q419.9 132.0 419.9 137.0Q419.9 142.0 419.7 147.0Q419.5 152.0 419.7 157.0Q419.9 162.0 419.7 167.0Q419.5 172.0 419.7 177.0Q419.9 182.0 419.8 187.0Q419.7 192.0 419.8 197.0L420.0 202.0M420.0 201.6Q410.0 201.5 405.0 201.7Q400.0 201.9 395.0 201.9Q390.0 202.0 385.0 202.0Q380.0 202.1 375.0 202.2Q370.0 202.2 365.0 202.2Q360.0 202.1 355.0 202.3Q350.0 202.5 345.0 202.4Q340.0 202.3 335.0 202.4Q330.0 202.5 325.0 202.4Q320.0 202.4 315.0 202.3Q310.0 202.2 305.0 202.1Q300.0 201.9 295.0 201.9Q290.0 201.9 285.0 202.0Q280.0 202.0 275.0 201.9Q270.0 201.8 265.0 201.8Q260.0 201.8 255.0 201.7L250.0 201.5" style={{stroke: "var(--salal)", strokeWidth: "1.3", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
      <path d="M250 22H80V202H250" style={{stroke: "var(--salal)", strokeWidth: "1.1", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "3, 5"}} />
      <polygon points="420,127.7 346,134 351.8,202" style={{fill: "var(--paper-back)", stroke: "var(--salal)", strokeWidth: "1.2"}} />
      <path d="M420 202L80 202" style={{stroke: "var(--huckleberry)", strokeWidth: "1.2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "2, 5"}} />
      <path d="M416.0 198.0Q410.6 189.6 408.1 185.3Q405.6 180.9 402.5 177.2Q399.4 173.4 396.1 170.0Q392.7 166.6 389.0 163.5Q385.3 160.4 381.8 157.1Q378.2 153.9 374.2 151.2Q370.1 148.6 365.7 146.4Q361.2 144.2 356.6 142.1L352.0 140.0 M352.0 140.3Q354.0 140.3 355.0 139.9Q356.0 139.4 357.0 139.3Q358.0 139.2 359.0 139.5L360.0 139.8 M351.8 140.2Q353.1 141.7 353.8 142.4Q354.5 143.1 355.2 143.8Q355.9 144.6 356.6 145.3L357.3 146.0" style={{stroke: "var(--huckleberry)", strokeWidth: "1.4", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
      <path d="M288.2 271.0Q297.7 260.1 302.8 255.0Q307.9 249.9 312.8 244.6Q317.7 239.3 322.7 234.1Q327.7 228.9 332.5 223.5Q337.3 218.1 342.2 212.8Q347.2 207.5 352.1 202.2Q357.0 196.9 361.8 191.5Q366.5 186.1 371.4 180.7Q376.3 175.4 381.0 169.9Q385.7 164.4 390.5 159.0Q395.3 153.7 400.3 148.5Q405.3 143.2 410.1 137.8Q414.9 132.4 419.8 127.1Q424.7 121.8 429.7 116.6Q434.7 111.4 439.5 106.0Q444.4 100.7 449.3 95.3Q454.2 90.0 459.3 85.0L464.5 79.9" style={{stroke: "var(--huckleberry)", strokeWidth: "1.6", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
      <path d="M388.4 162.1L382.5 156.7L377.1 162.6" style={{stroke: "var(--huckleberry)", strokeWidth: "1", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
      <circle cx="420" cy="202" r="3.5" style={{fill: "var(--huckleberry)"}} />
      <circle cx="346" cy="134" r="3.5" style={{fill: "var(--huckleberry)"}} />
      <circle cx="80" cy="202" r="3.5" style={{fill: "var(--huckleberry)"}} />
      <path d="M250 12L250 212" style={{stroke: "var(--ink-soft)", strokeWidth: "1", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
      <path d="M436.0 22.0Q435.8 34.0 435.9 40.0Q435.9 46.0 435.9 52.0Q435.9 58.0 435.8 64.0Q435.8 70.0 435.6 76.0Q435.4 82.0 435.6 88.0Q435.8 94.0 435.6 100.0Q435.5 106.0 435.5 112.0Q435.6 118.0 435.8 124.0Q436.0 130.0 435.9 136.0Q435.9 142.0 435.9 148.0Q436.0 154.0 436.1 160.0Q436.2 166.0 436.1 172.0Q436.0 178.0 436.2 184.0Q436.5 190.0 436.6 196.0L436.6 202.0 M431 22H441 M431 202H441" style={{stroke: "var(--ink-soft)", strokeWidth: "1.1", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
      <path d="M250.0 218.1Q262.1 218.5 268.2 218.4Q274.3 218.4 280.4 218.5Q286.4 218.5 292.5 218.4Q298.6 218.2 304.6 218.3Q310.7 218.4 316.8 218.4Q322.9 218.5 328.9 218.3Q335.0 218.2 341.1 218.2Q347.1 218.3 353.2 218.2Q359.3 218.1 365.4 217.9Q371.4 217.7 377.5 217.5Q383.6 217.4 389.6 217.6Q395.7 217.7 401.8 217.6Q407.9 217.4 413.9 217.4L420.0 217.3 M250 213V223 M420 213V223" style={{stroke: "var(--ink-soft)", strokeWidth: "1.1", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
    </svg>
  );
}
