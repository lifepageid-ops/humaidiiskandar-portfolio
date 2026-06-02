import React from 'react';
import { MoodType } from '../types';

type MoodAvatarProps = {
  mood: MoodType;
  className?: string;
};

const expression = {
  Happy: {
    mouth: 'M33 45 C36 50, 44 50, 47 45',
    leftEye: 'M31 35 C32 34, 34 34, 35 35',
    rightEye: 'M45 35 C46 34, 48 34, 49 35',
    extra: 'happy'
  },
  Stressed: {
    mouth: 'M34 48 C37 45, 43 45, 46 48',
    leftEye: 'M31 36 L35 34',
    rightEye: 'M45 34 L49 36',
    extra: 'stress'
  },
  Tired: {
    mouth: 'M35 47 C38 48, 42 48, 45 47',
    leftEye: 'M31 36 C33 37, 35 37, 37 36',
    rightEye: 'M43 36 C45 37, 47 37, 49 36',
    extra: 'tired'
  },
  Social: {
    mouth: 'M34 45 C37 49, 43 49, 46 45',
    leftEye: 'M31 35 C32 34, 34 34, 35 35',
    rightEye: 'M44 35 C46 33, 49 33, 51 35',
    extra: 'social'
  },
  Neutral: {
    mouth: 'M35 47 L45 47',
    leftEye: 'M32 35 C33 34, 35 34, 36 35',
    rightEye: 'M44 35 C45 34, 47 34, 48 35',
    extra: 'neutral'
  }
} as const;

function MoodAvatar({ mood, className = 'w-8 h-8' }: MoodAvatarProps) {
  const exp = expression[mood];
  const accent = mood === 'Happy'
    ? '#34D399'
    : mood === 'Stressed'
      ? '#FBBF24'
      : mood === 'Tired'
        ? '#A5B4FC'
        : mood === 'Social'
          ? '#7DD3FC'
          : '#CBD5E1';

  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="40" cy="40" r="36" fill="#172033" />
      <circle cx="40" cy="40" r="34" stroke={accent} strokeOpacity="0.35" strokeWidth="2" />
      <path d="M34 58 H46 L49 68 H31 L34 58Z" fill="#B87653" />
      <path d="M22 75 C24 63, 31 58, 40 58 C49 58, 56 63, 58 75 H22Z" fill="#1F6FEB" />
      <path d="M30 64 C34 67, 46 67, 50 64" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
      <path d="M23 35 C23 22, 31 13, 40 13 C49 13, 57 22, 57 35 C57 50, 50 61, 40 61 C30 61, 23 50, 23 35Z" fill="#C98762" />
      <path d="M22 32 C22 18, 31 9, 42 9 C52 9, 58 17, 58 29 C54 24, 49 23, 43 23 C36 23, 31 21, 26 27 C25 29, 24 31, 22 32Z" fill="#111827" />
      <path d="M24 31 C29 23, 36 21, 45 22" stroke="#273449" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M22 36 C18 37, 18 46, 23 47" fill="#B87653" />
      <path d="M58 36 C62 37, 62 46, 57 47" fill="#B87653" />
      <path d={mood === 'Stressed' ? 'M29 31 L36 29' : 'M30 31 C32 30, 35 30, 37 31'} stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" />
      <path d={mood === 'Stressed' ? 'M44 29 L51 31' : 'M43 31 C45 30, 48 30, 50 31'} stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" />
      <path d={exp.leftEye} stroke="#111827" strokeWidth="2.4" strokeLinecap="round" />
      <path d={exp.rightEye} stroke="#111827" strokeWidth="2.4" strokeLinecap="round" />
      <path d={exp.mouth} stroke="#7F1D1D" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M40 36 C39 40, 38 42, 40 43" stroke="#9A5E43" strokeWidth="1.8" strokeLinecap="round" />
      {(mood === 'Happy' || mood === 'Social') && (
        <>
          <ellipse cx="29" cy="42" rx="3.5" ry="2" fill="#F8A6A6" opacity="0.45" />
          <ellipse cx="51" cy="42" rx="3.5" ry="2" fill="#F8A6A6" opacity="0.45" />
        </>
      )}
      {exp.extra === 'stress' && (
        <>
          <path d="M56 24 C61 23, 63 28, 59 31" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
          <path d="M55 38 C58 42, 54 46, 52 42 C51 40, 53 38, 55 38Z" fill="#60A5FA" />
        </>
      )}
      {exp.extra === 'tired' && (
        <>
          <path d="M55 18 H63 L56 26 H64" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M31 40 H36" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
          <path d="M44 40 H49" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        </>
      )}
      {exp.extra === 'social' && (
        <>
          <path d="M58 23 C63 22, 66 26, 63 30 C61 32, 58 31, 57 29" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" />
          <circle cx="58" cy="21" r="2" fill="#7DD3FC" />
        </>
      )}
      {exp.extra === 'neutral' && <circle cx="58" cy="25" r="2" fill="#CBD5E1" opacity="0.8" />}
      {exp.extra === 'happy' && <path d="M55 25 C58 23, 61 25, 61 28" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  );
}

export const moodOptions: Array<{
  value: MoodType;
  label: string;
  helper: string;
  Icon: React.FC<{ className?: string }>;
  tone: string;
}> = [
  {
    value: 'Happy',
    label: 'Happy',
    helper: 'Optimis',
    Icon: (props) => <MoodAvatar mood="Happy" {...props} />,
    tone: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25'
  },
  {
    value: 'Stressed',
    label: 'Stressed',
    helper: 'Tegang',
    Icon: (props) => <MoodAvatar mood="Stressed" {...props} />,
    tone: 'text-amber-300 bg-amber-500/10 border-amber-500/25'
  },
  {
    value: 'Tired',
    label: 'Tired',
    helper: 'Lelah',
    Icon: (props) => <MoodAvatar mood="Tired" {...props} />,
    tone: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/25'
  },
  {
    value: 'Social',
    label: 'Social',
    helper: 'Hangout',
    Icon: (props) => <MoodAvatar mood="Social" {...props} />,
    tone: 'text-sky-300 bg-sky-500/10 border-sky-500/25'
  },
  {
    value: 'Neutral',
    label: 'Neutral',
    helper: 'Stabil',
    Icon: (props) => <MoodAvatar mood="Neutral" {...props} />,
    tone: 'text-slate-300 bg-slate-500/10 border-slate-500/25'
  }
];

export function getMoodMeta(value?: MoodType) {
  return moodOptions.find((mood) => mood.value === value) ?? moodOptions[4];
}