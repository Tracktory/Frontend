import type { JobRecommendation } from '../data/mockRecommendData';
import type { TrackRecommendPayload } from '../data/mockTrackRecommendData';
import type { RoadmapPayload } from '../data/mockRoadmapData';

const BRAND_COLOR = '#14B8A6';
const BRAND_LIGHT = '#CCFBF1';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(): string {
  const now = new Date();
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
}

function buildJobSection(jobs: JobRecommendation[]): string {
  if (jobs.length === 0) {
    return '<p style="color:#9ca3af;">직무 추천 데이터가 없습니다.</p>';
  }
  const rows = jobs
    .map(
      (job) => `
      <tr>
        <td style="padding:10px 12px; border-bottom:1px solid #e5e7eb; font-weight:600; color:#111827;">${escapeHtml(job.title)}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #e5e7eb; color:#374151;">${escapeHtml(job.description)}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #e5e7eb; text-align:center;">
          <span style="
            display:inline-block;
            padding:3px 10px;
            border-radius:999px;
            background:${BRAND_LIGHT};
            color:${BRAND_COLOR};
            font-weight:700;
            font-size:13px;
          ">${job.matchScore}%</span>
        </td>
        <td style="padding:10px 12px; border-bottom:1px solid #e5e7eb; color:#6b7280; font-size:13px;">
          ${job.techStack.length > 0 ? job.techStack.map(escapeHtml).join(', ') : '–'}
        </td>
      </tr>`,
    )
    .join('');

  return `
    <table style="width:100%; border-collapse:collapse; margin-top:12px;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 12px; text-align:left; font-size:13px; color:#6b7280; font-weight:600; border-bottom:2px solid #e5e7eb;">직무명</th>
          <th style="padding:10px 12px; text-align:left; font-size:13px; color:#6b7280; font-weight:600; border-bottom:2px solid #e5e7eb;">설명</th>
          <th style="padding:10px 12px; text-align:center; font-size:13px; color:#6b7280; font-weight:600; border-bottom:2px solid #e5e7eb;">매칭률</th>
          <th style="padding:10px 12px; text-align:left; font-size:13px; color:#6b7280; font-weight:600; border-bottom:2px solid #e5e7eb;">기술 스택</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function buildTrackSection(track: TrackRecommendPayload | null): string {
  if (!track) {
    return '<p style="color:#9ca3af;">트랙 추천 데이터가 없습니다.</p>';
  }

  const primaryCards = track.primary
    .map(
      (t) => `
      <div style="
        border:${t.emphasized ? `2px solid ${BRAND_COLOR}` : '1px solid #e5e7eb'};
        border-radius:8px;
        padding:16px;
        margin-bottom:12px;
        background:${t.emphasized ? BRAND_LIGHT : '#f9fafb'};
      ">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
          <span style="
            padding:2px 8px;
            border-radius:999px;
            background:${t.emphasized ? BRAND_COLOR : '#9ca3af'};
            color:#fff;
            font-size:12px;
            font-weight:700;
          ">${t.rank}순위</span>
          <span style="font-size:16px; font-weight:700; color:#111827;">${escapeHtml(t.title)}</span>
        </div>
        <p style="margin:0 0 6px; font-size:13px; color:#374151;">${escapeHtml(t.coreSubjects)}</p>
        <p style="margin:0; font-size:13px; color:#6b7280;">관련 직무: ${t.relatedJobs.map(escapeHtml).join(', ')}</p>
      </div>`,
    )
    .join('');

  const requiredList = track.requiredCourses
    .map((c) => `<li style="margin-bottom:4px; color:#374151;">${escapeHtml(c)}</li>`)
    .join('');

  return `
    ${primaryCards}
    <div style="margin-top:16px;">
      <p style="margin:0 0 8px; font-size:14px; font-weight:600; color:#111827;">필수 과목</p>
      <ul style="margin:0; padding-left:20px;">${requiredList}</ul>
    </div>
    <div style="
      margin-top:12px;
      padding:12px;
      background:#fffbeb;
      border-left:3px solid #f59e0b;
      border-radius:4px;
    ">
      <p style="margin:0; font-size:13px; color:#92400e;">${escapeHtml(track.prerequisiteNote)}</p>
    </div>
    <div style="margin-top:12px; padding:12px; background:#f0fdf4; border-radius:6px;">
      <p style="margin:0 0 4px; font-size:13px; font-weight:600; color:#166534;">AI 시너지 분석</p>
      <p style="margin:0; font-size:13px; color:#374151;">${escapeHtml(track.llmSynergy)}</p>
    </div>`;
}

function buildRoadmapSection(roadmap: RoadmapPayload | null): string {
  if (!roadmap) {
    return '<p style="color:#9ca3af;">로드맵 데이터가 없습니다.</p>';
  }

  const STAGE_COLORS: Record<number, { bg: string; text: string }> = {
    1: { bg: '#dbeafe', text: '#1d4ed8' },
    2: { bg: BRAND_LIGHT, text: BRAND_COLOR },
    3: { bg: '#fef3c7', text: '#92400e' },
    4: { bg: '#fce7f3', text: '#9d174d' },
  };

  const steps = roadmap.steps
    .map((step) => {
      const color = STAGE_COLORS[step.stage] ?? { bg: '#f3f4f6', text: '#374151' };
      const courses = step.courses
        .map(
          (c) => `
          <div style="
            padding:10px 12px;
            border-radius:6px;
            background:#f9fafb;
            margin-bottom:8px;
          ">
            <p style="margin:0 0 3px; font-size:14px; font-weight:600; color:#111827;">${escapeHtml(c.name)}</p>
            <p style="margin:0; font-size:12px; color:#6b7280;">${escapeHtml(c.description)}</p>
            ${c.prerequisiteUnmet ? `<p style="margin:4px 0 0; font-size:12px; color:#d97706;">△ 선수과목 미이수: ${escapeHtml(c.prerequisiteUnmet)}</p>` : ''}
          </div>`,
        )
        .join('');

      return `
        <div style="margin-bottom:20px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
            <span style="
              padding:4px 14px;
              border-radius:999px;
              background:${color.bg};
              color:${color.text};
              font-size:13px;
              font-weight:700;
            ">STEP ${step.stage}</span>
            <span style="font-size:15px; font-weight:700; color:#111827;">${escapeHtml(step.label)}</span>
          </div>
          ${courses}
        </div>`;
    })
    .join('');

  const nextSem = roadmap.semesterGuide.nextSemester
    .map((c) => `<span style="display:inline-block; padding:3px 10px; background:${BRAND_LIGHT}; color:${BRAND_COLOR}; border-radius:999px; font-size:12px; margin:3px 2px;">${escapeHtml(c)}</span>`)
    .join('');

  const afterNextSem = roadmap.semesterGuide.afterNextSemester
    .map((c) => `<span style="display:inline-block; padding:3px 10px; background:#f3f4f6; color:#374151; border-radius:999px; font-size:12px; margin:3px 2px;">${escapeHtml(c)}</span>`)
    .join('');

  return `
    ${steps}
    <div style="
      margin-top:8px;
      padding:16px;
      background:#f9fafb;
      border-radius:8px;
      border:1px solid #e5e7eb;
    ">
      <p style="margin:0 0 8px; font-size:14px; font-weight:700; color:#111827;">학기 수강 가이드</p>
      <p style="margin:0 0 6px; font-size:13px; color:#6b7280; font-weight:600;">다음 학기 추천</p>
      <div style="margin-bottom:10px;">${nextSem}</div>
      <p style="margin:0 0 6px; font-size:13px; color:#6b7280; font-weight:600;">그 다음 학기 추천</p>
      <div>${afterNextSem}</div>
    </div>`;
}

function sectionTitle(title: string): string {
  return `
    <div style="
      display:flex;
      align-items:center;
      gap:10px;
      margin:32px 0 16px;
    ">
      <div style="width:4px; height:22px; background:${BRAND_COLOR}; border-radius:2px;"></div>
      <h2 style="margin:0; font-size:18px; font-weight:700; color:#111827;">${escapeHtml(title)}</h2>
    </div>`;
}

export function buildRecommendPdfHtml(
  jobs: JobRecommendation[],
  trackRecommend: TrackRecommendPayload | null,
  roadmap: RoadmapPayload | null,
): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <title>Tracktory 학습경로 추천 결과</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Noto Sans KR', sans-serif;
      margin: 0;
      padding: 40px 48px;
      color: #111827;
      background: #fff;
      font-size: 14px;
      line-height: 1.6;
    }
    @media print {
      body { padding: 20px 24px; }
    }
  </style>
</head>
<body>
  <!-- 커버 헤더 -->
  <div style="
    padding: 28px 32px;
    background: linear-gradient(135deg, ${BRAND_COLOR} 0%, #0d9488 100%);
    border-radius: 12px;
    color: #fff;
    margin-bottom: 8px;
  ">
    <p style="margin:0 0 6px; font-size:13px; opacity:0.85; letter-spacing:0.05em;">TRACKTORY</p>
    <h1 style="margin:0 0 8px; font-size:26px; font-weight:700;">학습경로 추천 결과</h1>
    <p style="margin:0; font-size:13px; opacity:0.85;">생성일: ${formatDate()}</p>
  </div>

  <!-- 섹션 1 – 직무 추천 -->
  ${sectionTitle('직무 추천')}
  ${buildJobSection(jobs)}

  <!-- 섹션 2 – 트랙 추천 -->
  ${sectionTitle('트랙 추천')}
  ${buildTrackSection(trackRecommend)}

  <!-- 섹션 3 – 학습 로드맵 -->
  ${sectionTitle('학습 로드맵')}
  ${buildRoadmapSection(roadmap)}

  <!-- 푸터 -->
  <div style="
    margin-top:48px;
    padding-top:16px;
    border-top:1px solid #e5e7eb;
    text-align:center;
    color:#9ca3af;
    font-size:12px;
  ">
    본 보고서는 Tracktory 앱에서 자동 생성된 학습경로 추천 결과입니다.
    실제 수강 신청 시 학사 안내 및 트랙 운영 규정을 반드시 확인하세요.
  </div>
</body>
</html>`;
}
