import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type Segment = {value: number; color: string};

type Props = {
	segments: Segment[];
	radius?: number;
	strokeWidth?: number;
	startAngle?: number;
	gapDegrees?: number;
	trackColor?: string;
	centerComponent?: React.ReactNode;
	roundedCaps?: boolean;
};

const DonutChart: React.FC<Props> = ({
	segments,
	radius = 90,
	strokeWidth = 26,
	startAngle = -90,
	gapDegrees = 4,
	trackColor = 'transparent',
	centerComponent,
	roundedCaps = false,
}) => {
	// total SVG size, add strokeWidth so the stroke won't get clipped
	const size = radius * 2 + strokeWidth;
	const cx = size / 2;
	const cy = size / 2;

	// total sum of all values, fallback to a tiny number to avoid divide-by-zero
	const total = Math.max(
		0.00001,
		segments.reduce((s, seg) => s + Math.max(0, seg.value), 0),
	);

	// convert degrees to radians
	const toRad = (deg: number) => (Math.PI / 180) * deg;

	// get x/y coordinates on the circle from an angle
	const polar = (angleDeg: number, r = radius) => {
		const a = toRad(angleDeg);
		return {x: cx + r * Math.cos(a), y: cy + r * Math.sin(a)};
	};

	// create an arc path between two angles
	const arcPath = (a0: number, a1: number) => {
		const largeArc = a1 - a0 > 180 ? 1 : 0; // flag for arcs > 180°
		const p0 = polar(a0);
		const p1 = polar(a1);

		// M = move to start, A = arc to end
		return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${largeArc} 1 ${p1.x} ${p1.y}`;
	};

	let cursor = startAngle;

	return (
		<View
			style={{
				width: size,
				height: size,
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<Svg width={size} height={size}>
				{/* background track (optional) */}
				{trackColor !== 'transparent' && (
					<Circle
						cx={cx}
						cy={cy}
						r={radius}
						stroke={trackColor}
						strokeWidth={strokeWidth}
						fill="none"
					/>
				)}

				{/* slices */}
				{segments.map((seg, i) => {
					const sweepFull = (seg.value / total) * 360;
					const halfGap = gapDegrees / 2;

					// shrink sweep angle a bit to leave a gap
					const sweep = Math.max(0.0001, sweepFull - gapDegrees);
					const a0 = cursor + halfGap;
					const a1 = a0 + sweep;

					// move cursor forward for the next slice
					cursor += sweepFull;

					return (
						<Path
							key={i}
							d={arcPath(a0, a1)}
							stroke={seg.color}
							strokeWidth={strokeWidth}
							strokeLinecap={roundedCaps ? 'round' : 'butt'}
							fill="none"
						/>
					);
				})}
			</Svg>

			{/* center content (any custom component) */}
			{centerComponent ? (
				<View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
					<View style={styles.center}>{centerComponent}</View>
				</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	center: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default DonutChart;
