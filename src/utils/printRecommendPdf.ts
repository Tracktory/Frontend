import { Alert, Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {
  readAsStringAsync,
  writeAsStringAsync,
  StorageAccessFramework,
  EncodingType,
} from 'expo-file-system/legacy';

import { buildCombinedReportPdf, type GeneratePdfOptions } from './generateRecommendPdf';

const PDF_FILENAME = 'tracktory_recommendation.pdf';

/** A4 @ 96dpi (px) */
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const PAGE_MARGINS = { top: 24, right: 24, bottom: 24, left: 24 };

async function sharePdfUri(uri: string): Promise<void> {
  if (Platform.OS === 'android') {
    const perms = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!perms.granted) return;

    const base64 = await readAsStringAsync(uri, {
      encoding: EncodingType.Base64,
    });
    const dest = await StorageAccessFramework.createFileAsync(
      perms.directoryUri,
      PDF_FILENAME,
      'application/pdf'
    );
    await writeAsStringAsync(dest, base64, {
      encoding: EncodingType.Base64,
    });
    Alert.alert('저장 완료', '선택한 폴더에 PDF가 저장되었습니다.');
    return;
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: '추천 결과 PDF 저장',
  });
}

async function printPdfNative(html: string): Promise<string> {
  const { uri } = await Print.printToFileAsync({
    html,
    width: A4_WIDTH,
    height: A4_HEIGHT,
    margins: PAGE_MARGINS,
  });
  return uri;
}

/** 단일 보고서 HTML → PDF 변환 후 저장/공유 */
export async function printAndShareRecommendPdf(html: string): Promise<void> {
  if (Platform.OS === 'web') {
    const { exportPdfOnWeb } = await import('./exportPdfWeb');
    await exportPdfOnWeb(html);
    Alert.alert('저장 완료', '추천 결과 PDF가 다운로드되었습니다.');
    return;
  }

  const uri = await printPdfNative(html);
  await sharePdfUri(uri);
}

/** 추천 결과 옵션으로 PDF 생성·공유 (직무·트랙·로드맵 3섹션 포함) */
export async function printAndShareRecommendPdfFromOptions(
  options: GeneratePdfOptions
): Promise<void> {
  const html = buildCombinedReportPdf(options);
  await printAndShareRecommendPdf(html);
}

/** @deprecated buildCombinedReportPdf + printAndShareRecommendPdf 사용 */
export async function printAndShareRecommendPdfFromSections(
  _sectionHtmlDocuments: string[]
): Promise<void> {
  throw new Error(
    'printAndShareRecommendPdfFromSections is deprecated. Use printAndShareRecommendPdfFromOptions.'
  );
}
