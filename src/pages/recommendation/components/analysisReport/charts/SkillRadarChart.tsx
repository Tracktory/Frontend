import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Polygon, Text as SvgText } from 'react-native-svg';

import type { SkillRadarPoint } from '../../../data/analysisReportStaticMock';

interface SkillRadarChartProps {
  data: SkillRadarPoint[];
  size?: number;
}

export function SkillRadarChart({ data, size = 200 }: SkillRadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.36;
  const levels = 4;
  const n = data.length;

  const angleAt = (i: number) => (-Math.PI / 2) + (2 * Math.PI * i) / n;

  const pointAt = (i: number, ratio: number) => {
    const a = angleAt(i);
    return {
      x: cx + maxR * ratio * Math.cos(a),
      y: cy + maxR * ratio * Math.sin(a),
    };
  };

  const gridPolygons = Array.from({ length: levels }, (_, li) => {
    const ratio = (li + 1) / levels;
    const pts = data
      .map((_, i) => {
        const p = pointAt(i, ratio);
        return `${p.x},${p.y}`;
      })
      .join(' ');
    return pts;
  });

  const dataPolygon = data
    .map((d, i) => {
      const p = pointAt(i, d.value / 100);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size}>
        {gridPolygons.map((pts, idx) => (
          <Polygon
            key={`grid-${idx}`}
            points={pts}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={1}
          />
        ))}
        {data.map((_, i) => {
          const outer = pointAt(i, 1);
          return (
            <Line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="#E5E7EB"
              strokeWidth={1}
            />
          );
        })}
        <Polygon
          points={dataPolygon}
          fill="#14B8A6"
          fillOpacity={0.25}
          stroke="#14B8A6"
          strokeWidth={2}
        />
        {data.map((d, i) => {
          const labelPos = pointAt(i, 1.22);
          return (
            <SvgText
              key={d.subject}
              x={labelPos.x}
              y={labelPos.y}
              fill="#6B7280"
              fontSize={10}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {d.subject.length > 5 ? d.subject.slice(0, 5) : d.subject}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
});
