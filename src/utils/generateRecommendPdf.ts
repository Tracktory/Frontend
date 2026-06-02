import type { JobRecommendation } from '../data/mockRecommendData';
import type { TrackRecommendPayload } from '../data/mockTrackRecommendData';
import type { RoadmapPayload } from '../data/mockRoadmapData';
import { applyStudentGradeToSemesterSteps } from './roadmapTiming';

export interface GeneratePdfOptions {
  jobs: JobRecommendation[];
  trackRecommend: TrackRecommendPayload | null;
  roadmap: RoadmapPayload | null;
  completedCourses: string[];
  studentGrade?: number | null;
}

const STAGE_COLORS: Record<number, string> = {
  1: '#4CAF93',
  2: '#5B8DEF',
  3: '#F5A623',
  4: '#E05C5C',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildJobsPage(jobs: JobRecommendation[]): string {
  const cards = jobs
    .map(
      (job) => `
      <div class="card">
        <div class="card-header">
          <span class="card-title">${escapeHtml(job.title)}</span>
          ${job.matchScore > 0 ? `<span class="score-badge">${job.matchScore}%</span>` : ''}
        </div>
        ${job.description ? `<p class="card-desc">${escapeHtml(job.description)}</p>` : ''}
        ${job.reasoning ? `<p class="card-reasoning">추천 이유: ${escapeHtml(job.reasoning)}</p>` : ''}
        ${
          job.techStack.length > 0
            ? `<div class="chips">${job.techStack.map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join('')}</div>`
            : job.techStackReady === false
              ? '<span class="collecting-badge">수집 중</span>'
              : ''
        }
      </div>`
    )
    .join('');

  return `
  <div class="page">
    <h1 class="page-title">직무 추천</h1>
    <p class="page-subtitle">나의 역량과 관심사를 바탕으로 추천된 직무입니다.</p>
    ${cards}
  </div>`;
}

function buildTrackPage(track: TrackRecommendPayload): string {
  const trackNames = track.primary.map((t) => t.title).filter(Boolean).join(' + ');
  const combinationHeadline =
    track.combinationScore != null && trackNames
      ? `시너지 점수 ${track.combinationScore} : ${escapeHtml(trackNames)}`
      : track.combinationScore != null
        ? `시너지 점수 ${track.combinationScore}`
        : trackNames
          ? escapeHtml(trackNames)
          : '';
  const combinationReasoning = track.combinationReasoning.trim()
    ? `<p class="card-desc">선택 이유 : ${escapeHtml(track.combinationReasoning)}</p>`
    : '';

  const primaryCards = track.primary
    .map(
      (t) => `
      <div class="card">
        <div class="card-header">
          <span class="card-title">${escapeHtml(t.title)}</span>
          ${t.score != null ? `<span class="match-score">시너지 ${t.score}</span>` : ''}
        </div>
        <p class="card-meta">${escapeHtml(t.rankLabel)}</p>
        ${t.reasoning ? `<p class="card-desc">선택 이유: ${escapeHtml(t.reasoning)}</p>` : ''}
        ${
          t.coreSubjects.length > 0
            ? `<div class="chips">${t.coreSubjects.map((s) => `<span class="chip">${escapeHtml(s)}</span>`).join('')}</div>`
            : ''
        }
        ${
          t.relatedJobs.length > 0
            ? `<p class="card-desc">연계 직무: ${escapeHtml(t.relatedJobs.join(', '))}</p>`
            : ''
        }
      </div>`
    )
    .join('');

  const secondaryCards = track.secondary
    .map(
      (t) => `
      <div class="card card-muted">
        <div class="card-header">
          <span class="card-title">${escapeHtml(t.name)}</span>
          ${t.score != null ? `<span class="match-score">시너지 ${t.score}</span>` : ''}
        </div>
        ${t.reasoning ? `<p class="card-desc">${escapeHtml(t.reasoning)}</p>` : ''}
      </div>`
    )
    .join('');

  const requiredList = track.requiredCourses
    .map((c) => `<li>${escapeHtml(c)}</li>`)
    .join('');

  return `
  <div class="page">
    <h1 class="page-title">트랙 추천</h1>
    ${combinationHeadline ? `<p class="page-subtitle">${combinationHeadline}</p>` : ''}
    ${combinationReasoning}
    ${primaryCards}
    ${secondaryCards.length > 0 ? `<div class="section"><h2 class="section-title">보조 추천</h2>${secondaryCards}</div>` : ''}
    <div class="section">
      <h2 class="section-title">AI 시너지 분석</h2>
      <p class="card-desc">${escapeHtml(track.llmSynergy)}</p>
    </div>
    <div class="section">
      <h2 class="section-title">필수 과목</h2>
      <ul class="course-list">${requiredList}</ul>
    </div>
    <div class="section note">
      <p>${escapeHtml(track.prerequisiteNote)}</p>
    </div>
  </div>`;
}

function buildRoadmapPage(
  roadmap: RoadmapPayload,
  completedCourses: string[],
  studentGrade: number | null | undefined
): string {
  const steps = applyStudentGradeToSemesterSteps(
    roadmap.semesterSteps,
    studentGrade ?? null
  );
  const semesterCards = steps
    .map((step) => {
      const stageColor = STAGE_COLORS[step.stageNumber] ?? '#888';
      const isPast = step.timing === 'past';
      const courseRows = step.courses
        .map((c) => {
          const done =
            c.completed === true ||
            (c.completed !== false && completedCourses.includes(c.name));
          return `
          <tr class="${done || isPast ? 'row-done' : ''}">
            <td class="dot-cell"><span class="dot" style="background:${done || isPast ? '#ccc' : stageColor}"></span></td>
            <td class="course-name">${escapeHtml(c.name)}</td>
            <td class="course-credit">${c.credits}학점</td>
            <td class="course-status">${done ? '✓' : '—'}</td>
          </tr>`;
        })
        .join('');

      return `
      <div class="sem-card ${isPast ? 'sem-past' : ''}">
        <div class="sem-header">
          <span class="sem-title">${step.year}학년 ${step.semester}학기${isPast ? ' (이수)' : ''}</span>
          <span class="stage-badge" style="color:${stageColor};background:${stageColor}22">${escapeHtml(step.stageLabel)}</span>
          <span class="sem-credits">${step.totalCredits}학점</span>
        </div>
        <table class="course-table">
          <tbody>${courseRows}</tbody>
        </table>
      </div>`;
    })
    .join('');

  const { nextSemester, afterNextSemester } = roadmap.semesterGuide;
  const guideSection =
    nextSemester.length > 0 || afterNextSemester.length > 0
      ? `
      <div class="section">
        <h2 class="section-title">수강 가이드</h2>
        ${nextSemester.length > 0 ? `<p><strong>다음 학기 추천:</strong> ${nextSemester.map(escapeHtml).join(', ')}</p>` : ''}
        ${afterNextSemester.length > 0 ? `<p><strong>그 다음 학기 추천:</strong> ${afterNextSemester.map(escapeHtml).join(', ')}</p>` : ''}
      </div>`
      : '';

  return `
  <div class="page">
    <h1 class="page-title">학습 로드맵</h1>
    <p class="page-subtitle">${escapeHtml(roadmap.connectionMessage)}</p>
    ${semesterCards}
    ${guideSection}
  </div>`;
}

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, Arial, sans-serif; color: #111; font-size: 13px; }

  .page { padding: 36px 40px; page-break-after: always; }
  .page:last-child { page-break-after: avoid; }

  .page-title { font-size: 22px; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
  .page-subtitle { font-size: 13px; color: #666; margin-bottom: 20px; }

  .card {
    border: 1.5px solid #E5E7EB;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 12px;
  }
  .card-primary { border-color: #4CAF93; background: #f0faf6; }
  .card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .card-title { font-size: 15px; font-weight: 700; color: #1a1a1a; }
  .card-desc { font-size: 12px; color: #555; line-height: 1.6; margin-bottom: 8px; }
  .card-reasoning { font-size: 11px; color: #888; line-height: 1.5; margin-bottom: 8px; }
  .collecting-badge {
    font-size: 11px; font-weight: 600; color: #b45309;
    background: #fef3c7; border-radius: 100px; padding: 3px 10px; display: inline-block;
  }

  .score-badge {
    margin-left: auto;
    font-size: 13px; font-weight: 700; color: #4CAF93;
    background: #e8f7f2; border-radius: 100px; padding: 2px 10px;
  }
  .rank-badge {
    font-size: 11px; font-weight: 700; color: #4CAF93;
    background: #e8f7f2; border-radius: 100px; padding: 2px 8px;
  }

  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip {
    font-size: 11px; font-weight: 600; color: #4CAF93;
    background: #e8f7f2; border-radius: 100px; padding: 3px 10px;
    border: 1px solid #b2e4d4;
  }

  .section { margin-top: 16px; }
  .section-title { font-size: 13px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .course-list { padding-left: 18px; color: #333; line-height: 2; }
  .note { background: #f9f9f9; border-radius: 8px; padding: 12px; }
  .note p { font-size: 12px; color: #555; line-height: 1.6; }

  .sem-card { border: 1.5px solid #E5E7EB; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; }
  .sem-past { background: #f9fafb; border-color: #e5e7eb; }
  .sem-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .sem-title { font-size: 14px; font-weight: 700; color: #1a1a1a; }
  .stage-badge { font-size: 11px; font-weight: 700; border-radius: 100px; padding: 2px 10px; }
  .sem-credits { margin-left: auto; font-size: 12px; font-weight: 600; color: #4CAF93; }

  .course-table { width: 100%; border-collapse: collapse; }
  .course-table td { padding: 7px 4px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
  .course-table tr:last-child td { border-bottom: none; }
  .row-done td { color: #aaa; }

  .dot-cell { width: 18px; }
  .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
  .course-name { font-size: 13px; font-weight: 500; }
  .course-credit { font-size: 12px; color: #888; text-align: right; width: 50px; }
  .course-status { font-size: 13px; font-weight: 700; text-align: center; width: 28px; }
`;

export function generateRecommendPdf({
  jobs,
  trackRecommend,
  roadmap,
  completedCourses,
  studentGrade,
}: GeneratePdfOptions): string {
  const pages = [
    buildJobsPage(jobs),
    trackRecommend ? buildTrackPage(trackRecommend) : '',
    roadmap ? buildRoadmapPage(roadmap, completedCourses, studentGrade) : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>${CSS}</style>
</head>
<body>
${pages}
</body>
</html>`;
}
