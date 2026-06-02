import type { JobRecommendation } from '../data/mockRecommendData';
import type { TrackRecommendPayload } from '../data/mockTrackRecommendData';
import type { RoadmapPayload, SemesterTiming } from '../data/mockRoadmapData';
import { applyStudentGradeToSemesterSteps } from './roadmapTiming';

export interface GeneratePdfOptions {
  jobs: JobRecommendation[];
  trackRecommend: TrackRecommendPayload | null;
  roadmap: RoadmapPayload | null;
  completedCourses: string[];
  studentGrade?: number | null;
  studentName?: string;
  generatedAt?: string;
}

export type ReportMeta = {
  studentName?: string;
  studentGrade?: number | null;
  generatedAt: string;
};

const EMPTY_MSG = '<p class="report-empty">해당 추천 데이터가 없습니다.</p>';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatGeneratedAt(iso?: string): string {
  if (iso) {
    try {
      return new Date(iso).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  }
  return new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function sectionClass(newPage: boolean): string {
  return newPage ? 'report-section report-section-newpage' : 'report-section';
}

function buildReportMetaLine(meta: ReportMeta): string {
  const name = meta.studentName?.trim() || '—';
  const grade =
    meta.studentGrade != null && meta.studentGrade >= 1
      ? `${meta.studentGrade}학년`
      : '—';
  const date = formatGeneratedAt(meta.generatedAt);
  return `<p class="report-meta-line">학생: ${escapeHtml(name)} · ${escapeHtml(grade)} · 작성일: ${escapeHtml(date)}</p>`;
}

function isCourseDoneForPdf(
  completed: boolean | undefined,
  courseName: string,
  completedCourses: string[],
  stepTiming: SemesterTiming
): boolean {
  if (stepTiming !== 'past') {
    return completedCourses.includes(courseName);
  }
  if (completed === true) return true;
  if (completed === false) return false;
  return completedCourses.includes(courseName);
}

/** 1. 직무 추천 — 보고서 본문 */
export function buildJobsSectionBody(jobs: JobRecommendation[]): string {
  if (jobs.length === 0) {
    return `
    <section class="${sectionClass(false)}">
      <h2 class="report-section-title">1. 직무 추천</h2>
      ${EMPTY_MSG}
    </section>`;
  }

  const rows = jobs
    .map(
      (job, i) => `
      <tr>
        <td class="col-center">${i + 1}</td>
        <td>${escapeHtml(job.title)}</td>
        <td class="col-center">${job.matchScore > 0 ? `${job.matchScore}%` : '—'}</td>
        <td>${escapeHtml(job.reasoning || job.description || '—')}</td>
        <td>${
          job.techStack.length > 0
            ? escapeHtml(job.techStack.join(', '))
            : job.techStackReady === false
              ? '수집 중'
              : '—'
        }</td>
      </tr>`
    )
    .join('');

  return `
  <section class="${sectionClass(false)}">
    <h2 class="report-section-title">1. 직무 추천</h2>
    <p class="report-lead">나의 역량과 관심사를 바탕으로 추천된 직무 목록입니다.</p>
    <table class="report-table">
      <thead>
        <tr>
          <th class="col-narrow">순위</th>
          <th>직무명</th>
          <th class="col-narrow">적합도</th>
          <th>추천 근거</th>
          <th>기술 스택</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </section>`;
}

/** 2. 트랙 추천 — 보고서 본문 */
export function buildTrackSectionBody(
  track: TrackRecommendPayload | null,
  newPage = false
): string {
  if (!track || track.primary.length === 0) {
    return `
    <section class="${sectionClass(newPage)}">
      <h2 class="report-section-title">2. 트랙 추천</h2>
      ${EMPTY_MSG}
    </section>`;
  }

  const trackNames = track.primary.map((t) => t.title).filter(Boolean).join(' + ');
  let summary = '';
  if (track.combinationScore != null && trackNames) {
    summary = `시너지 점수 ${track.combinationScore} · ${escapeHtml(trackNames)}`;
  } else if (track.combinationScore != null) {
    summary = `시너지 점수 ${track.combinationScore}`;
  } else if (trackNames) {
    summary = escapeHtml(trackNames);
  }

  const summaryBlock =
    summary || track.combinationReasoning.trim()
      ? `<div class="report-summary">
          ${summary ? `<p><strong>조합 요약:</strong> ${summary}</p>` : ''}
          ${track.combinationReasoning.trim() ? `<p><strong>선택 이유:</strong> ${escapeHtml(track.combinationReasoning)}</p>` : ''}
        </div>`
      : '';

  const primaryRows = track.primary
    .map(
      (t) => `
      <tr>
        <td>${escapeHtml(t.rankLabel)}</td>
        <td>${escapeHtml(t.title)}</td>
        <td class="col-center">${t.score != null ? t.score : '—'}</td>
        <td>${escapeHtml(t.reasoning || '—')}</td>
        <td>${t.coreSubjects.length > 0 ? escapeHtml(t.coreSubjects.join(', ')) : '—'}</td>
        <td>${t.relatedJobs.length > 0 ? escapeHtml(t.relatedJobs.join(', ')) : '—'}</td>
      </tr>`
    )
    .join('');

  const secondaryBlock =
    track.secondary.length > 0
      ? `
      <h3 class="report-subtitle">보조 추천 트랙</h3>
      <table class="report-table">
        <thead>
          <tr><th>트랙명</th><th class="col-narrow">시너지</th><th>설명</th></tr>
        </thead>
        <tbody>
          ${track.secondary
            .map(
              (t) => `
            <tr>
              <td>${escapeHtml(t.name)}</td>
              <td class="col-center">${t.score != null ? t.score : '—'}</td>
              <td>${escapeHtml(t.reasoning || '—')}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>`
      : '';

  const requiredList =
    track.requiredCourses.length > 0
      ? `<ol class="report-ol">${track.requiredCourses.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}</ol>`
      : '<p class="report-muted">—</p>';

  return `
  <section class="${sectionClass(newPage)}">
    <h2 class="report-section-title">2. 트랙 추천</h2>
    ${summaryBlock}
    <h3 class="report-subtitle">주·부 트랙</h3>
    <table class="report-table">
      <thead>
        <tr>
          <th>구분</th>
          <th>트랙명</th>
          <th class="col-narrow">시너지</th>
          <th>선택 이유</th>
          <th>주요 과목</th>
          <th>연계 직무</th>
        </tr>
      </thead>
      <tbody>${primaryRows}</tbody>
    </table>
    ${secondaryBlock}
    <h3 class="report-subtitle">AI 시너지 분석</h3>
    <p class="report-body">${escapeHtml(track.llmSynergy || '—')}</p>
    <h3 class="report-subtitle">필수 과목</h3>
    ${requiredList}
    ${
      track.prerequisiteNote.trim()
        ? `<p class="report-note"><strong>선수과목 안내:</strong> ${escapeHtml(track.prerequisiteNote)}</p>`
        : ''
    }
  </section>`;
}

/** 3. 학습 로드맵 — 보고서 본문 */
export function buildRoadmapSectionBody(
  roadmap: RoadmapPayload | null,
  completedCourses: string[],
  studentGrade: number | null | undefined,
  newPage = false
): string {
  if (!roadmap || roadmap.semesterSteps.length === 0) {
    return `
    <section class="${sectionClass(newPage)}">
      <h2 class="report-section-title">3. 학습 로드맵</h2>
      ${EMPTY_MSG}
    </section>`;
  }

  const steps = applyStudentGradeToSemesterSteps(
    roadmap.semesterSteps,
    studentGrade ?? null
  );

  const semesterBlocks = steps
    .map((step) => {
      const isPast = step.timing === 'past';
      const courseRows = step.courses
        .map((c) => {
          const done = isCourseDoneForPdf(
            c.completed,
            c.name,
            completedCourses,
            step.timing
          );
          return `
          <tr class="${done ? 'row-done' : ''}">
            <td>${escapeHtml(c.name)}</td>
            <td class="col-center">${c.credits}</td>
            <td class="col-center">${done ? '이수' : '—'}</td>
          </tr>`;
        })
        .join('');

      return `
      <div class="report-semester">
        <h3 class="report-subtitle">${step.year}학년 ${step.semester}학기 · ${escapeHtml(step.stageLabel)}${isPast ? ' (이수)' : ''} · ${step.totalCredits}학점</h3>
        <table class="report-table">
          <thead>
            <tr><th>과목명</th><th class="col-narrow">학점</th><th class="col-narrow">이수</th></tr>
          </thead>
          <tbody>${courseRows}</tbody>
        </table>
      </div>`;
    })
    .join('');

  const { nextSemester, afterNextSemester } = roadmap.semesterGuide;
  const guideBlock =
    nextSemester.length > 0 || afterNextSemester.length > 0
      ? `
      <h3 class="report-subtitle">수강 가이드</h3>
      ${nextSemester.length > 0 ? `<p class="report-body"><strong>다음 학기:</strong> ${nextSemester.map(escapeHtml).join(', ')}</p>` : ''}
      ${afterNextSemester.length > 0 ? `<p class="report-body"><strong>그 다음 학기:</strong> ${afterNextSemester.map(escapeHtml).join(', ')}</p>` : ''}`
      : '';

  return `
  <section class="${sectionClass(newPage)}">
    <h2 class="report-section-title">3. 학습 로드맵</h2>
    <p class="report-lead">${escapeHtml(roadmap.connectionMessage)}</p>
    ${semesterBlocks}
    ${guideBlock}
  </section>`;
}

export const REPORT_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4; margin: 18mm; }
  body {
    font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', Arial, sans-serif;
    color: #1a1a1a;
    font-size: 11pt;
    line-height: 1.55;
  }

  .report-meta-line {
    font-size: 10pt;
    color: #444;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #ddd;
  }

  .report-section {
    margin-bottom: 8px;
    page-break-inside: avoid;
    break-inside: avoid-page;
  }
  .report-section-newpage {
    page-break-before: always;
    break-before: page;
    -webkit-column-break-before: page;
  }
  .report-section-title {
    font-size: 14pt;
    font-weight: 700;
    margin-bottom: 10px;
    padding-bottom: 4px;
    border-bottom: 1px solid #333;
  }
  .report-subtitle {
    font-size: 11pt;
    font-weight: 700;
    margin: 14px 0 8px;
    color: #333;
  }
  .report-lead { margin-bottom: 12px; color: #444; }
  .report-body { margin-bottom: 10px; color: #333; }
  .report-summary {
    background: #f8f8f8;
    border: 1px solid #ddd;
    padding: 10px 12px;
    margin-bottom: 14px;
    font-size: 10.5pt;
  }
  .report-summary p { margin-bottom: 4px; }
  .report-summary p:last-child { margin-bottom: 0; }
  .report-note {
    margin-top: 12px;
    padding: 10px;
    background: #fafafa;
    border-left: 3px solid #666;
    font-size: 10pt;
  }
  .report-muted { color: #888; }
  .report-empty {
    color: #666;
    font-style: italic;
    padding: 16px 0;
  }

  .report-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
    font-size: 10pt;
  }
  .report-table th,
  .report-table td {
    border: 1px solid #bbb;
    padding: 7px 9px;
    vertical-align: top;
    text-align: left;
  }
  .report-table th {
    background: #eee;
    font-weight: 700;
  }
  .report-table .col-center { text-align: center; }
  .report-table .col-narrow { width: 56px; text-align: center; }
  .report-table .row-done td { color: #888; }

  .report-ol {
    margin: 0 0 12px 20px;
    font-size: 10pt;
  }
  .report-ol li { margin-bottom: 4px; }
  .report-semester { margin-bottom: 14px; }
`;

/** 섹션 본문을 단일 인쇄용 HTML 문서로 감쌈 */
export function wrapReportDocument(sectionBody: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>${REPORT_CSS}</style>
</head>
<body>
${sectionBody}
</body>
</html>`;
}

function buildReportMeta(options: GeneratePdfOptions): ReportMeta {
  return {
    studentName: options.studentName,
    studentGrade: options.studentGrade,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
  };
}

function buildAllSectionBodies(options: GeneratePdfOptions): [string, string, string] {
  return [
    buildJobsSectionBody(options.jobs),
    buildTrackSectionBody(options.trackRecommend, true),
    buildRoadmapSectionBody(
      options.roadmap,
      options.completedCourses,
      options.studentGrade,
      true
    ),
  ];
}

/** 직무·트랙·로드맵 단일 HTML (항상 3섹션, 섹션 간 강제 페이지 나눔) */
export function buildCombinedReportPdf(options: GeneratePdfOptions): string {
  const meta = buildReportMeta(options);
  const [jobBody, trackBody, roadmapBody] = buildAllSectionBodies(options);
  const combined = buildReportMetaLine(meta) + jobBody + trackBody + roadmapBody;
  return wrapReportDocument(combined);
}

/** @deprecated — buildCombinedReportPdf 사용 권장 */
export function buildRecommendPdfSections(options: GeneratePdfOptions): [string, string, string] {
  return buildAllSectionBodies(options).map((body) => wrapReportDocument(body)) as [
    string,
    string,
    string,
  ];
}

export function generateRecommendPdf(options: GeneratePdfOptions): string {
  return buildCombinedReportPdf(options);
}
